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
      // Fire once the element's top clears the lower ~18% of the viewport,
      // so the reveal animates while it's clearly on screen.
      { threshold: 0, rootMargin: "0px 0px -18% 0px" },
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
        landing.style.setProperty("--parallax-y", `${y * -0.18}px`);
        landing.style.setProperty(
          "--parallax-opacity",
          String(Math.max(0, 1 - y / 620)),
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
