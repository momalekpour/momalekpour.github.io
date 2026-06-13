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
