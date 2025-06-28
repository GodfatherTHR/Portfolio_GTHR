import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import ResearchSection from "@/components/sections/research-section";
import ProjectsSection from "@/components/sections/projects-section";
import AwardsSection from "@/components/sections/awards-section";
import ResumeSection from "@/components/sections/resume-section";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ResearchSection />
        <ProjectsSection />
        <AwardsSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
