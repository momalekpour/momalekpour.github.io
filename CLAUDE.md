# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal portfolio for Mo Malekpour (malekpour.io) — a single-page, CRT/terminal-themed
site built with **Next.js 15 (App Router) + TypeScript + React 19**, shipped as a fully
**static export** (`output: 'export'`) to GitHub Pages.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server with hot reload → http://localhost:3000
npm run build      # static export → out/
npm run preview    # serve the built out/ locally (via `serve`)
npm run lint       # eslint (next/core-web-vitals)
```

Requires Node 18+ (`brew install node`). `npm run build` also runs type-checking and lint.

## Architecture

Content-driven and static-first:

- **[content/content.yaml](content/content.yaml)** is the single source of truth (profile,
  three About personas, social links, publications, projects, experience, education).
  Editing the site = editing this file.
- **[src/lib/content.ts](src/lib/content.ts)** reads & parses that YAML with `js-yaml` at
  **build time** (server-side `fs`), typed by [src/lib/types.ts](src/lib/types.ts).
- **[src/app/page.tsx](src/app/page.tsx)** is a server component: it calls `getContent()`
  and composes the sections — `<Landing>`, two `<PublicationList>` (Papers, Projects),
  two `<TimelineSection>` (Experience, Education), plus `<SocialLinks>` rendered as a
  fixed bottom dock (`.social-dock`).
- **[src/app/layout.tsx](src/app/layout.tsx)** holds the `<html>` frame: SEO `metadata`,
  two JSON-LD blocks, Quicksand via `next/font`, Google Analytics via
  `@next/third-parties`, the CRT overlay divs, `<SiteNav/>`, and `<Footer/>`.
- **[src/components/](src/components/)**: `PublicationList` and `TimelineSection` are each
  reused for two sections (Papers/Projects and Experience/Education respectively).
  Only **[src/components/Landing.tsx](src/components/Landing.tsx)** is a client component
  (`"use client"`): the full-height landing whose `useEffect` drives the typing animation,
  the click-to-cycle persona switch (click the About block), and a periodic glitch on the
  name — with full cleanup (timers + appended spans) on unmount.
- **Styling** is one global file, [src/app/globals.css](src/app/globals.css) (CSS custom
  properties for the green-phosphor palette + spacing scale; body text is white,
  headings/labels green; scanlines/glitch/glow effects).

## Conventions & gotchas

- **Static export constraints**: no server-side runtime, API routes, or Next image
  optimization (`images.unoptimized: true`). Anything dynamic must be client-side.
- **Asset URLs**: everything in `public/` is served from `/`. Favicons and PDFs live under
  `public/assets/...` specifically to preserve pre-migration `/assets/...` URLs — keep them
  there. `public/CNAME` (malekpour.io) and `public/.nojekyll` must survive into `out/`.
- **Landing cleanup**: the typing engine imperatively appends spans into `#typed-text`;
  the effect's cleanup clears them (and cancels both glitch timers) so React strict-mode
  double-mounts don't duplicate. `TypingEffect.destroy()` also resolves any pending
  `delay()` promise so `changeText()`'s wait-loop can't hang after unmount.
- **`.gitignore`**: do NOT reintroduce a bare `lib/` pattern — it shadows `src/lib/` and
  silently un-tracks the content/types/typing modules, breaking the deploy build.
- The `--font-quicksand` CSS var is injected by `next/font` in `layout.tsx`; `globals.css`
  references it in `--font-mono`.

## Deployment

Push to `main` → [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and
publishes to GitHub Pages. Requires the repo's Pages **Source** set to **GitHub Actions**
(one-time, in repo settings).
