
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
import BlogSection from "@/components/sections/blog-section";
import BooksSection from "@/components/sections/books-section";
import NewsSection from "@/components/sections/news-section";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: heroContent } = await supabase.from("herocontent").select("title, description").single();
  const { data: subtitles } = await supabase.from("herosubtitles").select("subtitle_text");

  const subtitleText = (subtitles || []).map((s: any) => s.subtitle_text).join(', ');
  const mainDescription =
    heroContent?.description ||
    "I'm a researcher and data analyst specializing in AI, business analytics, blockchain, and ERP systems.";

  const description = `${mainDescription} ${subtitleText ? `Roles: ${subtitleText}.` : ''} Explore publications, books, and research.`;

  return buildPageMetadata({
    title: "Shariful Haque — Researcher, Data Analyst & Technology Strategist",
    description: description.slice(0, 160),
    path: "/",
    type: 'website',
  });
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ResumeSection />
        <ResearchSection />
        <ResearchProfilesSection />
        <ProjectsSection />
        <AwardsSection />
        <NewsSection />
        <BooksSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
