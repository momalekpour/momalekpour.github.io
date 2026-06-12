"use client";

import { useEffect, useRef } from "react";
import { TypingEffect } from "@/lib/typing";
import SocialLinks from "@/components/SocialLinks";
import type { SiteContent, SocialLink } from "@/lib/types";

const GLITCH_CHARS = [
  "@", "#", "$", "%", "&", "*", "!", "?", "<", ">", "{", "}", "[", "]", "█", "▓", "▒", "░",
];

export default function Landing({
  profile,
  texts,
  social,
}: {
  profile: SiteContent["profile"];
  texts: string[];
  social: SocialLink[];
}) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typedEl = typedRef.current;
    const aboutEl = aboutRef.current;
    const nameEl = nameRef.current;
    if (!typedEl || !aboutEl) return;

    // Typing animation + click-to-cycle personas (click anywhere on the about block).
    const effect = new TypingEffect(typedEl, texts);
    effect.type();
    effect.enableClickToChange(aboutEl);

    // Periodic brief glitch on the name.
    const original = profile.name;
    let glitchTimer: number | undefined;
    let restoreTimer: number | undefined;

    const triggerGlitch = () => {
      if (!nameEl) return;
      let glitched = original;
      const num = Math.random() < 0.5 ? 2 : 5;
      for (let i = 0; i < num; i++) {
        const idx = Math.floor(Math.random() * original.length);
        const ch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        glitched = glitched.substring(0, idx) + ch + glitched.substring(idx + 1);
      }
      nameEl.textContent = glitched;
      nameEl.classList.add("glitching");
      restoreTimer = window.setTimeout(() => {
        if (!nameEl) return;
        nameEl.textContent = original;
        nameEl.classList.remove("glitching");
      }, 100);
    };

    const scheduleNext = () => {
      glitchTimer = window.setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, 1000 + Math.random() * 2000);
    };
    scheduleNext();

    return () => {
      effect.destroy();
      if (glitchTimer) clearTimeout(glitchTimer);
      if (restoreTimer) clearTimeout(restoreTimer);
      if (nameEl) {
        nameEl.textContent = original;
        nameEl.classList.remove("glitching");
      }
      typedEl.innerHTML = "";
    };
  }, [texts, profile.name]);

  return (
    <section className="landing" id="top">
      <div className="landing__inner">
        <h1 className="hero__name" ref={nameRef}>
          {profile.name}
        </h1>
        <p className="hero__title">{profile.title}</p>
        <SocialLinks links={social} />
        <div className="about" ref={aboutRef} title="click to cycle personas">
          <div id="typed-text" ref={typedRef}></div>
        </div>
      </div>
      <a className="scroll-cue" href="#papers">
        scroll<span className="scroll-cue__arrow">↓</span>
      </a>
    </section>
  );
}
