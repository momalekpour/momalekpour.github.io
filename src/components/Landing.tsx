"use client";

import { useEffect, useRef } from "react";
import { TypingEffect } from "@/lib/typing";
import GlitchText from "@/components/GlitchText";
import type { SiteContent } from "@/lib/types";

export default function Landing({
  profile,
  texts,
}: {
  profile: SiteContent["profile"];
  texts: string[];
}) {
  const aboutRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typedEl = typedRef.current;
    const aboutEl = aboutRef.current;
    if (!typedEl || !aboutEl) return;

    // Typing animation + click-to-cycle personas (click anywhere on the about block).
    const effect = new TypingEffect(typedEl, texts);
    effect.type();
    effect.enableClickToChange(aboutEl);

    return () => {
      effect.destroy();
      typedEl.innerHTML = "";
    };
  }, [texts]);

  return (
    <section className="landing" id="top">
      <div className="landing__inner">
        <header className="hero">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export uses unoptimized images */}
          <img
            className="hero__avatar"
            src="/assets/avatar.jpeg"
            alt={profile.name}
            width={886}
            height={886}
          />
          <div className="hero__intro">
            <GlitchText as="h1" className="hero__name" text={profile.name} />
            <p className="hero__title">{profile.title}</p>
          </div>
        </header>
        <div className="about" ref={aboutRef} title="click to cycle personas">
          <div id="typed-text" ref={typedRef}></div>
        </div>
      </div>
    </section>
  );
}
