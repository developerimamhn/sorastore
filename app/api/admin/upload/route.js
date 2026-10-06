import { NextResponse } from "next/server";
import crypto from "crypto";
import { admin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const file = (await req.formData().catch(() => null))?.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "Choose an image." }, { status: 400 });
  const ext = EXT[file.type];
  if (!ext) return NextResponse.json({ error: "Use a JPG, PNG or WebP image." }, { status: 400 });
  if (file.size > 3 * 1024 * 1024) return NextResponse.json({ error: "Image must be under 3 MB." }, { status: 400 });
  const path = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const db = admin();
  const { error } = await db.storage.from("products").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
  if (error) return NextResponse.json({ error: "Upload failed. Did you run schema.sql?" }, { status: 500 });
  return NextResponse.json({ url: db.storage.from("products").getPublicUrl(path).data.publicUrl });
}
