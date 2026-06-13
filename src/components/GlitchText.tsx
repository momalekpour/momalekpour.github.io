"use client";

import { useEffect, useRef, type ElementType } from "react";

const GLITCH_CHARS = [
  "@", "#", "$", "%", "&", "*", "!", "?", "<", ">", "{", "}", "[", "]", "█", "▓", "▒", "░",
];

// Renders `text` in the given element and periodically "glitches" a few characters,
// mirroring the CRT name effect. Self-contained client component so server-rendered
// headings can use it. Fully cleans up timers + restores text on unmount so React
// strict-mode double-mounts don't leave a scrambled heading behind.
export default function GlitchText({
  text,
  as: Tag = "h2",
  className,
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const original = text;
    // Scale how many chars we scramble to the length, so short words like
    // "Papers" aren't fully replaced.
    const maxSwaps = original.length <= 6 ? 2 : 5;

    let glitchTimer: number | undefined;
    let restoreTimer: number | undefined;

    const triggerGlitch = () => {
      let glitched = original;
      const num = Math.random() < 0.5 ? Math.min(2, maxSwaps) : maxSwaps;
      for (let i = 0; i < num; i++) {
        const idx = Math.floor(Math.random() * original.length);
        const ch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        glitched = glitched.substring(0, idx) + ch + glitched.substring(idx + 1);
      }
      el.textContent = glitched;
      el.classList.add("glitching");
      restoreTimer = window.setTimeout(() => {
        el.textContent = original;
        el.classList.remove("glitching");
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
      if (glitchTimer) clearTimeout(glitchTimer);
      if (restoreTimer) clearTimeout(restoreTimer);
      el.textContent = original;
      el.classList.remove("glitching");
    };
  }, [text]);

  return (
    <Tag className={className} ref={ref}>
      {text}
    </Tag>
  );
}
