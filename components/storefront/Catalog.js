"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-US")}`;
const fallbackImages = {
  Women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  Men: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  Kids: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
  "New Arrivals": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
};

export function CategoryTiles({ onCategory }) {
  return <section className="category-section page-wrap" aria-label="Shop by category" data-reveal><div className="section-heading"><div><span className="eyebrow">Find your look</span><h2>Made for your every day</h2></div></div><div className="category-tiles">{Object.entries(fallbackImages).map(([name, image]) => <a href={name === "New Arrivals" ? "#new-arrivals" : "#shop"} onClick={name === "New Arrivals" ? undefined : () => onCategory(name)} className="category-tile" key={name} id={`category-${name.toLowerCase().replaceAll(" ", "-")}`}><Image src={image} alt={`${name} clothing`} fill sizes="(max-width: 640px) 50vw, 25vw" /><span>{name}<b aria-hidden="true">↗</b></span></a>)}</div></section>;
}

export function ProductCard({ product, onDetails, onAdd, onSize, size, wished, onWish }) {
  const soldOut = product.stock < 1;
  const selectedSize = typeof size === "function" ? size(product) : size;
  const isWished = typeof wished === "function" ? wished(product.id) : wished;
  const image = product.image_url || fallbackImages[product.category] || fallbackImages.Men;
  const badge = product.stock < 1 ? "Sold out" : product.stock <= 3 ? `Only ${product.stock} left` : product.isNew ? "New" : "";
  const badgeClass = product.stock < 1 ? "badge-muted" : product.stock <= 3 ? "badge-alert" : "";
  return <article className="product-card">
    <div className="product-image">
      <button className="image-trigger" onClick={() => onDetails(product)} aria-label={`View ${product.name} details`}><Image src={image} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 22vw" loading="lazy" /></button>
      {badge && <span className={`product-badge ${badgeClass}`}>{badge}</span>}
      <button className={`wish-button ${isWished ? "is-wished" : ""}`} aria-label={isWished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={isWished} onClick={(event) => { event.stopPropagation(); onWish(product.id); }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" /></svg></button>
    </div>
    <div className="product-info"><span className="product-category">{product.category}</span><button className="product-name" onClick={() => onDetails(product)}>{product.name}</button><div className="product-price">{money(product.price)}</div>
      <div className="product-actions"><div className="size-picker" aria-label={`Choose size for ${product.name}`}>{["S", "M", "L", "XL"].map((option) => <button key={option} aria-pressed={selectedSize === option} onClick={() => onSize(product.id, option)}>{option}</button>)}</div><button className="quick-add" disabled={soldOut} onClick={() => onAdd(product)} aria-label={soldOut ? `${product.name} sold out` : `Add ${product.name} size ${selectedSize} to cart`}>Add</button></div>
    </div>
  </article>;
}

export function ProductCarousel({ title, id, products, ...cardProps }) {
  const rail = useRef(null);
  return <section className="product-section page-wrap" id={id} data-reveal><div className="section-heading"><div><span className="eyebrow">Nam Sora selection</span><h2>{title}</h2></div><div className="section-actions"><a href="#shop" className="view-all">View all <span aria-hidden="true">↗</span></a><button aria-label={`Scroll ${title} left`} onClick={() => rail.current?.scrollBy({ left: -360, behavior: "smooth" })}>←</button><button aria-label={`Scroll ${title} right`} onClick={() => rail.current?.scrollBy({ left: 360, behavior: "smooth" })}>→</button></div></div>{products.length ? <div className="product-rail" ref={rail}>{products.map((product) => <ProductCard key={product.id} product={product} {...cardProps} />)}</div> : <p className="catalog-empty">New pieces are on their way.</p>}</section>;
}

export function FilterBar({ category, setCategory, sort, setSort, sizeFilter, setSizeFilter, maxPrice, setMaxPrice, priceLimit = 5000, count }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return <div className="filter-area"><div className="filter-summary"><span>{count} pieces</span><button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>Filters <span aria-hidden="true">⌄</span></button><label className="sort-select">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div><div className={`filter-panel ${filtersOpen ? "filters-open" : ""}`}>
    <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option><option value="Women">Women</option><option value="Men">Men</option><option value="Kids">Kids</option></select></label>
    <label>Size<select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)}><option value="all">All sizes</option>{["S", "M", "L", "XL"].map((size) => <option key={size}>{size}</option>)}</select></label>
    <label className="price-range">Price up to <span>{money(maxPrice)}</span><input type="range" min="500" max={priceLimit} step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum price" /></label>
  </div></div>;
}

export function EditorialBanner() {
  return <section className="editorial page-wrap" data-reveal><div className="editorial-image"><Image src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1200&q=80" alt="Festive occasion wear in a warm, modern setting" fill sizes="(max-width: 760px) 100vw, 55vw" loading="lazy" /></div><div className="editorial-copy"><span className="eyebrow">A season to celebrate</span><h2>For the moments that stay with you.</h2><p>Considered silhouettes and easy, joyful pieces for gathering, dressing up, and making a little occasion of today.</p><a className="text-link" href="#shop">Discover the occasion edit <span aria-hidden="true">↗</span></a></div></section>;
}

export function TrustStrip() {
  const benefits = [
    ["Cash on delivery", <><path d="M3 7h18v13H3z" /><path d="M3 11h18M7 16h3" /></>],
    ["Delivery across Bangladesh", <><path d="M2 7h12v10H2zM14 11h4l4 4v2h-8z" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>],
    ["7-day size exchange", <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 9a7 7 0 0 1 12-2L20 12M4 12l2.5 5a7 7 0 0 0 12-2" /></>],
    ["Secure payment", <><rect x="4" y="10" width="16" height="11" rx="1" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>],
  ];
  return <section className="trust-strip page-wrap" aria-label="Shopping benefits" data-reveal>{benefits.map(([label, icon]) => <div key={label}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{icon}</svg><b>{label}</b></div>)}</section>;
}