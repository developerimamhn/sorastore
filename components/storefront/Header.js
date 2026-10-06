"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const categories = ["Women", "Men", "Kids", "New Arrivals", "Under ৳1,000"];

function Icon({ name }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    heart: <path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function Header({ count, query, setQuery, onCart, onCategory }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  useEffect(() => {
    if (searchOpen) document.querySelector(".search-form input")?.focus();
  }, [searchOpen]);

  return <>
    <div className="utility-bar">
      <span>Free delivery over ৳3,000</span>
      <nav aria-label="Customer links"><a href="#stores">Find a store</a><a href="#customer-care">Customer service</a><a href="#track-order">Track order</a></nav>
    </div>
    <header className="site-header">
      <button className="icon-button mobile-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
      <a className="brand" href="#top" aria-label="Sora Store home"><Image className="brand-logo" src="/sora-store-logo.svg" alt="Sora Store" width={160} height={55} priority /></a>
      <form className={`search-form ${searchOpen ? "search-form-open" : ""}`} role="search" onSubmit={(event) => event.preventDefault()}>
        <Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clothing, styles and more" aria-label="Search products" />
      </form>
      <div className="header-actions">
        <button className="icon-button desktop-action" aria-label="Account (coming soon)" title="Account"><Icon name="user" /></button>
        <button className="icon-button desktop-action" aria-label="Wishlist (coming soon)" title="Wishlist"><Icon name="heart" /></button>
        <button className="icon-button mobile-search-button" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><Icon name="search" /></button>
        <button className="cart-icon-button" onClick={onCart} aria-label={`Open cart, ${count} items`}><Icon name="bag" /><span className="cart-count">{count}</span><span className="cart-word">Cart</span></button>
      </div>
      <nav className="category-nav" aria-label="Shop categories">
        {categories.map((category) => <a key={category} href={category === "New Arrivals" ? "#new-arrivals" : category === "Under ৳1,000" ? "#under-1000" : "#shop"} onClick={category === "New Arrivals" || category === "Under ৳1,000" ? undefined : () => onCategory(category)}>{category}</a>)}
        <div className="mega-menu"><div><span className="eyebrow">Explore the collection</span><a href="#shop" onClick={() => onCategory("Women")}>Women</a><a href="#shop" onClick={() => onCategory("Men")}>Men</a><a href="#shop" onClick={() => onCategory("Kids")}>Kids</a></div><div><span className="eyebrow">Shop by edit</span><a href="#new-arrivals">New arrivals</a><a href="#featured-pieces">Featured pieces</a><a href="#under-1000">Under ৳1,000</a></div><a className="mega-promo" href="#shop"><Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" alt="Explore the Nam Sora collection" fill sizes="30vw" /><span>Made for every day</span><b>Discover Nam Sora</b></a></div>
      </nav>
    </header>
    <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen ? "" : undefined}>
      <div className="mobile-menu-head"><span className="eyebrow">Shop collections</span><button className="icon-button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><Icon name="close" /></button></div>
      {categories.map((category) => <a key={category} href={category === "New Arrivals" ? "#new-arrivals" : category === "Under ৳1,000" ? "#under-1000" : "#shop"} onClick={() => { if (category !== "New Arrivals" && category !== "Under ৳1,000") onCategory(category); setMenuOpen(false); }}>{category}<span>↗</span></a>)}
      <div className="mobile-menu-foot"><a href="#customer-care" onClick={() => setMenuOpen(false)}>Customer care</a><a href="#stores" onClick={() => setMenuOpen(false)}>Find a store</a></div>
    </div>
    {menuOpen && <button className="mobile-menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
  </>;
}