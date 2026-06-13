# Modern Scroll Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three layered, subtle scroll effects to the CRT portfolio: reveal-on-scroll for section items, pinned sticky section titles, and parallax recession on the landing hero.

**Architecture:** One new client component (`ScrollEffects`) mounts globally in layout.tsx, driving an IntersectionObserver for element reveals and an rAF-throttled scroll handler for CSS-variable-based parallax. Sticky titles are pure CSS. All effects are disabled via `prefers-reduced-motion`.

**Tech Stack:** React 19 client component, IntersectionObserver API, CSS transitions, CSS custom properties, requestAnimationFrame.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/ScrollEffects.tsx` | Create | IntersectionObserver reveals + parallax rAF scroll handler |
| `src/app/globals.css` | Modify | Reveal CSS states, sticky title backing, parallax CSS vars, reduced-motion guard |
| `src/components/TimelineSection.tsx` | Modify | Add `data-reveal` to each `<article>` |
| `src/components/PublicationList.tsx` | Modify | Add `data-reveal` to each `<article>` |
| `src/app/layout.tsx` | Modify | Import and render `<ScrollEffects />` |

---

### Task 1: CSS — reveal states, sticky titles, parallax vars, reduced-motion

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add scroll reveal CSS block**

Locate the comment `/* ---------- typing animation ---------- */` and insert this block immediately before it:

```css
/* ---------- scroll reveal ---------- */

[data-reveal] {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

[data-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
}

/* stagger within sibling lists */
[data-reveal]:nth-child(2) { transition-delay: 0.08s; }
[data-reveal]:nth-child(3) { transition-delay: 0.16s; }
[data-reveal]:nth-child(4) { transition-delay: 0.24s; }
[data-reveal]:nth-child(5) { transition-delay: 0.32s; }
[data-reveal]:nth-child(6) { transition-delay: 0.40s; }
```

- [ ] **Step 2: Add parallax CSS vars to the existing `.landing` rule**

Inside the existing `.landing {}` block (around line 91), add two new properties:

```css
    transform: translateY(var(--parallax-y, 0px));
    opacity: var(--parallax-opacity, 1);
```

The default values (`0px`, `1`) ensure the landing renders correctly before any JS runs (static export, SSR hydration).

- [ ] **Step 3: Add sticky backing to the existing `.section-label` rule**

Inside the existing `.section-label {}` block (around line 202), add:

```css
    position: sticky;
    top: var(--nav-height);
    z-index: 10;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    padding-top: var(--space-xs);
    padding-bottom: var(--space-xs);
    margin-left: calc(-1 * var(--space-lg));
    margin-right: calc(-1 * var(--space-lg));
    padding-left: var(--space-lg);
    padding-right: var(--space-lg);
    border-bottom: 1px solid var(--green-12);
```

The negative margin + matching padding bleeds the backing edge-to-edge within the content column so there's no gap on either side.

- [ ] **Step 4: Add `prefers-reduced-motion` guard at end of file**

Append after the `@media (max-width: 600px)` block:

```css
@media (prefers-reduced-motion: reduce) {
    [data-reveal] {
        opacity: 1;
        transform: none;
        transition: none;
    }

    .landing {
        transform: none !important;
        opacity: 1 !important;
    }
}
```

- [ ] **Step 5: Build to verify CSS**

```bash
npm run build 2>&1 | tail -20
```

Expected: exit 0 with no errors. CSS parse errors surface as TypeScript/Next.js build warnings.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add reveal/sticky/parallax CSS foundation"
```

---

### Task 2: Create ScrollEffects client component

**Files:**
- Create: `src/components/ScrollEffects.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
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
```

- [ ] **Step 2: Build to verify TypeScript**

```bash
npm run build 2>&1 | tail -20
```

Expected: clean build. Fix any TS errors before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollEffects.tsx
git commit -m "feat: add ScrollEffects client component (reveal + parallax)"
```

---

### Task 3: Add `data-reveal` to TimelineSection items

**Files:**
- Modify: `src/components/TimelineSection.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import GlitchText from "@/components/GlitchText";
import type { TimelineEntry } from "@/lib/types";

export default function TimelineSection({
  heading,
  id,
  entries,
}: {
  heading: string;
  id: string;
  entries: TimelineEntry[];
}) {
  return (
    <section className="timeline-section" id={id}>
      <GlitchText as="h2" className="section-label" text={heading} />
      <div className="timeline-list">
        {entries.map((e) => (
          <article className="timeline-item" key={`${e.title}-${e.org}`} data-reveal>
            <h3 className="timeline-item__title">{e.title}</h3>
            <p className="timeline-item__meta">
              <span className="timeline-item__org">{e.org}</span>
              <span className="timeline-item__period"> · {e.period}</span>
            </p>
            <ul className="timeline-item__bullets">
              {e.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Only change from the original: `data-reveal` added to `<article>` and unused `i` index param removed from `.map`.

- [ ] **Step 2: Build to verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
git add src/components/TimelineSection.tsx
git commit -m "feat: add data-reveal to TimelineSection items"
```

---

### Task 4: Add `data-reveal` to PublicationList items

**Files:**
- Modify: `src/components/PublicationList.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import GlitchText from "@/components/GlitchText";
import type { Publication } from "@/lib/types";

export default function PublicationList({
  heading,
  id,
  items,
}: {
  heading: string;
  id: string;
  items: Publication[];
}) {
  return (
    <section className="projects" id={id}>
      <GlitchText as="h2" className="section-label" text={heading} />
      <div className="project-grid">
        {items.map((pub) => (
          <article className="project-item" key={pub.title} data-reveal>
            <h3 className="project-item__title">{pub.title}</h3>
            {pub.venue && <p className="project-item__venue">{pub.venue}</p>}
            <p className="project-description">{pub.description}</p>
            {pub.links && (
              <div className="project-links">
                {pub.links.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
```

Only change: `data-reveal` added to `<article>`. Unused `i` index removed from `.map`.

- [ ] **Step 2: Build to verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
git add src/components/PublicationList.tsx
git commit -m "feat: add data-reveal to PublicationList items"
```

---

### Task 5: Wire ScrollEffects into layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add import after existing imports**

After the line `import "./globals.css";`, add:

```tsx
import ScrollEffects from "@/components/ScrollEffects";
```

- [ ] **Step 2: Add `<ScrollEffects />` inside `<body>`**

Change the `<body>` block from:

```tsx
<body>
  <div className="scanlines"></div>
  <div className="crt-overlay"></div>
  <SiteNav />
  {children}
  <Footer />
  <GoogleAnalytics gaId="G-ZBC862D3S5" />
</body>
```

To:

```tsx
<body>
  <div className="scanlines"></div>
  <div className="crt-overlay"></div>
  <SiteNav />
  <ScrollEffects />
  {children}
  <Footer />
  <GoogleAnalytics gaId="G-ZBC862D3S5" />
</body>
```

- [ ] **Step 3: Build to verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 4: Visual smoke test**

```bash
npm run dev
```

Open `http://localhost:3000` and check:
1. Scroll down slowly — timeline and project items fade + slide up as they enter view, cascading with slight stagger
2. Section headings (EDUCATION, EXPERIENCE, PAPERS, PROJECTS) pin just below the nav while their section is in view, then hand off to the next
3. The landing hero gently drifts up and fades as you scroll away from it
4. Items already in view on initial load also reveal correctly (IntersectionObserver fires on mount)
5. Turn on `prefers-reduced-motion` in OS accessibility settings and reload — everything should render fully visible with no transitions

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: mount ScrollEffects in layout for reveal + parallax"
```

---

## Self-Review

**Spec coverage:**
- ✅ Reveal on scroll → `[data-reveal]` + `IntersectionObserver` (Tasks 1, 2, 3, 4)
- ✅ Pinned section titles → `position: sticky` on `.section-label` (Task 1)
- ✅ Parallax / depth → CSS vars + rAF `handleScroll` (Tasks 1, 2)
- ✅ Subtle & refined → 0.6s ease, 12% parallax factor, 500px fade window
- ✅ `prefers-reduced-motion` guard (Task 1, Step 4)
- ✅ CRT theme untouched — only `[data-reveal]`, `.section-label`, `.landing` touched; palette, scanlines, glow effects all unchanged

**Placeholder scan:** None found. All steps contain complete code.

**Type consistency:**
- `data-reveal` attribute used consistently in Tasks 1 (CSS `[data-reveal]`), 2 (`querySelectorAll("[data-reveal]")`), 3, 4 (JSX)
- `.is-visible` class: added by Task 2 observer, targeted by Task 1 CSS `[data-reveal].is-visible`
- `--parallax-y` / `--parallax-opacity`: set by Task 2 `handleScroll`, consumed by Task 1 `.landing` CSS
- `ScrollEffects` name consistent between Task 2 (export default) and Task 5 (import + JSX)
