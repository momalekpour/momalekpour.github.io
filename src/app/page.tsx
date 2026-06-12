import { getContent } from "@/lib/content";
import Landing from "@/components/Landing";
import PublicationList from "@/components/PublicationList";
import TimelineSection from "@/components/TimelineSection";
import SocialLinks from "@/components/SocialLinks";

export default function Home() {
  const content = getContent();

  return (
    <>
      <main className="site-main crt">
        <Landing profile={content.profile} texts={content.aboutMe.texts} />
        <TimelineSection heading="Education" id="education" entries={content.education} />
        <TimelineSection heading="Experience" id="experience" entries={content.experience} />
        <PublicationList
          heading="Publications & Projects"
          id="publications"
          items={[...content.publications, ...content.projects]}
        />
      </main>
      <div className="social-dock">
        <SocialLinks links={content.contact.social} />
      </div>
    </>
  );
}
