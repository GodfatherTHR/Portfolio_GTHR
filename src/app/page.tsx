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
  const { data: subtitles } = await supabase.from("herosubtitles").select("subtitle_text");

  const title = heroContent?.title || 'Shariful Haque';
  const subtitleText = (subtitles || []).map((s: any) => s.subtitle_text).join(' | ');
  const mainDescription = heroContent?.description || "I'm a DBA student and data analytics expert pioneering blockchain and AI solutions for ERP systems and beyond.";
  
  const description = `${subtitleText}. ${mainDescription}`;

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
