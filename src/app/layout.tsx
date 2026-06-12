import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://malekpour.io"),
  title: "Mo Malekpour | AI Software Engineer & Researcher",
  description:
    "Mo Malekpour - MSc researcher at Polytechnique Montreal & Mila specializing in AI for Data Systems, Text-to-SQL, and Database Systems. Graduate Research Assistant at DAIS Lab working on innovative AI solutions for data management.",
  keywords: [
    "Mo Malekpour",
    "AI Software Engineer",
    "Data Systems",
    "Text-to-SQL",
    "Database Systems",
    "MSc Researcher",
    "Polytechnique Montreal",
    "Mila Quebec AI Institute",
    "DAIS Lab",
    "Data Management",
    "Information Retrieval",
    "Database Internals",
    "AI-powered Software Engineering",
  ],
  authors: [{ name: "Mo Malekpour" }],
  alternates: { canonical: "https://malekpour.io" },
  openGraph: {
    title: "Mo Malekpour - AI Software Engineer & Researcher",
    description:
      "MSc researcher at Polytechnique Montreal & Mila, specializing in AI for Data Systems, Text-to-SQL, and Database Systems. Enhancing data management through innovative AI solutions.",
    url: "https://malekpour.io",
    type: "website",
    images: ["https://pallasengine.com/static/images/profile.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@momalekpour",
    title: "Mo Malekpour - AI Software Engineer & Researcher",
    description:
      "MSc researcher specializing in AI for Data Systems, Text-to-SQL, and Database Systems at Polytechnique Montreal & Mila.",
    images: ["https://pallasengine.com/static/images/profile.jpg"],
  },
  icons: {
    icon: [
      { url: "/assets/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/assets/favicon_io/apple-touch-icon.png",
    shortcut: "/assets/favicon_io/favicon.ico",
  },
  manifest: "/assets/favicon_io/site.webmanifest",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mo Malekpour",
  jobTitle: "AI Software Engineer and Researcher",
  description: "MSc researcher focusing on AI for Data Systems, Text-to-SQL, and Database Systems",
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Polytechnique Montreal",
  },
  affiliation: [
    { "@type": "Organization", name: "Mila - Quebec AI Institute" },
    { "@type": "Organization", name: "Data & AI Systems Lab (DAIS)" },
  ],
  url: "https://malekpour.io",
  image: "https://pallasengine.com/static/images/profile.jpg",
  sameAs: [
    "https://github.com/momalekpour",
    "https://www.linkedin.com/in/momalekpour/",
    "https://x.com/momalekpour",
    "https://twitter.com/momalekpour",
    "https://momalekpour.medium.com",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Data Systems",
    "Text-to-SQL",
    "Database Systems",
    "Data Management",
    "Information Retrieval",
    "AI-powered Software Engineering",
  ],
};

const itemListJsonLd = {
  "@context": "http://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ScholarlyArticle",
      name: "SQLMorph: Query Mutation for Robust Text-to-SQL Evaluation",
      author: { "@type": "Person", name: "Mo Malekpour" },
      datePublished: "2026",
      publisher: "ICDE",
    },
    {
      "@type": "ScholarlyArticle",
      name: "Towards Optimizing SQL Generation via LLM Routing",
      author: { "@type": "Person", name: "Mo Malekpour" },
      datePublished: "2024",
      publisher: "TRL @ NeurIPS",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={quicksand.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      </head>
      <body>
        <div className="scanlines"></div>
        <div className="crt-overlay"></div>
        <SiteNav />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-ZBC862D3S5" />
    </html>
  );
}
