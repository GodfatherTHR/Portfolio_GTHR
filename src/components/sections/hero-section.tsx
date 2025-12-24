import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ArrowRightCircle, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function HeroSection() {
  const supabase = createClient();

  const { data: heroContent, error: heroError } = await supabase.from("herocontent").select().single();
  const { data: subtitles, error: subtitlesError } = await supabase.from("herosubtitles").select();
  const { data: ctas, error: ctasError } = await supabase.from("heroctas").select();

  const hasError = heroError || subtitlesError || ctasError;

  return (
    <section id="hero" className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
       <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-10 opacity-50"
      >
        <source src="https://res.cloudinary.com/dudwzh2xy/video/upload/v1717088931/0727_veybao.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30 z-20"></div>
      <div className="relative z-30 p-4">
        {hasError ? (
            <div className="container max-w-2xl">
              <Alert variant="destructive" className="bg-destructive/50 border-destructive text-destructive-foreground">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Hero Content Not Found</AlertTitle>
                <AlertDescription>
                  Could not fetch content for the 'Hero' section. Please ensure the 'herocontent', 'herosubtitles', and 'heroctas' tables have data and that Row Level Security (RLS) is configured to allow public read access.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              {heroContent?.title || "Shariful Haque"}
            </h1>
            {heroContent?.span && <p className="mt-2 text-xl md:text-2xl text-accent">{heroContent.span}</p>}
            <p className="mt-4 text-lg md:text-xl text-white">
              {(subtitles || []).map((s: any) => s.subtitle_text).join(' | ') || "Researcher | Data Analyst | Blockchain Innovator | Author | Educator"}
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white">
              {heroContent?.description || "Independent researcher and PMP® certified leader dedicated to advancing AI integration and blockchain patents within the FinTech and Healthcare sectors."}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              {ctas?.map((cta: any) => (
                <Button asChild size="lg" key={cta.id} variant={cta.text === 'Contact Me' ? 'inverted' : cta.icon ? 'secondary' : 'default'}>
                  <Link href={cta.link}>
                    {cta.text}
                    {cta.icon === 'arrow-right-circle' && <ArrowRightCircle className="ml-2" />}
                  </Link>
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
