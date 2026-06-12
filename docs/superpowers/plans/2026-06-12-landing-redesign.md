# Landing Redesign & Section Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the busy top with a compact full-height landing (name + title + white About typing), restructure the single work list into Papers / Projects / Experience / Education, and make body text white.

**Architecture:** Next.js App Router static site. Content from `content/content.yaml` (build-time). Merge `Hero` + `AboutBio` into one client `Landing` component; add reusable `PublicationList` (Papers + Projects) and `TimelineSection` (Experience + Education) components; restyle in the single `globals.css`.

**Tech Stack:** Next.js 15, React 19, TypeScript, plain CSS. No test runner — verification is `npm run build`, `npm run lint`, and headless-Chrome/puppeteer screenshots + interaction checks.

**Spec:** `docs/superpowers/specs/2026-06-12-portfolio-landing-redesign-design.md`

---

## File Structure

- **Modify** `content/content.yaml` — new `projects`, `experience`, `education`; trim `publications` to papers; update `profile.title`; drop `eyebrow`/`tagline`.
- **Modify** `src/lib/types.ts` — add `TimelineEntry`, `projects`, `experience`, `education`; drop `eyebrow`/`tagline`.
- **Create** `src/components/Landing.tsx` — client; name (with glitch) + title + white About typing (persona cycle) + scroll cue.
- **Create** `src/components/PublicationList.tsx` — reusable list for Papers and Projects.
- **Create** `src/components/TimelineSection.tsx` — reusable list for Experience and Education.
- **Modify** `src/components/SiteNav.tsx` — six centered links, no logo.
- **Modify** `src/app/page.tsx` — compose the new sections.
- **Modify** `src/app/globals.css` — white body text, `.landing`, scroll cue, timeline styles, relocate glitch to name, center nav.
- **Delete** `src/components/Hero.tsx`, `src/components/AboutBio.tsx`, `src/components/Work.tsx`.

---

## Task 1: Restructure content.yaml

**Files:**
- Modify: `content/content.yaml`

- [ ] **Step 1: Update `profile` (new title, drop eyebrow/tagline)**

Replace the `profile:` block with:

```yaml
profile:
  name: "Mo Malekpour"
  title: "ML Software Engineer & Researcher, Databases Internals Enjoyer"
```

(Leave `aboutMe:` exactly as-is.)

- [ ] **Step 2: Trim `publications` to the 3 papers**

Ensure `publications:` contains ONLY these three entries (remove VortoSQL and DailyDiet from it): SQLMorph (`venue: "ICDE 2026"`), Towards Optimizing SQL Generation via LLM Routing (`venue: "NeurIPS 2024 · TRL"`), Machine Learning Predictions for Sustainable Concrete Constructions (`venue: "JOBE 2024"`) — keep their existing `links` and `description` text unchanged.

- [ ] **Step 3: Add `projects` (the two non-paper items)**

Add a new top-level block (after `publications:`), moving VortoSQL and DailyDiet here verbatim from their old entries:

```yaml
projects:
  - title: "VortoSQL: Safe NL2SQL Data Agent"
    venue: "Project"
    links:
      - name: "Repository"
        url: "https://github.com/momalekpour/nl2sql-data-agent"
    description: "A modular NL2SQL system that translates natural language questions into SQL queries, enforces row-level guardrails, executes the SQL against a SQLite database, and returns results in natural language. Built around a composable operator pipeline with five guardrail layers and a generic early-stop mechanism."
  - title: "DailyDiet"
    venue: "Project"
    links:
      - name: "Repository"
        url: "https://github.com/DailyDiet/DailyDiet-API"
    description: "DailyDiet is a full-stack nutrition management platform that helps users plan meals, calculate daily calorie needs, and explore recipes tailored to their goals. I was responsible for leading all backend development — building a scalable RESTful API with Flask and PostgreSQL to handle user authentication, dynamic diet generation, and recipe indexing. The backend features a dynamic-programming–based diet recommendation engine, JWT-secured user accounts, and Elasticsearch integration for semantic and ingredient-based recipe search. I also managed deployment and infrastructure setup on Heroku, and designed the data models for user tracking and admin moderation. The API powers the Vue.js + Nuxt web frontend and the companion iOS app."
```

- [ ] **Step 4: Add `experience` block**

```yaml
experience:
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
```

- [ ] **Step 5: Add `education` block**

```yaml
education:
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
```

Keep `contact:` unchanged. Order in file: profile, aboutMe, publications, projects, experience, education, contact.

- [ ] **Step 6: Validate YAML parses**

Run: `node -e "const y=require('/tmp/node_modules/js-yaml');const d=y.load(require('fs').readFileSync('content/content.yaml','utf8'));console.log('pubs',d.publications.length,'projects',d.projects.length,'exp',d.experience.length,'edu',d.education.length,'title',d.profile.title)"`
Expected: `pubs 3 projects 2 exp 4 edu 2 title ML Software Engineer & Researcher, Databases Internals Enjoyer`

- [ ] **Step 7: Commit**

```bash
git add content/content.yaml
git commit -m "content: split work into papers/projects, add experience+education, new title"
```

---

## Task 2: Update types

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Replace the file contents**

```ts
// Shape of content/content.yaml — the single source of truth for site content.

export interface SocialLink {
  name: string;
  url: string;
}

export interface PublicationLink {
  name: string;
  url: string;
}

export interface Publication {
  title: string;
  venue?: string;
  description: string;
  links?: PublicationLink[];
}

export interface TimelineEntry {
  title: string;
  org: string;
  period: string;
  bullets: string[];
}

export interface SiteContent {
  profile: {
    name: string;
    title: string;
  };
  aboutMe: {
    texts: string[];
  };
  publications: Publication[];
  projects: Publication[];
  experience: TimelineEntry[];
  education: TimelineEntry[];
  contact: {
    social: SocialLink[];
  };
}
```

- [ ] **Step 2: Commit** (commit together with Task 3–6 components, or now)

```bash
git add src/lib/types.ts
git commit -m "types: add TimelineEntry, projects/experience/education; drop eyebrow/tagline"
```

---

## Task 3: Landing component (merge Hero + AboutBio)

**Files:**
- Create: `src/components/Landing.tsx`
- Delete: `src/components/Hero.tsx`, `src/components/AboutBio.tsx`

- [ ] **Step 1: Create `src/components/Landing.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { TypingEffect } from "@/lib/typing";
import type { SiteContent } from "@/lib/types";

const GLITCH_CHARS = [
  "@", "#", "$", "%", "&", "*", "!", "?", "<", ">", "{", "}", "[", "]", "█", "▓", "▒", "░",
];

export default function Landing({
  profile,
  texts,
}: {
  profile: SiteContent["profile"];
  texts: string[];
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
      window.setTimeout(() => {
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
```

- [ ] **Step 2: Delete the merged-away components**

```bash
git rm src/components/Hero.tsx src/components/AboutBio.tsx
```

- [ ] **Step 3: Commit** (after Task 6 wires page.tsx, since deleting breaks the build until then — defer commit to Task 7)

---

## Task 4: PublicationList component (Papers + Projects)

**Files:**
- Create: `src/components/PublicationList.tsx`
- Delete: `src/components/Work.tsx`

- [ ] **Step 1: Create `src/components/PublicationList.tsx`**

```tsx
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
      <h2 className="section-label">{heading}</h2>
      <div className="project-grid">
        {items.map((pub, i) => (
          <article className="project-item" key={i}>
            <div className="project-item__head">
              <h3 className="project-item__title">{pub.title}</h3>
              {pub.venue && <span className="project-item__venue">{pub.venue}</span>}
            </div>
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

- [ ] **Step 2: Delete old Work component**

```bash
git rm src/components/Work.tsx
```

---

## Task 5: TimelineSection component (Experience + Education)

**Files:**
- Create: `src/components/TimelineSection.tsx`

- [ ] **Step 1: Create `src/components/TimelineSection.tsx`**

```tsx
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
      <h2 className="section-label">{heading}</h2>
      <div className="timeline-list">
        {entries.map((e, i) => (
          <article className="timeline-item" key={i}>
            <div className="timeline-item__head">
              <h3 className="timeline-item__title">
                {e.title} <span className="timeline-item__org">@ {e.org}</span>
              </h3>
              <span className="timeline-item__period">{e.period}</span>
            </div>
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

---

## Task 6: Update SiteNav and page.tsx

**Files:**
- Modify: `src/components/SiteNav.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace `src/components/SiteNav.tsx`**

```tsx
export default function SiteNav() {
  return (
    <nav className="site-nav">
      <div className="site-nav__links">
        <a href="#top">about</a>
        <a href="#papers">papers</a>
        <a href="#projects">projects</a>
        <a href="#experience">experience</a>
        <a href="#education">education</a>
        <a href="#contact">contact</a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Replace `src/app/page.tsx`**

```tsx
import { getContent } from "@/lib/content";
import Landing from "@/components/Landing";
import PublicationList from "@/components/PublicationList";
import TimelineSection from "@/components/TimelineSection";
import Contact from "@/components/Contact";

export default function Home() {
  const content = getContent();

  return (
    <main className="site-main crt">
      <Landing profile={content.profile} texts={content.aboutMe.texts} />
      <PublicationList heading="Papers" id="papers" items={content.publications} />
      <PublicationList heading="Projects" id="projects" items={content.projects} />
      <TimelineSection heading="Experience" id="experience" entries={content.experience} />
      <TimelineSection heading="Education" id="education" entries={content.education} />
      <Contact social={content.contact.social} />
    </main>
  );
}
```

- [ ] **Step 3: Commit the component + wiring set**

```bash
git add -A src/components src/app/page.tsx src/lib/types.ts
git commit -m "feat: landing component, papers/projects/experience/education sections, centered nav"
```

---

## Task 7: Restyle globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Body text → white.** In `:root`, change the token:

```css
    --color-text: #ffffff;
```

- [ ] **Step 2: Center the nav, drop logo dependence.** Replace the `.site-nav` rule's `justify-content: space-between;` with `justify-content: center;` (leave the rest of `.site-nav` as-is; the unused `.site-nav__logo` rule can stay or be removed).

- [ ] **Step 3: Replace the `.hero` block with `.landing`.** Find the `.hero { padding: ... }` rule (in the layout section) and replace it with:

```css
.landing {
    min-height: calc(100vh - var(--nav-height));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding: var(--space-xl) 0 var(--space-2xl);
    box-sizing: border-box;
}

.landing__inner {
    max-width: 560px;
}

.landing .about {
    cursor: pointer;
    text-align: left;
}

.scroll-cue {
    position: absolute;
    bottom: var(--space-lg);
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.8rem;
    letter-spacing: 1px;
    color: var(--green-45);
    text-decoration: none;
}

.scroll-cue__arrow {
    display: block;
    margin-top: 4px;
    animation: bob 1.6s ease-in-out infinite;
}

@keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(4px); }
}
```

- [ ] **Step 4: Resize hero name + title.** Replace the existing `.hero__name` rule with:

```css
.hero__name {
    font-size: clamp(1.6rem, 5vw, 2rem);
    line-height: 1.1;
    letter-spacing: -0.5px;
    margin: 0 0 var(--space-xs);
    cursor: default;
}

.hero__title {
    font-size: 0.95rem;
    color: var(--green-60);
    margin: 0 0 var(--space-lg);
    text-shadow: none;
}
```

Delete the now-unused `.hero__eyebrow` and `.hero__tagline` rules.

- [ ] **Step 5: Publication/about descriptions white.** Change `.project-description`'s `color: var(--green-80);` to `color: var(--color-text);`.

- [ ] **Step 6: Relocate the glitch to the name.** Change the selector `.about-me h2.glitching` to `.hero__name.glitching`. Delete the `.about-me h2`, `.about-me h2:hover`, `.about-me`, and `.about-me .content-wrapper` rules (the landing no longer uses them). Keep the `@keyframes textGlitch` block.

- [ ] **Step 7: Add timeline styles.** Append:

```css
/* ---------- timeline (experience + education) ---------- */

.timeline-section {
    padding: var(--space-xl) 0;
    border-top: 1px solid var(--green-12);
    position: relative;
}

.timeline-list {
    display: flex;
    flex-direction: column;
    margin-top: var(--space-lg);
}

.timeline-item {
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--green-12);
}

.timeline-item:last-child {
    border-bottom: none;
}

.timeline-item__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-md);
}

.timeline-item__title {
    font-size: 1.05rem;
    line-height: 1.4;
}

.timeline-item__org {
    color: var(--green-60);
    font-weight: normal;
}

.timeline-item__period {
    font-size: 0.8rem;
    color: var(--green-45);
    white-space: nowrap;
    text-shadow: none;
}

.timeline-item__bullets {
    margin: var(--space-xs) 0 0;
    padding-left: 1.1rem;
    color: var(--color-text);
}

.timeline-item__bullets li {
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0.15rem 0;
}
```

- [ ] **Step 8: Mobile stacking.** Inside the existing `@media (max-width: 600px)` block, add a rule so timeline head rows stack like project heads:

```css
    .timeline-item__head {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.2rem;
    }
```

- [ ] **Step 9: Commit**

```bash
git add src/app/globals.css
git commit -m "style: white body text, full-height landing, timeline + scroll cue, name glitch"
```

---

## Task 8: Verify end-to-end

**Files:** none (verification only)

- [ ] **Step 1: Lint + build**

Run: `npm run lint && npm run build`
Expected: "No ESLint warnings or errors" and a successful static export (no type errors; `out/` regenerated).

- [ ] **Step 2: Serve the build**

Run: `(npx --yes serve out -l 4321 >/tmp/serve.log 2>&1 &) ; sleep 2; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/`
Expected: `200`

- [ ] **Step 3: Headless structure + interaction check**

Run a puppeteer script (Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, `/tmp/node_modules/puppeteer-core`) against `http://localhost:4321/` that asserts:
- `.landing` exists and its height ≈ viewport height (full-screen landing).
- `.hero__name` = "Mo Malekpour"; `.hero__title` contains "ML Software Engineer".
- Nav has 6 links; clicking `#experience` scrolls so `#experience` top ≈ 72px (clears sticky nav).
- Clicking `.landing .about` changes `#typed-text` content (persona cycle).
- Section counts: Papers `.project-item` under `#papers` = 3, Projects under `#projects` = 2, `#experience .timeline-item` = 4, `#education .timeline-item` = 2.
- `getComputedStyle(document.querySelector('.project-description')).color` is `rgb(255, 255, 255)` (white).
- No console errors.

Capture `/tmp/redesign-desktop.png` (1280px) and `/tmp/redesign-mobile.png` (390px, `isMobile`).

- [ ] **Step 4: Eyeball the screenshots** — confirm: compact centered landing (small name, title, white About typing, scroll cue); below it Papers/Projects/Experience/Education with green titles + dates and white descriptions/bullets; mobile stacks cleanly with no horizontal overflow.

- [ ] **Step 5: Stop the preview server**

Run: `lsof -ti:4321 | xargs kill 2>/dev/null; echo stopped`

- [ ] **Step 6: Update docs.** In `CLAUDE.md` and `README.md`, update the component/section list (Landing instead of Hero+AboutBio; PublicationList; TimelineSection; the six nav sections). Commit:

```bash
git add CLAUDE.md README.md
git commit -m "docs: update structure for landing redesign"
```

---

## Self-Review

- **Spec coverage:** landing (T3+T7), compact nav no logo (T6+T7), white text (T7 s1/s5/s7), Papers/Projects (T1/T4/T6), Experience/Education (T1/T5/T6), name glitch (T3+T7 s6), content model incl. all entries (T1), delete Hero/AboutBio/Work (T3/T4). All covered.
- **Type consistency:** `TimelineEntry { title, org, period, bullets }` defined in T2, consumed identically in T5 and produced in T1 YAML. `PublicationList` props `{heading,id,items: Publication[]}` match T6 usage. `Landing` props `{profile, texts}` match T6.
- **Placeholders:** none — all code and content is concrete.
- **Build-order note:** deleting Hero/AboutBio/Work (T3/T4) breaks compilation until page.tsx is rewired (T6); commit only after T6, as noted.
