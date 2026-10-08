import Shop from "@/components/Shop";
import { pub } from "@/lib/supabase";
export const revalidate = 30;
export default async function Home() {
  let products = [];
  try {
    const { data } = await pub().from("products").select("*").eq("active", true).order("id");
    const recentCutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    products = (data || []).map((product) => ({ ...product, isNew: Date.parse(product.created_at) >= recentCutoff }));
  } catch (e) {}
  return <Shop products={products} wa={process.env.NEXT_PUBLIC_WHATSAPP || ""} />;
}
