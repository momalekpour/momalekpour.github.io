import type { SocialLink } from "@/lib/types";

export default function Contact({ social }: { social: SocialLink[] }) {
  return (
    <section className="contact-section" id="contact">
      <h2 className="section-label">Get in Touch</h2>
      <div className="social-links">
        {social.map((link) => (
          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
        ))}
      </div>
    </section>
  );
}
