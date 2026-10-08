"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const slides = [
  { title: "Everyday,\nbeautifully yours.", subtitle: "Easy pieces, thoughtful details, and comfort made for the way you live.", label: "THE EVERYDAY EDIT", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80", position: "center 38%" },
  { title: "A little more\ncolour in every day.", subtitle: "Find your new favourites in breathable fabrics and joyful prints.", label: "COLOUR STORIES", image: "https://images.unsplash.com/photo-1788296275587-f276d0117f89?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", position: "center 35%" },
  { title: "Made to move\nwith your moment.", subtitle: "Modern silhouettes for celebrations, slow mornings, and everything between.", label: "NEW SEASON", image: "https://images.unsplash.com/photo-1629121396442-38ac039a2f32?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", position: "center 30%" },
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
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const activeSlide = document.querySelector(`.hero-slide-${active + 1}.is-active`);
    const content = activeSlide?.querySelectorAll(".eyebrow, h1, p, .button");
    if (!content?.length) return undefined;
    const animation = gsap.fromTo(content,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.09, ease: "power3.out", clearProps: "all" }
    );
    return () => animation.kill();
  }, [active]);
  const move = (direction) => setActive((slide) => (slide + direction + slides.length) % slides.length);

  return <section className="hero-slider" id="top" aria-roledescription="carousel" aria-label="Featured collections" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current !== null && Math.abs(event.changedTouches[0].clientX - touchStart.current) > 45) move(event.changedTouches[0].clientX < touchStart.current ? 1 : -1); touchStart.current = null; }}>
    {slides.map((slide, index) => <div className={`hero-slide hero-slide-${index + 1} ${index === active ? "is-active" : ""}`} key={slide.label} aria-hidden={index !== active}>
      <Image src={slide.image} alt="Nam Sora seasonal clothing collection" fill priority={index === 0} loading={index === 0 ? "eager" : "lazy"} sizes="100vw" style={{ objectPosition: slide.position }} />
      <div className="hero-shade" /><div className="hero-content"><span className="eyebrow">{slide.label}</span><h1>{slide.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><p>{slide.subtitle}</p><a className="button button-light" href="#shop">Explore collection <span aria-hidden="true">↗</span></a></div>
    </div>)}
    <div className="hero-controls"><div className="hero-arrows"><button aria-label="Previous slide" onClick={() => move(-1)}>←</button><button aria-label="Next slide" onClick={() => move(1)}>→</button></div><div className="hero-dots" role="group" aria-label="Choose slide">{slides.map((slide, index) => <button key={slide.label} aria-label={`Slide ${index + 1}`} aria-current={index === active} onClick={() => setActive(index)} />)}</div><button className="hero-pause" aria-label={manuallyPaused ? "Resume slides" : "Pause slides"} aria-pressed={manuallyPaused} onClick={() => setManuallyPaused((value) => !value)}>{manuallyPaused ? "Play" : "Pause"}</button></div>
  </section>;
}