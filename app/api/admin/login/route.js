import { NextResponse } from "next/server";
import crypto from "crypto";
import { token } from "@/lib/auth";
export async function POST(req) {
  const { password = "" } = await req.json().catch(() => ({}));
  const real = process.env.ADMIN_PASSWORD || "";
  const h = (s) => crypto.createHash("sha256").update(String(s)).digest();
  if (!real || !crypto.timingSafeEqual(h(password), h(real))) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ns_admin", token(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ns_admin", "", { path: "/", maxAge: 0 });
  return res;
}
