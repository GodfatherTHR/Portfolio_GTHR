import Header from "@/components/header";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import ResearchSection from "@/components/sections/research-section";
import ProjectsSection from "@/components/sections/projects-section";
import AwardsSection from "@/components/sections/awards-section";
import ResumeSection from "@/components/sections/resume-section";
import ContactSection from "@/components/sections/contact-section";
import ResearchProfilesSection from "@/components/sections/research-profiles-section";
import Footer from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: heroContent } = await supabase.from("herocontent").select("title, description").single();

  const title = heroContent?.title || 'Shariful Haque | Portfolio';
  const description = heroContent?.description || 'Personal portfolio of Shariful Haque, a passionate developer.';

  return {
    title,
    description,
  }
}

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
      <Footer />
    </div>
  );
}
