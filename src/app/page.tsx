import Header from "@/components/header";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import ResearchSection from "@/components/sections/research-section";
import ProjectsSection from "@/components/sections/projects-section";
import AwardsSection from "@/components/sections/awards-section";
import ResumeSection from "@/components/sections/resume-section";
import ContactSection from "@/components/sections/contact-section";
import ResearchProfilesSection from "@/components/sections/research-profiles-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ResearchSection />
        <ResearchProfilesSection />
        <ProjectsSection />
        <AwardsSection />
        <ResumeSection />
        <ContactSection />
      </main>
    </div>
  );
}
