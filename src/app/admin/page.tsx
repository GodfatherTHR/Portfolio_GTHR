import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

import OwnerCard from "@/components/admin/owner-card";
import ProjectsCard from "@/components/admin/projects-card";
import PublicationsCard from "@/components/admin/publications-card";
import ExperienceCard from "@/components/admin/experience-card";
import AwardsCard from "@/components/admin/awards-card";
import SkillsCard from "@/components/admin/skills-card";
import ContactInfoCard from "@/components/admin/contact-info-card";
import ResearchProfilesCard from "@/components/admin/research-profiles-card";

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: owner } = await supabase.from("portfolioowner").select().single();
  const { data: projects } = await supabase.from("projects").select();
  const { data: experiences } = await supabase.from("professionalexperience").select();
  const { data: skills } = await supabase.from("skills").select();
  const { data: publications } = await supabase.from("publications").select();
  const { data: awards } = await supabase.from("awards").select();
  const { data: contactInfo } = await supabase.from("contactinfo").select().single();
  const { data: researchProfiles } = await supabase.from("researchprofiles").select();


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Welcome back, {user.email}</p>
        </div>
        <form action="/auth/signout" method="post" className="w-full md:w-auto">
          <Button type="submit" variant="destructive" className="w-full md:w-auto">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="grid gap-10">
        <OwnerCard owner={owner} />
        <ContactInfoCard contactInfo={contactInfo} />
        <ProjectsCard projects={projects || []} />
        <PublicationsCard publications={publications || []} />
        <ResearchProfilesCard researchProfiles={researchProfiles || []} />
        <ExperienceCard experiences={experiences || []} />
        <AwardsCard awards={awards || []} />
        <SkillsCard skills={skills || []} />
      </div>
    </div>
  );
}
