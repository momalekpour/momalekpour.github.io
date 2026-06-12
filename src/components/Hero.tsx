import type { SiteContent, SocialLink } from "@/lib/types";

export default function Hero({
  profile,
  social,
}: {
  profile: SiteContent["profile"];
  social: SocialLink[];
}) {
  return (
    <header className="hero" id="top">
      {profile.eyebrow && <p className="hero__eyebrow">{profile.eyebrow}</p>}
      <h1 className="hero__name">{profile.name}</h1>
      {profile.tagline && <p className="hero__tagline">{profile.tagline}</p>}
      <div className="hero__links">
        {social.map((link) => (
          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
        ))}
      </div>
    </header>
  );
}
