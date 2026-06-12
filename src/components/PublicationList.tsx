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
