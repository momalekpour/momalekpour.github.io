import { getContent } from "@/lib/content";
import Hero from "@/components/Hero";
import AboutBio from "@/components/AboutBio";
import Work from "@/components/Work";
import Contact from "@/components/Contact";

export default function Home() {
  const content = getContent();

  return (
    <main className="site-main crt">
      <Hero profile={content.profile} social={content.contact.social} />
      <AboutBio texts={content.aboutMe.texts} />
      <Work publications={content.publications} />
      <Contact social={content.contact.social} />
    </main>
  );
}
