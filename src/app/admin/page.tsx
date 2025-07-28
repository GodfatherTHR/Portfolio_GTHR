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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import EducationCard from "@/components/admin/education-card";
import BlogPostsCard from "@/components/admin/blog-posts-card";
import AboutCard from "@/components/admin/about-card";

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const [
    ownerResult,
    projectsResult,
    experiencesResult,
    skillsResult,
    publicationsResult,
    awardsResult,
    contactInfoResult,
    researchProfilesResult,
    educationResult,
    blogPostsResult,
    aboutResult,
    tagsResult,
  ] = await Promise.all([
    supabase.from("portfolioowner").select().maybeSingle(),
    supabase.from("projects").select(),
    supabase.from("professionalexperience").select(),
    supabase.from("skills").select(),
    supabase.from("publications").select("*, publicationtags(*, tags(*))"),
    supabase.from("awards").select(),
    supabase.from("contactinfo").select().maybeSingle(),
    supabase.from("researchprofiles").select(),
    supabase.from("education").select(),
    supabase.from("blog_posts").select(),
    supabase.from("aboutcontent").select("*, aboutexpertise(*)").single(),
    supabase.from("tags").select("*"),
  ]);

  const results = [
    ownerResult, projectsResult, experiencesResult, skillsResult, 
    publicationsResult, awardsResult, contactInfoResult, 
    researchProfilesResult, educationResult, blogPostsResult, aboutResult,
    tagsResult,
  ];
  
  const anyError = results.find(result => result.error);

  if (anyError) {
     return (
       <div className="container mx-auto py-10">
         <Alert variant="destructive">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Fetching Admin Data</AlertTitle>
           <AlertDescription>
             <p>Could not fetch all necessary data for the admin panel. Please check the database connection and ensure all required tables exist and are accessible.</p>
             <pre className="mt-2 whitespace-pre-wrap rounded-md bg-destructive/10 p-4 text-xs font-mono">
               {anyError.error.message}
             </pre>
           </AlertDescription>
         </Alert>
       </div>
     );
  }
  
  const owner = ownerResult.data;
  const projects = projectsResult.data;
  const experiences = experiencesResult.data;
  const skills = skillsResult.data;
  const publications = publicationsResult.data;
  const awards = awardsResult.data;
  const contactInfo = contactInfoResult.data;
  const researchProfiles = researchProfilesResult.data;
  const education = educationResult.data;
  const blogPosts = blogPostsResult.data;
  const aboutContent = aboutResult.data;
  const allTags = tagsResult.data;

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
        <AboutCard aboutContent={aboutContent} />
        <ContactInfoCard contactInfo={contactInfo} />
        <ProjectsCard projects={projects || []} />
        <PublicationsCard publications={publications || []} allTags={allTags || []} />
        <ResearchProfilesCard researchProfiles={researchProfiles || []} />
        <ExperienceCard experiences={experiences || []} />
        <EducationCard education={education || []} />
        <AwardsCard awards={awards || []} />
        <BlogPostsCard blogPosts={blogPosts || []} />
        <SkillsCard skills={skills || []} />
      </div>
    </div>
  );
}

    