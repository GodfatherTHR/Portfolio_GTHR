import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Linkedin } from "lucide-react";
import ResearchGateIcon from "./icons/researchgate-icon";
import GoogleScholarIcon from "./icons/googlescholar-icon";
import OrcidIcon from "./icons/orcid-icon";

const iconMap: { [key: string]: React.ReactNode } = {
  'linkedin': <Linkedin className="h-6 w-6" />,
  'researchgate': <ResearchGateIcon className="h-6 w-6" />,
  'googlescholar': <GoogleScholarIcon className="h-6 w-6" />,
  'orcid': <OrcidIcon className="h-6 w-6" />,
};

export default async function Footer() {
  const supabase = createClient();
  const { data: owner } = await supabase.from("portfolioowner").select("name, linkedin_url").single();
  const { data: profiles } = await supabase.from("researchprofiles").select("name, icon, link");

  const socialLinks = [];
  if (owner?.linkedin_url) {
    socialLinks.push({ name: 'LinkedIn', icon: 'linkedin', link: owner.linkedin_url });
  }

  const allLinks = [...socialLinks, ...(profiles || [])];

  return (
    <footer className="bg-secondary text-primary-foreground py-6">
      <div className="container flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="text-sm text-primary-foreground/80 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} {owner?.name || 'Shariful Haque'}. All Rights Reserved.
        </div>
        <div className="flex items-center space-x-4">
          {allLinks.map(profile => (
            <Link key={profile.name} href={profile.link || '#'} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              {iconMap[profile.icon] || <span className="text-sm">{profile.name}</span>}
              <span className="sr-only">{profile.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
