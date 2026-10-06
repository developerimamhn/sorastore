"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  { title: "Everyday,\nbeautifully yours.", subtitle: "Easy pieces, thoughtful details, and comfort made for the way you live.", label: "THE EVERYDAY EDIT", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80", position: "center 38%" },
  { title: "A little more\ncolour in every day.", subtitle: "Find your new favourites in breathable fabrics and joyful prints.", label: "COLOUR STORIES", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1600&q=80", position: "center 35%" },
  { title: "Made to move\nwith your moment.", subtitle: "Modern silhouettes for celebrations, slow mornings, and everything between.", label: "NEW SEASON", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80", position: "center 30%" },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const touchStart = useRef(null);
  useEffect(() => {
    if (hovered || manuallyPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setActive((slide) => (slide + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [hovered, manuallyPaused]);
  const move = (direction) => setActive((slide) => (slide + direction + slides.length) % slides.length);

  return <section className="hero-slider" id="top" aria-roledescription="carousel" aria-label="Featured collections" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current !== null && Math.abs(event.changedTouches[0].clientX - touchStart.current) > 45) move(event.changedTouches[0].clientX < touchStart.current ? 1 : -1); touchStart.current = null; }}>
    {slides.map((slide, index) => <div className={`hero-slide hero-slide-${index + 1} ${index === active ? "is-active" : ""}`} key={slide.label} aria-hidden={index !== active}>
      <Image src={slide.image} alt="Nam Sora seasonal clothing collection" fill priority={index === 0} loading={index === 0 ? "eager" : "lazy"} sizes="100vw" style={{ objectPosition: slide.position }} />
      <div className="hero-shade" /><div className="hero-content"><span className="eyebrow">{slide.label}</span><h1>{slide.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><p>{slide.subtitle}</p><a className="button button-light" href="#shop">Explore collection <span aria-hidden="true">↗</span></a></div>
    </div>)}
    <div className="hero-controls"><div className="hero-arrows"><button aria-label="Previous slide" onClick={() => move(-1)}>←</button><button aria-label="Next slide" onClick={() => move(1)}>→</button></div><div className="hero-dots" role="group" aria-label="Choose slide">{slides.map((slide, index) => <button key={slide.label} aria-label={`Slide ${index + 1}`} aria-current={index === active} onClick={() => setActive(index)} />)}</div><button className="hero-pause" aria-label={manuallyPaused ? "Resume slides" : "Pause slides"} aria-pressed={manuallyPaused} onClick={() => setManuallyPaused((value) => !value)}>{manuallyPaused ? "Play" : "Pause"}</button></div>
  </section>;
}