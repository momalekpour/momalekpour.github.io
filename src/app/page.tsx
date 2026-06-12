import { getContent } from "@/lib/content";
import Landing from "@/components/Landing";
import PublicationList from "@/components/PublicationList";
import TimelineSection from "@/components/TimelineSection";
import Contact from "@/components/Contact";

export default function Home() {
  const content = getContent();

  return (
    <main className="site-main crt">
      <Landing profile={content.profile} texts={content.aboutMe.texts} />
      <PublicationList heading="Papers" id="papers" items={content.publications} />
      <PublicationList heading="Projects" id="projects" items={content.projects} />
      <TimelineSection heading="Experience" id="experience" entries={content.experience} />
      <TimelineSection heading="Education" id="education" entries={content.education} />
      <Contact social={content.contact.social} />
    </main>
  );
}
