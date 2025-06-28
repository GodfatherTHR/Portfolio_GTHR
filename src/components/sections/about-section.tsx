import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function AboutSection() {
  const supabase = createClient();
  const { data: aboutContent } = await supabase.from("AboutContent").select("*, AboutExpertise(*)").single();

  if (!aboutContent) return null;

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src={aboutContent.image_src || "https://placehold.co/600x700.png"}
              alt={aboutContent.image_alt || "About image"}
              width={600}
              height={700}
              className="rounded-lg shadow-lg object-cover"
              data-ai-hint="portrait professional"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">{aboutContent.title}</h2>
            <p className="text-lg text-muted-foreground">{aboutContent.description}</p>
            <h3 className="text-2xl font-bold russo-one-regular">{aboutContent.expertise_title}</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-muted-foreground">
              {aboutContent.AboutExpertise.map((item: any) => (
                <li key={item.id} className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{item.expertise_item}</span>
                </li>
              ))}
            </ul>
            {aboutContent.cta_link && (
                <Button asChild className="mt-8" size="lg">
                    <Link href={aboutContent.cta_link}>
                        {aboutContent.cta_text}
                        {aboutContent.cta_icon === 'arrow-right' && <ArrowRight className="ml-2" />}
                    </Link>
                </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
