"use client";
import Image from "next/image";

export default function Footer({ whatsapp = "" }) {
  return <footer className="site-footer" id="customer-care"><div className="footer-main page-wrap">
    <div className="footer-brand"><a className="brand brand-footer" href="#top" aria-label="Sora Store home"><Image className="brand-logo" src="/sora-store-logo.svg" alt="Sora Store" width={160} height={55} /></a><p>Thoughtful everyday clothing, made for life in Bangladesh.</p><div className="social-links"><a href="https://www.facebook.com/" aria-label="Facebook">f</a><a href="https://www.instagram.com/" aria-label="Instagram">ig</a></div></div>
    <div className="footer-column"><h3>Shop</h3><a href="#category-women">Women</a><a href="#category-men">Men</a><a href="#category-kids">Kids</a><a href="#new-arrivals">New arrivals</a></div>
    <div className="footer-column"><h3>Customer care</h3><a href="#customer-care">Contact us</a><a href="#customer-care">Delivery & returns</a><a href="#customer-care">Size guide</a><a href="#track-order">Track an order</a></div>
    <div className="footer-column"><h3>About Nam Sora</h3><a href="#top">Our story</a><a href="#stores" id="stores">Find a store</a><span>Made with care in Bangladesh</span></div>
    <div className="footer-column"><h3>Contact</h3>{whatsapp ? <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Message us on WhatsApp</a> : <a href="#customer-care">Order enquiries</a>}<a href="#track-order" id="track-order">Track your order</a><span>Bangladesh</span></div>
    <div className="footer-newsletter"><h3>A note from Nam Sora</h3><p>New collections, thoughtful edits, and a little inspiration.</p><form onSubmit={(event) => event.preventDefault()}><label className="visually-hidden" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Your email address" /><button type="submit" aria-label="Subscribe to newsletter">→</button></form><div className="payment-marks" aria-label="Payment options"><span>bKash</span><span>Nagad</span><span>COD</span></div></div>
  </div><div className="footer-bottom page-wrap"><span>© {new Date().getFullYear()} Nam Sora Store</span><span>Bangladesh · BDT ৳</span></div></footer>;
}