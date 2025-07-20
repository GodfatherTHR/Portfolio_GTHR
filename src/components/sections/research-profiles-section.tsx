import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ResearchGateIcon from "../icons/researchgate-icon";
import GoogleScholarIcon from "../icons/googlescholar-icon";
import OrcidIcon from "../icons/orcid-icon";

const iconMap: { [key: string]: React.ReactNode } = {
  'researchgate': <ResearchGateIcon className="h-5 w-5" />,
  'googlescholar': <GoogleScholarIcon className="h-5 w-5" />,
  'orcid': <OrcidIcon className="h-5 w-5" />,
};

export default async function ResearchProfilesSection() {
  const supabase = createClient();
  const { data: profiles, error } = await supabase
    .from("researchprofiles")
    .select("*")
    .order("id");

  if (error || !profiles || profiles.length === 0) {
    return null;
  }

  return (
    <section id="research-profiles" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-6">
          <p className="text-lg text-muted-foreground">For my complete research profile, please visit:</p>
        </div>
        <div className="flex justify-center items-center flex-wrap gap-4">
          {profiles.map((profile: any) => (
            <Button
              key={profile.id}
              asChild
              variant="secondary"
              className="shadow-lg"
              style={{
                backgroundColor: profile.bg_color || undefined,
                color: profile.text_color || undefined
              }}
            >
              <Link href={profile.link || '#'} target="_blank" rel="noopener noreferrer">
                {iconMap[profile.icon] && (
                  <span className="mr-2">
                    {iconMap[profile.icon]}
                  </span>
                )}
                {profile.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
