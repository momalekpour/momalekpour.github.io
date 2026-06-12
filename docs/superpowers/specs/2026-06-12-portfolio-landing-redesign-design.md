# Portfolio landing redesign & section restructure

## Context

The Next.js CRT portfolio (malekpour.io) currently opens with a busy top — a
`mo@malekpour:~$` nav logo plus a large hero name — and lumps all publications and
projects into one "Selected Work" list. The owner wants a more modern, compact entry
experience and clearer content separation.

Goals:

- A compact, full-height **landing** that shows, centered: the name, the title line, and
  the **real About Me** text (the existing typing animation + 3-persona click-cycle).
- Declutter the top: drop the terminal logo and the "AI Researcher · Mila · PolyMTL"
  eyebrow; minimal nav with section links only.
- Split the single work list into distinct **Papers**, **Projects**, **Experience**, and
  **Education** sections.
- Make body/description text **white** (headings stay green).

Keep the green CRT aesthetic, Quicksand font, scanlines/glow, typing animation, persona
cycle, and the glitch easter-egg.

## Design

### Landing (full-height, centered)

A `<section class="landing" id="top">` sized `min-height: 100vh`, flex-centered, holding:

- **Name** — `Mo Malekpour`, ~26px (down from the large hero size). The periodic **glitch**
  effect (previously on the "About Me" heading, which no longer exists) relocates here as a
  brief, occasional scramble of the name.
- **Title** — `ML Software Engineer & Researcher, Databases Internals Enjoyer`, green-dim.
- **About Me** — the existing typing animation, rendered in **white**. Clicking the about
  text cycles through all three personas (full personas, per owner's choice). A small
  "(click to cycle)" hint is acceptable but optional.
- **Scroll cue** — a small bobbing "scroll ↓" at the bottom linking to `#papers`.

The nav highlights "about" for this section; the `about` link points to `#top`.

### Navigation

Slim **sticky** top bar, centered links only, **no logo**:
`about · papers · projects · experience · education · contact`. Same blurred-dark
background and hover styling as today. Anchors smooth-scroll; `scroll-margin-top` already
clears the sticky bar.

### Sections (in order, below the landing)

1. **Papers** (`id="papers"`) — academic publications. List rows: title (green) + venue
   (green, right-aligned) + description (**white**) + link tags. Items: SQLMorph
   (ICDE 2026), Towards Optimizing SQL Generation via LLM Routing (NeurIPS 2024 · TRL),
   Machine Learning Predictions for Sustainable Concrete Constructions (JOBE 2024).
2. **Projects** (`id="projects"`) — same row style. Items: VortoSQL, DailyDiet.
3. **Experience** (`id="experience"`) — timeline entries (see shared component).
4. **Education** (`id="education"`) — timeline entries, identical layout, placed right
   after Experience.
5. **Contact** (`id="contact"`) — social links (unchanged).

Each section keeps the hairline top-border divider, green `section-label` heading, and
vertical rhythm already in use.

### Shared timeline component (Experience + Education)

Experience and Education render identically, so one component handles both:

`TimelineSection({ heading, id, entries })` where each `entry` is
`{ title, org, period, bullets: string[] }`. Row layout:

- Head: `title @ org` on the left (green title, dimmer org), `period` right-aligned
  (green-dim, like a venue/date).
- Bullets: a `<ul>` rendered in **white**.

This keeps both YAML lists using the same intuitive keys.

### Color change

Set the body text token `--color-text` to **white (`#ffffff`)** so About text, publication/
project descriptions, and timeline bullets are white. Headings (`--color-green`), titles,
venues, dates, nav links, and labels stay green. Keep the red/cyan CRT text-shadow fringe
on white body text.

## Content model (`content/content.yaml`)

```yaml
profile:
  name: "Mo Malekpour"
  title: "ML Software Engineer & Researcher, Databases Internals Enjoyer"
  # `eyebrow` and `tagline` removed

aboutMe:
  texts: [ ...the 3 personas, unchanged... ]

publications:   # Papers section (3 academic items only)
  - SQLMorph … (ICDE 2026)
  - LLM Routing … (NeurIPS 2024 · TRL)
  - Concrete … (JOBE 2024)

projects:       # new — Projects section
  - VortoSQL …
  - DailyDiet …

experience:     # new — entries: title, org, period, bullets[]
  - title: "Graduate Research Assistant"
    org: "Mila — Quebec Artificial Intelligence Institute"
    period: "09/2023 – 12/2025"
    bullets:
      - "Member of Data & AI Systems lab, focused on agentic AI and data systems, specifically Text-to-SQL, and exploring DB internals."
      - "Implemented VortoSQL (NeurIPS'24), an end-to-end Text-to-SQL system via LLM router, reducing pipeline costs by up to 40%."
      - "Developed SQLMorph (ICDE'26), a Text-to-SQL eval framework with novel fine-grained metrics and query mutation techniques."
  - title: "Data Engineer"
    org: "Divar"
    period: "02/2022 – 11/2022"
    bullets:
      - "Worked within the core Business Insight team for Divar's e-commerce platform with 30M+ monthly active users."
      - "Designed and implemented a company-wide KPI system as the single source of truth, with 50+ fine/coarse-grained metrics."
      - "Built and maintained 20+ ETL pipelines using Python, SQL, PySpark, Hadoop HDFS, Apache Airflow and Metabase."
      - "Delivered many ad-hoc analyses to uncover inefficiencies, identify trends, and produce dashboards and predictive models."
  - title: "Software Engineer Intern"
    org: "Segmentino"
    period: "06/2020 – 09/2020"
    bullets:
      - "Worked at Segmentino, an AI-powered marketing automation platform enabling omnichannel engagement and retention."
      - "Developed mslib, an internal Python SDK for Node.js microservices, reducing integration time and development overhead."
      - "Built enlib, a backend engine for the marketing journey designer, transforming user-created workflows into dynamic DAGs."
  - title: "Software Engineer Intern"
    org: "Institute for Research in Fundamental Sciences (IPM)"
    period: "06/2019 – 09/2019"
    bullets:
      - "Improved data infrastructure for monitoring systems in Technical Development Division of the National Observatory."
      - "Redesigned the MySQL weather monitoring database and built Flask APIs to streamline environmental data for R&D teams."
      - "Built a web server for Robo-DIMM (night-sky telescope) using socket-based communication and modular system design."

education:      # new — same entry shape, rendered after Experience
  - title: "MASc in Computer Engineering"
    org: "Polytechnique Montreal"
    period: "08/2023 – 12/2025"
    bullets:
      - "Nominated for the Best Master's Thesis Award, 2025"
      - "Courses: Engineering AI Software Systems, Representation Learning, Advanced Concepts of Cloud Computing (GPA 4.0)"
      - "TA: Files and Databases"
  - title: "BSc in Computer Science, minor in Economics"
    org: "AmirKabir University of Technology"
    period: "09/2017 – 08/2022"
    bullets:
      - "TA: Fundamentals of Programming, Advanced Programming, Principle of Software Design, Data Science, ML"

contact:
  social: [ ...unchanged... ]
```

## Code changes

- **`src/lib/types.ts`** — update `SiteContent`: drop `eyebrow`/`tagline`; add
  `projects: Publication[]`, `experience: TimelineEntry[]`, `education: TimelineEntry[]`;
  add `TimelineEntry { title; org; period; bullets: string[] }`.
- **`src/components/Landing.tsx`** (new, `"use client"`) — replaces `Hero.tsx` +
  `AboutBio.tsx`. Renders name (with glitch ref), title, and the white typing About
  (TypingEffect + click-to-cycle), plus the scroll cue. Reuses `@/lib/typing`.
- **`src/components/TimelineSection.tsx`** (new) — renders Experience and Education.
- **`src/components/Papers.tsx`** + **`src/components/Projects.tsx`** — replace `Work.tsx`
  (same row markup; Papers reads `publications`, Projects reads `projects`).
- **`src/components/SiteNav.tsx`** — centered links, no logo; six anchors.
- **`src/app/page.tsx`** — compose: `<Landing/>`, `<Papers/>`, `<Projects/>`,
  `<TimelineSection heading="Experience" .../>`, `<TimelineSection heading="Education" .../>`,
  `<Contact/>`.
- **`src/app/globals.css`** — `--color-text: #ffffff`; add `.landing` (100vh flex-center),
  `.landing__inner`, restyle `.hero__name` (smaller, centered) + `.hero__title`,
  `.scroll-cue` (bob animation), `.timeline-*` (head row + white bullets); move the
  `.glitching` target to the name; drop now-unused `.hero__eyebrow`/`.hero__tagline`.
- Delete `Hero.tsx`, `AboutBio.tsx`, `Work.tsx`.

`layout.tsx` is unchanged except it no longer needs to render `<SiteNav/>`/`<Footer/>`
differently (still fine). SEO metadata stays.

## Verification

1. `npm run dev` → landing fills the viewport: small name (occasional glitch), title,
   white About typing; clicking About cycles all 3 personas; "scroll ↓" jumps to Papers.
2. Nav has 6 centered links, no logo; each smooth-scrolls and clears the sticky bar.
3. Papers (3), Projects (2), Experience (4), Education (2) render with green titles/dates
   and **white** descriptions/bullets; PDF/repo links work.
4. `npm run build` succeeds (static export); `npm run lint` clean.
5. Mobile width: landing + sections stack readably; timeline head rows stack.
6. Headless screenshot parity check (desktop + mobile).
