import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import HeroAnimation from "./hero-animation";

type Profile = {
  full_name: string;
  headline: string;
};

export default async function HeroSection() {
  const supabase = createClient();
  // Assuming you have a 'profile' table with a single row for your portfolio data
  const { data, error } = await supabase
    .from("profile")
    .select("full_name, headline")
    .single();

  const profile: Profile = data || {
    full_name: "Shariful Haque",
    headline: "Full-Stack Developer | Building innovative solutions with modern technology",
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
      <HeroAnimation />
      <div className="relative z-10 p-4 bg-black bg-opacity-30 rounded-lg backdrop-blur-sm">
        <h1 className="text-4xl md:text-6xl font-extrabold russo-one-regular tracking-tight">
          {profile.full_name}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
          {profile.headline}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="#projects">View My Work</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="bg-secondary/80 hover:bg-secondary/90 text-secondary-foreground">
            <Link href="#contact">Get In Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
