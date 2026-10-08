import { NextResponse } from "next/server";
import { admin } from "@/lib/supabase";
import { notifyOrder } from "@/lib/notify";
import { DEFAULT_SIZES } from "@/lib/product-options";
const FREE = 3000;
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim().slice(0, 80), address = String(b.address || "").trim().slice(0, 300);
  const phone = String(b.phone || "").replace(/[\s-]/g, "");
  const payment = ["bkash", "nagad"].includes(b.payment) ? b.payment : "cod";
  const trx_id = String(b.trx_id || "").trim().toUpperCase();
  const area = b.area === "outside" ? "outside" : "dhaka";
  if (!name || !address || !/^(\+?88)?01\d{9}$/.test(phone) || !Array.isArray(b.items) || !b.items.length || b.items.length > 30)
    return NextResponse.json({ error: "Enter name, a valid Bangladeshi phone and address." }, { status: 400 });
  if (payment !== "cod" && !/^[A-Z0-9]{6,20}$/.test(trx_id))
    return NextResponse.json({ error: "Enter the transaction ID (TrxID) from your payment message." }, { status: 400 });
  const db = admin();
  const ids = [...new Set(b.items.map((i) => Number(i.id)))];
  let { data: prods, error: productError } = await db.from("products").select("id,name,price,stock,available_sizes").in("id", ids).eq("active", true);
  if (productError?.message?.includes("available_sizes")) {
    ({ data: prods, error: productError } = await db.from("products").select("id,name,price,stock").in("id", ids).eq("active", true));
  }
  if (productError) return NextResponse.json({ error: "Could not verify product sizes. Check the product schema and try again." }, { status: 500 });
  const map = Object.fromEntries((prods || []).map((p) => [p.id, p]));
  const lines = [];
  for (const i of b.items) {
    const p = map[Number(i.id)], q = Math.floor(Number(i.qty));
    if (!p || !(q >= 1 && q <= 20)) return NextResponse.json({ error: "An item is no longer available." }, { status: 400 });
    const size = String(i.size || (p.available_sizes || DEFAULT_SIZES)[0]).trim();
    const availableSizes = Array.isArray(p.available_sizes) && p.available_sizes.length ? p.available_sizes : DEFAULT_SIZES;
    if (!availableSizes.includes(size)) return NextResponse.json({ error: `${size} is not an available size for ${p.name}.` }, { status: 400 });
    lines.push({ id: p.id, name: p.name, size, qty: q, price: p.price });
  }
  const need = (id) => lines.filter((l) => l.id === id).reduce((a, l) => a + l.qty, 0);
  for (const p of prods) if (need(p.id) > p.stock) return NextResponse.json({ error: `Only ${p.stock} left of ${p.name}.` }, { status: 409 });
  const subtotal = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const delivery = subtotal >= FREE ? 0 : area === "dhaka" ? 60 : 120;
  const order_no = "NS" + Date.now().toString().slice(-7);
  const { error } = await db.from("orders").insert({ order_no, name, phone, address, area, payment, trx_id: payment === "cod" ? null : trx_id, items: lines, subtotal, delivery, total: subtotal + delivery });
  if (error) return NextResponse.json({ error: "Could not save order. Try again." }, { status: 500 });
  await notifyOrder({ order_no, name, phone, address, area, payment, trx_id, items: lines, delivery, total: subtotal + delivery });
  for (const p of prods) await db.from("products").update({ stock: p.stock - need(p.id) }).eq("id", p.id);
  return NextResponse.json({ order_no, payment, lines, subtotal, delivery, total: subtotal + delivery });
}
