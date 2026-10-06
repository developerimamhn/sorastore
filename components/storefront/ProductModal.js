"use client";

import Image from "next/image";
import { useEffect } from "react";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-US")}`;

export default function ProductModal({ product, onClose, onAdd, selectedSize, onSize, recommendations = [], onDetails }) {
  useEffect(() => {
    if (!product) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [product, onClose]);
  if (!product) return null;
  const image = product.image_url || "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description || `${product.name} from Sora Store`, brand: { "@type": "Brand", name: "Sora Store" }, image, category: product.category, offers: { "@type": "Offer", priceCurrency: "BDT", price: product.price, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><div className="product-modal-box"><button className="modal-close icon-button" aria-label="Close product details" onClick={onClose}>×</button><div className="modal-image"><Image src={image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="modal-details"><span className="eyebrow">{product.category}</span><h2 id="product-title">{product.name}</h2><strong className="modal-price">{money(product.price)}</strong><p>{product.description || "A considered everyday piece, designed for comfort and made to be worn on repeat."}</p><div className="size-heading"><b>Select size</b><a href="#size-guide">Size guide</a></div><div className="modal-sizes">{["S", "M", "L", "XL"].map((size) => <button key={size} aria-pressed={selectedSize === size} onClick={() => onSize(product.id, size)}>{size}</button>)}</div><details className="size-guide" id="size-guide"><summary>Size guide</summary><p>For the best fit, compare your measurements with a similar piece you already own. Between sizes? Choose the larger size for an easy fit.</p></details><div className="delivery-note"><b>Delivery across Bangladesh</b><span>7-day size exchange · Cash on delivery available</span></div><button className="button button-navy modal-add" disabled={product.stock < 1} onClick={() => onAdd(product)}>{product.stock < 1 ? "Sold out" : "Add to bag"}</button></div>{recommendations.length > 0 && <section className="related-products"><h3>You may also like</h3><div>{recommendations.map((item) => <button key={item.id} onClick={() => onDetails(item)}><span className="related-image"><Image src={item.image_url || image} alt="" fill sizes="100px" /></span><b>{item.name}</b><small>{money(item.price)}</small></button>)}</div></section>}</div></div>;
}