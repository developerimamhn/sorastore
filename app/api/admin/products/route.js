import { NextResponse } from "next/server";
import { admin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import { DEFAULT_SIZES } from "@/lib/product-options";
const no = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
export async function GET() {
  if (!isAdmin()) return no();
  const { data } = await admin().from("products").select("*").order("id", { ascending: false });
  return NextResponse.json(data || []);
}
export async function POST(req) {
  if (!isAdmin()) return no();
  const b = await req.json();
  const price = Math.max(0, Math.floor(Number(b.price) || 0));
  const rawSizes = Array.isArray(b.available_sizes) ? b.available_sizes : String(b.available_sizes || "").split(",");
  const available_sizes = [...new Set(rawSizes.map((size) => String(size).trim().slice(0, 24)).filter(Boolean))].slice(0, 20);
  const compareAt = Math.max(0, Math.floor(Number(b.compare_at_price) || 0));
  const row = { name: String(b.name || "").trim(), category: ["Men", "Women", "Kids"].includes(b.category) ? b.category : "Men", price,
    compare_at_price: compareAt > price ? compareAt : null, available_sizes: available_sizes.length ? available_sizes : DEFAULT_SIZES,
    description: String(b.description || ""), image_url: String(b.image_url || ""), color: String(b.color || "#2f4a7a"),
    stock: Math.max(0, +b.stock | 0), active: b.active !== false };
  if (!row.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const q = b.id ? admin().from("products").update(row).eq("id", b.id) : admin().from("products").insert(row);
  const { error } = await q;
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
export async function DELETE(req) {
  if (!isAdmin()) return no();
  await admin().from("products").delete().eq("id", new URL(req.url).searchParams.get("id"));
  return NextResponse.json({ ok: true });
}
