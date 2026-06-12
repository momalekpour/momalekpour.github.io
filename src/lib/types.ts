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
