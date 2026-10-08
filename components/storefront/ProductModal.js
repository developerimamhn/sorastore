"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { discountPercent, productSizes } from "@/lib/product-options";

const money = (value) => `\u09f3${Number(value || 0).toLocaleString("en-US")}`;
const alphaSizeMeasurements = {
  Men: { XS: [36, 26], S: [38, 27], M: [40, 28], L: [42, 29], XL: [44, 30], XXL: [46, 31], XXXL: [48, 32] },
  Women: { XS: [34, 40], S: [36, 42], M: [38, 42], L: [40, 43], XL: [42, 43], XXL: [44, 44], XXXL: [46, 44] },
  Kids: { XS: [24, 18], S: [26, 20], M: [28, 22], L: [30, 24], XL: [32, 26], XXL: [34, 28], XXXL: [36, 30] },
};
const numericSizeMeasurements = {
  34: [39, 28], 36: [41, 28], 38: [43, 29], 40: [45, 30],
  42: [47, 31], 44: [49, 32], 46: [51, 32], 48: [53, 33],
};

export default function ProductModal({ product, onClose, onAdd, selectedSize, onSize, recommendations = [], onDetails }) {
  const [guideOpen, setGuideOpen] = useState(false);
  const guideRef = useRef(null);
  useEffect(() => {
    if (!product) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [product, onClose]);
  useEffect(() => {
    setGuideOpen(false);
  }, [product?.id]);
  useEffect(() => {
    if (guideOpen) guideRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [guideOpen]);

  if (!product) return null;

  const image = product.image_url || "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";
  const sizes = productSizes(product);
  const categoryMeasurements = alphaSizeMeasurements[product.category] || alphaSizeMeasurements.Men;
  const guideRows = sizes.map((size) => {
    const measurements = /^\d+$/.test(size) ? numericSizeMeasurements[size] : categoryMeasurements[size.toUpperCase()];
    return { size, chest: measurements?.[0] ?? "-", length: measurements?.[1] ?? "-" };
  });
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} from Sora Store`,
    brand: { "@type": "Brand", name: "Sora Store" },
    image,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <div className="product-modal-box">
      <button className="modal-close icon-button" aria-label="Close product details" onClick={onClose}>&times;</button>
      <div className="modal-image"><Image src={image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
      <div className="modal-details">
        <span className="eyebrow">{product.category}</span>
        <h2 id="product-title">{product.name}</h2>
        <div className="modal-price-row">
          <strong className="modal-price">{money(product.price)}</strong>
          {product.compare_at_price > product.price && <><del>{money(product.compare_at_price)}</del><span className="discount-label">{discountPercent(product)}% off</span></>}
        </div>
        <p>{product.description || "A considered everyday piece, designed for comfort and made to be worn on repeat."}</p>
        <div className="size-heading"><b>Select size</b><button className="size-guide-trigger" type="button" aria-expanded={guideOpen} aria-controls="size-guide" onClick={() => setGuideOpen(true)}>Size guide</button></div>
        <div className="modal-sizes" role="group" aria-label={`Available sizes for ${product.name}`}>
          {sizes.map((size) => <button key={size} aria-pressed={selectedSize === size} onClick={() => onSize(product.id, size)}>{size}</button>)}
        </div>
        <details className="size-guide" id="size-guide" ref={guideRef} open={guideOpen} onToggle={(event) => setGuideOpen(event.currentTarget.open)}>
          <summary>Approximate garment measurements (inches)</summary>
          <p className="size-guide-note">Expected deviation: +/- 1 inch. Measure a similar garment flat for the closest fit.</p>
          <div className="size-chart-wrap"><table className="size-chart"><thead><tr><th scope="col">Size</th><th scope="col">Chest (in)</th><th scope="col">Length (in)</th></tr></thead><tbody>{guideRows.map((row) => <tr key={row.size}><th scope="row">{row.size}</th><td>{row.chest}</td><td>{row.length}</td></tr>)}</tbody></table></div>
        </details>
        <div className="delivery-note"><b>Delivery across Bangladesh</b><span>7-day size exchange · Cash on delivery available</span></div>
        <button className="button button-navy modal-add" disabled={product.stock < 1} onClick={() => onAdd(product)}>{product.stock < 1 ? "Sold out" : "Add to bag"}</button>
      </div>
      {recommendations.length > 0 && <section className="related-products">
        <h3>You may also like</h3>
        <div>{recommendations.map((item) => <button key={item.id} onClick={() => onDetails(item)}>
          <span className="related-image"><Image src={item.image_url || image} alt="" fill sizes="100px" /></span>
          <b>{item.name}</b><small>{money(item.price)}</small>
        </button>)}</div>
      </section>}
    </div>
  </div>;
}