"use client";

import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";
import Header from "@/components/storefront/Header";
import HeroSlider from "@/components/storefront/HeroSlider";
import CartDrawer from "@/components/storefront/CartDrawer";
import ProductModal from "@/components/storefront/ProductModal";
import Footer from "@/components/storefront/Footer";
import { CategoryTiles, EditorialBanner, FilterBar, ProductCard, ProductCarousel, TrustStrip } from "@/components/storefront/Catalog";
import { productSizes } from "@/lib/product-options";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-US")}`;

export default function Shop({ products = [], wa = "" }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(() => Math.max(5000, Math.ceil(Math.max(0, ...products.map((product) => Number(product.price) || 0)) / 1000) * 1000));
  const [sizes, setSizes] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [wishlistReady, setWishlistReady] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", area: "dhaka", payment: "cod", trx_id: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("nsc") || "[]")); } catch (error) { setCart([]); }
  }, []);
  useEffect(() => {
    try {
      const storedWishlist = JSON.parse(localStorage.getItem("nsw") || "[]");
      setWishlist(Array.isArray(storedWishlist) ? storedWishlist : []);
    } catch (error) { setWishlist([]); }
    setWishlistReady(true);
  }, []);
  useEffect(() => {
    if (!wishlistReady) return;
    try { localStorage.setItem("nsw", JSON.stringify(wishlist)); } catch (error) { /* Storage may be unavailable. */ }
  }, [wishlist, wishlistReady]);
  useEffect(() => {
    try { localStorage.setItem("nsc", JSON.stringify(cart)); } catch (error) { /* Storage may be unavailable. */ }
  }, [cart]);
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return undefined;
    const elements = document.querySelectorAll("[data-reveal]");
    const context = gsap.context(() => {});
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          context.add(() => gsap.fromTo(entry.target,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out", clearProps: "all" }
          ));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); context.revert(); };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const searchText = `${product.name} ${product.category} ${product.description || ""}`.toLowerCase();
      const matchesQuery = searchText.includes(query.trim().toLowerCase());
      const availableSizes = productSizes(product);
      const matchesSize = sizeFilter === "all" || availableSizes.includes(sizeFilter);
      const matchesWishlist = !wishlistOnly || wishlist.includes(product.id);
      return matchesCategory && matchesQuery && matchesSize && matchesWishlist && Number(product.price) <= maxPrice;
    });
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, category, query, sizeFilter, maxPrice, sort, wishlistOnly, wishlist]);

  const sizeOptions = useMemo(() => [...new Set(products.flatMap(productSizes))], [products]);
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);
  const priceLimit = Math.max(5000, Math.ceil(Math.max(0, ...products.map((product) => Number(product.price) || 0)) / 1000) * 1000);
  const subtotal = cart.reduce((total, item) => total + item.qty * item.price, 0);
  const delivery = !itemCount || subtotal >= 3000 ? 0 : form.area === "dhaka" ? 60 : 120;
  const sizeFor = (product) => sizes[product.id] || productSizes(product)[0];
  const chooseSize = (id, size) => setSizes((current) => ({ ...current, [id]: size }));

  const addToCart = (product) => {
    setDone(null);
    setCart((current) => {
      const index = current.findIndex((item) => item.id === product.id && item.size === sizeFor(product));
      if (index > -1) {
        const updated = [...current];
        updated[index] = { ...updated[index], qty: Math.min(20, updated[index].qty + 1) };
        return updated;
      }
      return [...current, { id: product.id, name: product.name, price: product.price, color: product.color, size: sizeFor(product), qty: 1 }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  };
  const changeQuantity = (index, amount) => setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, qty: Math.min(20, item.qty + amount) } : item).filter((item) => item.qty > 0));
  const toggleWishlist = (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const showWishlist = () => {
    setWishlistOnly((current) => !current);
    setCategory("all");
    window.requestAnimationFrame(() => document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" }));
  };
  const cardProps = {
    onDetails: setSelectedProduct,
    onAdd: addToCart,
    onSize: chooseSize,
    size: sizeFor,
    wished: (id) => wishlist.includes(id),
    onWish: toggleWishlist,
  };

  async function placeOrder() {
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: cart.map(({ id, size, qty }) => ({ id, size, qty })) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const message = `New order ${result.order_no} – Sora Store\n` + result.lines.map((line) => `${line.qty} x ${line.name} (${line.size}) = ${money(line.qty * line.price)}`).join("\n") + `\nDelivery: ${result.delivery ? money(result.delivery) : "Free"}\nTotal: ${money(result.total)} ${result.payment === "cod" ? "(Cash on delivery)" : `(Paid by ${result.payment}, TrxID ${form.trx_id.trim().toUpperCase()})`}\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}`;
      setCart([]);
      setDone({ no: result.order_no, total: result.total, msg: message });
    } catch (orderError) {
      setError(orderError.message || "Something went wrong. Try again.");
    }
    setBusy(false);
  }

  const featured = products.filter((product) => product.isNew).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 4);
  const featuredPieces = products.slice(0, 4);
  const underOneThousand = products.filter((product) => product.price < 1000);

  return <>
    <Header count={itemCount} wishCount={wishlist.length} query={query} setQuery={setQuery} onCart={() => setCartOpen(true)} onWishlist={showWishlist} onCategory={setCategory} />
    <main>
      <HeroSlider />
      <CategoryTiles onCategory={setCategory} />
      <ProductCarousel title="New Arrivals" id="new-arrivals" products={featured} {...cardProps} />
      <ProductCarousel title="Featured Pieces" id="featured-pieces" products={featuredPieces} {...cardProps} />
      <ProductCarousel title="Under ৳1,000" id="under-1000" products={underOneThousand} {...cardProps} />
      <EditorialBanner />
      <TrustStrip />
      <section className="catalog-section page-wrap" id="shop" data-reveal>
        <div className="catalog-intro"><span className="eyebrow">The full collection</span><h2>Find your next favourite.</h2><p>Easy-to-wear pieces with a little something special.</p></div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted">{wishlistOnly ? "Your saved pieces" : "Explore all pieces"}</span>
          {wishlistOnly && <button className="text-xs font-semibold text-navy underline underline-offset-4" onClick={showWishlist}>Show all products</button>}
        </div>
        <FilterBar category={category} setCategory={setCategory} sort={sort} setSort={setSort} sizeFilter={sizeFilter} setSizeFilter={setSizeFilter} sizeOptions={sizeOptions} maxPrice={maxPrice} setMaxPrice={setMaxPrice} priceLimit={priceLimit} count={filteredProducts.length} />
        <div className="mb-4 flex justify-end">
          <button type="button" onClick={showWishlist} aria-pressed={wishlistOnly} className="inline-flex min-h-9 items-center gap-2 border border-line px-3 text-xs font-semibold text-ink transition-colors hover:bg-navy hover:text-paper aria-pressed:bg-navy aria-pressed:text-paper motion-reduce:transition-none">
            <span aria-hidden="true">♡</span> Saved pieces <span className="tabular-nums">{wishlist.length}</span>
          </button>
        </div>
        <div className="catalog-grid">{filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} {...cardProps} />)}
          {!filteredProducts.length && <p className="catalog-empty">{products.length ? "No pieces match those filters. Try adjusting your search." : "No products yet. Add some from /admin."}</p>}
        </div>
      </section>
    </main>
    <Footer whatsapp={wa} />
    <CartDrawer open={cartOpen} setOpen={setCartOpen} cart={cart} count={itemCount} subtotal={subtotal} delivery={delivery} changeQuantity={changeQuantity} form={form} setForm={setForm} done={done} whatsapp={wa} error={error} busy={busy} onOrder={placeOrder} />
    <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} selectedSize={selectedProduct ? sizeFor(selectedProduct) : "M"} onSize={chooseSize} recommendations={selectedProduct ? products.filter((product) => product.id !== selectedProduct.id && product.category === selectedProduct.category).slice(0, 3) : []} onDetails={setSelectedProduct} />
  </>;
}