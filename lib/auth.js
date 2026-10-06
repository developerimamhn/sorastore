import crypto from "crypto";
import { cookies } from "next/headers";
export const token = () => crypto.createHmac("sha256", process.env.ADMIN_SECRET || "x").update(process.env.ADMIN_PASSWORD || "x").digest("hex");
export function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const c = cookies().get("ns_admin")?.value, t = token();
  return !!c && c.length === t.length && crypto.timingSafeEqual(Buffer.from(c), Buffer.from(t));
}
