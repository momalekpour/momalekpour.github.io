"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { id: "top", label: "about" },
  { id: "education", label: "education" },
  { id: "experience", label: "experience" },
  { id: "papers", label: "papers" },
  { id: "projects", label: "projects" },
];

export default function SiteNav() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Pick the first section (in document order) currently in the band.
        const current = LINKS.find((l) => visible.has(l.id));
        if (current) setActive(current.id);
      },
      // Activate a section once it reaches just below the sticky nav.
      { rootMargin: "-25% 0px -65% 0px" },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="site-nav">
      <div className="site-nav__links">
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={l.id === "top" ? "#top" : `#${l.id}`}
            className={active === l.id ? "active" : undefined}
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
