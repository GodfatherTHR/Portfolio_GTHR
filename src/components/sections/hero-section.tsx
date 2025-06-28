import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type Profile = {
  full_name: string;
  headline: string;
};

export default async function HeroSection() {
  const supabase = createClient();
  const { data } = await supabase
    .from("profile")
    .select("full_name, headline")
    .single();

  const profile: Profile = data || {
    full_name: "Your Name",
    headline: "Your Professional Headline",
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden bg-gray-900">
      <div className="relative z-10 p-4 bg-black bg-opacity-30 rounded-lg backdrop-blur-sm">
        <h1 className="text-4xl md:text-6xl font-extrabold russo-one-regular tracking-tight">
          {profile.full_name}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
          {profile.headline}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#projects">View My Work</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#contact">Get In Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
