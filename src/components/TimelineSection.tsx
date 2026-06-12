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
          <article className="timeline-item" key={`${e.title}-${e.org}`}>
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
