import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ArrowRightCircle } from "lucide-react";
import HeroAnimation from "@/components/animation/hero-animation";

export default async function HeroSection() {
  const supabase = createClient();

  const { data: heroContent } = await supabase.from("herocontent").select().single();
  const { data: subtitles } = await supabase.from("herosubtitles").select();
  const { data: ctas } = await supabase.from("heroctas").select();

  return (
    <section id="hero" className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
      <HeroAnimation />
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold russo-one-regular tracking-tight">
          {heroContent?.title || "Shariful Haque"}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200">
          {subtitles?.map((s: any) => s.subtitle_text).join(' | ') || "Data Analytics | Blockchain Innovator | Researcher"}
        </p>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
          {heroContent?.description || "I'm a DBA student and data analytics expert pioneering blockchain and AI solutions for ERP systems and beyond."}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {ctas?.map((cta: any) => (
            <Button asChild size="lg" key={cta.id} variant={cta.icon ? 'secondary' : 'default'}>
              <Link href={cta.link}>
                {cta.text}
                {cta.icon === 'arrow-right-circle' && <ArrowRightCircle className="ml-2" />}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
