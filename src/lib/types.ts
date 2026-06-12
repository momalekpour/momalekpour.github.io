// Shape of content/content.yaml — the single source of truth for site content.

export interface Link {
  name: string;
  url: string;
}

// Named aliases kept for clarity at usage sites.
export type SocialLink = Link;
export type PublicationLink = Link;

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
