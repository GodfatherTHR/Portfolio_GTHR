import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url?: string;
  repo_url?: string;
  tags: string[];
};

export default async function ProjectsSection() {
  const supabase = createClient();
  // Fetch projects from Supabase.
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, description, image_url, project_url, repo_url, tags")
    .order("created_at", { ascending: false });

  // Placeholder data if Supabase fetch fails or returns no data
  const finalProjects: Project[] = projects && projects.length > 0 ? projects : [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce site with product management, shopping cart, and secure checkout, built with Next.js and Stripe.",
      image_url: "https://placehold.co/600x400.png",
      project_url: "#",
      repo_url: "#",
      tags: ["Next.js", "React", "Stripe", "PostgreSQL"],
    },
    {
      id: "2",
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop interface, and user authentication.",
      image_url: "https://placehold.co/600x400.png",
      project_url: "#",
      repo_url: "#",
      tags: ["React", "Firebase", "Tailwind CSS"],
    },
     {
      id: "3",
      title: "Portfolio Website",
      description: "A personal portfolio to showcase my skills and projects, featuring a modern design and dynamic content from a CMS.",
      image_url: "https://placehold.co/600x400.png",
      project_url: "#",
      repo_url: "#",
      tags: ["Next.js", "TypeScript", "Supabase", "Three.js"],
    },
  ];

  return (
    <section id="projects" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">My Projects</h2>
          <p className="text-lg text-muted-foreground mt-2">A selection of my work. See what I've been building.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalProjects.map((project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                  data-ai-hint="software project"
                />
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="text-xl font-bold mb-2">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-muted/50 flex justify-end gap-2">
                {project.repo_url && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={project.repo_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub Repository</span>
                    </Link>
                  </Button>
                )}
                {project.project_url && (
                  <Button variant="outline" asChild>
                    <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                      Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
