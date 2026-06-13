"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    // reveal on scroll
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target); // fire once, never re-hide
          }
        }
      },
      { threshold: 0.12 },
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    // landing parallax
    const landing = document.querySelector<HTMLElement>(".landing");
    let rafId: number | null = null;

    function handleScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!landing) return;
        const y = window.scrollY;
        landing.style.setProperty("--parallax-y", `${y * -0.12}px`);
        landing.style.setProperty(
          "--parallax-opacity",
          String(Math.max(0, 1 - y / 500)),
        );
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
