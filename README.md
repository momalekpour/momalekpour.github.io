# malekpour.io

Personal site for Mo Malekpour — a single-page, CRT/terminal-themed portfolio built with
**Next.js** (App Router + TypeScript) and deployed as a fully static site to GitHub Pages
at [malekpour.io](https://malekpour.io).

All page content lives in one YAML file, so updating the site usually means editing
`content/content.yaml` — no React or TypeScript needed.

## Prerequisites

You only need **Node.js** (which includes `npm`). On macOS, install it with
[Homebrew](https://brew.sh):

```bash
brew install node
```

Verify it worked:

```bash
node -v   # should print v18 or newer
npm -v
```

## Getting started

From the project folder:

```bash
npm install      # one time: download dependencies into node_modules/
npm run dev      # start the local dev server
```

Then open **http://localhost:3000**. The page reloads automatically as you edit files.

## Editing content

Open **`content/content.yaml`** and edit the text. It has four sections:

- `profile` — your name and title (shown on the centered landing screen).
- `aboutMe.texts` — the bios for the typing animation on the landing. There are three
  "personas"; clicking the About text cycles through them. Add/remove/edit entries here.
- `education` / `experience` — the **Education** and **Experience** sections (rendered in
  that order). Each entry has `title`, `org`, `period`, and a list of `bullets`.
- `publications` and `projects` — rendered as two separate sections, **Papers** and
  **Projects**. Each entry has a `title`, optional `venue`, a `description`, and optional
  `links` (name + url).
- `contact.social` — the social links, shown as a fixed icon dock pinned to the bottom of
  the screen (the icon is matched by `name`: GitHub, LinkedIn, Scholar, X, YouTube, Email).

Save the file and the dev server updates instantly. To add a PDF (e.g. a new poster),
drop it in `public/assets/documents/` and link to it as
`/assets/documents/your-file.pdf`.

## Project structure

```
content/
  content.yaml          ← all site text lives here (edit this to update the site)
public/
  CNAME                 ← custom domain (malekpour.io) — don't delete
  .nojekyll             ← tells GitHub Pages not to mangle Next.js output
  favicon.ico
  assets/
    favicon_io/         ← favicons + web manifest
    documents/          ← PDFs (papers, posters, CV)
src/
  app/
    layout.tsx          ← <html>, SEO metadata, JSON-LD, fonts, analytics, page frame
    page.tsx            ← composes the page sections from content.yaml
    globals.css         ← all styling (CRT theme, layout, typography)
  components/
    SiteNav.tsx         ← sticky top navigation (centered links + scroll-spy active state)
    Landing.tsx         ← full-height landing: name (glitch) + title + typing About (personas)
    PublicationList.tsx ← reusable list, used for both Papers and Projects
    TimelineSection.tsx ← reusable list, used for both Experience and Education
    SocialLinks.tsx     ← contact icon buttons (the fixed bottom dock)
    Footer.tsx
  lib/
    content.ts          ← reads & parses content.yaml at build time
    types.ts            ← TypeScript shape of the content
    typing.ts           ← the typing-animation engine
    typingConfig.ts     ← typing speed / behavior tuning
next.config.mjs         ← configured for static export (output: 'export')
.github/workflows/      ← GitHub Actions workflow that builds & deploys the site
```

## Build & preview the production site

```bash
npm run build    # generates the static site into the out/ folder
npm run preview  # serves out/ locally so you can check the production build
```

## Deployment

Deployment is automatic via GitHub Actions: **every push to `main`** builds the site and
publishes it to GitHub Pages. The `public/CNAME` file keeps the `malekpour.io` domain, so
DNS doesn't change.

**One-time setup** (only needed once, in the GitHub web UI):

> Repository **Settings → Pages → Build and deployment → Source = "GitHub Actions"**

After that, just commit and push to `main`; the "Deploy to GitHub Pages" workflow
(under the repo's **Actions** tab) handles the rest.

## Useful commands

| Command          | What it does                                        |
| ---------------- | --------------------------------------------------- |
| `npm run dev`     | Local dev server with hot reload (localhost:3000)   |
| `npm run build`   | Build the static site into `out/`                   |
| `npm run preview` | Serve the built `out/` locally                      |
| `npm run lint`    | Check the code for problems                         |
