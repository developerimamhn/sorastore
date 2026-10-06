import { NextResponse } from "next/server";
import { admin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
const no = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
export async function GET() {
  if (!isAdmin()) return no();
  const { data } = await admin().from("orders").select("*").order("id", { ascending: false }).limit(200);
  return NextResponse.json(data || []);
}
export async function PATCH(req) {
  if (!isAdmin()) return no();
  const { id, status } = await req.json();
  if (!["new", "confirmed", "shipped", "delivered", "cancelled"].includes(status)) return NextResponse.json({ error: "Bad status" }, { status: 400 });
  await admin().from("orders").update({ status }).eq("id", id);
  return NextResponse.json({ ok: true });
}
