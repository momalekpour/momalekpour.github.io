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
  three About personas, social links, publications). Editing the site = editing this file.
- **[src/lib/content.ts](src/lib/content.ts)** reads & parses that YAML with `js-yaml` at
  **build time** (server-side `fs`), typed by [src/lib/types.ts](src/lib/types.ts).
- **[src/app/page.tsx](src/app/page.tsx)** is a server component: it calls `getContent()`
  and passes data as props into the section components.
- **[src/app/layout.tsx](src/app/layout.tsx)** holds the `<html>` frame: SEO `metadata`,
  two JSON-LD blocks, Quicksand via `next/font`, Google Analytics via
  `@next/third-parties`, the CRT overlay divs, `<SiteNav/>`, and `<Footer/>`.
- **[src/components/](src/components/)** are presentational (Hero, Work, Contact, etc.).
  Only **[src/components/AboutBio.tsx](src/components/AboutBio.tsx)** is a client component
  (`"use client"`): in a `useEffect` it drives the typing animation, the click-to-cycle
  persona switch, and the heading glitch, with full cleanup on unmount.
- **Styling** is one global file, [src/app/globals.css](src/app/globals.css) (CSS custom
  properties for the green-phosphor palette + spacing scale; scanlines/glitch/glow effects).

## Conventions & gotchas

- **Static export constraints**: no server-side runtime, API routes, or Next image
  optimization (`images.unoptimized: true`). Anything dynamic must be client-side.
- **Asset URLs**: everything in `public/` is served from `/`. Favicons and PDFs live under
  `public/assets/...` specifically to preserve pre-migration `/assets/...` URLs — keep them
  there. `public/CNAME` (malekpour.io) and `public/.nojekyll` must survive into `out/`.
- **AboutBio cleanup**: the typing engine imperatively appends spans into `#typed-text`;
  the effect's cleanup clears them so React strict-mode double-mounts don't duplicate.
- The `--font-quicksand` CSS var is injected by `next/font` in `layout.tsx`; `globals.css`
  references it in `--font-mono`.

## Deployment

Push to `main` → [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and
publishes to GitHub Pages. Requires the repo's Pages **Source** set to **GitHub Actions**
(one-time, in repo settings).
