import "./globals.css";
import { Bricolage_Grotesque, DM_Sans, Hind_Siliguri } from "next/font/google";
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "800"], variable: "--fd", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--fb", display: "swap" });
const bengali = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--bn", display: "swap" });
export const metadata = {
  title: { default: "Sora Store | Everyday clothing, thoughtfully made", template: "%s | Sora Store" },
  description: "Discover thoughtful everyday clothing at Sora Store. Shop Panjabi, tees, kurtis and more, with delivery across Bangladesh.",
  applicationName: "Sora Store",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  openGraph: { title: "Sora Store", description: "Thoughtful everyday clothing, made for life in Bangladesh.", type: "website", locale: "en_BD", siteName: "Sora Store" },
  twitter: { card: "summary_large_image", title: "Sora Store", description: "Thoughtful everyday clothing, made for life in Bangladesh." },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function Layout({ children }) {
  return <html lang="en" className={`${display.variable} ${body.variable} ${bengali.variable}`}><body>{children}</body></html>;
}
