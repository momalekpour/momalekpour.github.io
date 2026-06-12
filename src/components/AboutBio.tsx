"use client";

import { useEffect, useRef } from "react";
import { TypingEffect } from "@/lib/typing";

const GLITCH_CHARS = [
  "@", "#", "$", "%", "&", "*", "!", "?", "<", ">", "{", "}", "[", "]", "█", "▓", "▒", "░",
];
const HEADING_TEXT = "About Me";

export default function AboutBio({ texts }: { texts: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const typedEl = typedRef.current;
    const sectionEl = sectionRef.current;
    const heading = headingRef.current;
    if (!typedEl || !sectionEl) return;

    // Typing animation + click-to-cycle through the personas.
    const effect = new TypingEffect(typedEl, texts);
    effect.type();
    effect.enableClickToChange(sectionEl);

    // Random character-glitch on the "About Me" heading.
    let glitchTimer: number | undefined;

    const triggerGlitch = () => {
      if (!heading) return;
      let glitched = HEADING_TEXT;
      const numGlitches = Math.random() < 0.5 ? 2 : 7;
      for (let i = 0; i < numGlitches; i++) {
        const idx = Math.floor(Math.random() * HEADING_TEXT.length);
        const ch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        glitched = glitched.substring(0, idx) + ch + glitched.substring(idx + 1);
      }
      heading.textContent = glitched;
      heading.classList.add("glitching");
      window.setTimeout(() => {
        if (!heading) return;
        heading.textContent = HEADING_TEXT;
        heading.classList.remove("glitching");
      }, 100);
    };

    const scheduleNext = () => {
      const delay = 1000 + Math.random() * 2000;
      glitchTimer = window.setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    return () => {
      effect.destroy();
      if (glitchTimer) clearTimeout(glitchTimer);
      if (heading) {
        heading.textContent = HEADING_TEXT;
        heading.classList.remove("glitching");
      }
      // Remove the spans TypingEffect appended so a remount starts clean.
      typedEl.innerHTML = "";
    };
  }, [texts]);

  return (
    <section className="about-me" id="about" ref={sectionRef}>
      <h2 className="section-label" ref={headingRef}>
        {HEADING_TEXT}
      </h2>
      <div className="content-wrapper">
        <div id="typed-text" ref={typedRef}></div>
      </div>
    </section>
  );
}
