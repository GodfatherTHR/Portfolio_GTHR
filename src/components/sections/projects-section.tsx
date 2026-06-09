import { createClient } from "@/lib/supabase/server";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProjectsSectionClient from "./projects-section-client";


export default async function ProjectsSection() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, projecttags(*, tags(*))")
    .order("serial");

  if (error || !projects || projects.length === 0) {
    return (
       <section id="projects" className="py-16 md:py-24">
        <div className="container">
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Projects Content Not Found</AlertTitle>
            <AlertDescription>
               Could not fetch content for the 'Projects' section. Please ensure your 'projects' table has data and that Row Level Security (RLS) is configured to allow public read access.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Projects & Patents</h2>
          <p className="text-lg text-muted-foreground mt-2">A selection of my work. See what I've been building.</p>
        </div>
        <ProjectsSectionClient projects={projects} />
      </div>
    </section>
  );
}

    