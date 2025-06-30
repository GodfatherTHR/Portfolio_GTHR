import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileText, Lightbulb, BarChart2, Tv, Code, School, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const iconMap: { [key: string]: React.ReactNode } = {
  "patent-icon": <FileText className="h-8 w-8 text-primary" />,
  "innovation-icon": <Lightbulb className="h-8 w-8 text-primary" />,
  "data-analytics-icon": <BarChart2 className="h-8 w-8 text-primary" />,
  "content-icon": <Tv className="h-8 w-8 text-primary" />,
  "software-icon": <Code className="h-8 w-8 text-primary" />,
  "default": <Code className="h-8 w-8 text-primary" />
};

const projectImageMap: { [key: string]: string } = {
  'proj1': 'https://images.unsplash.com/photo-1743336751210-5205213290ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxJbnRlbGxpZ2VudCUyMEJsb2NrY2hhaW4lMjBFUlAlMjBNb2R1bGV8ZW58MHx8fHwxNzUxMTc4ODQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'proj2': 'https://images.unsplash.com/photo-1716436329836-208bea5a55e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxuOG4lMjBhdXRvbWF0aW9ufGVufDB8fHx8MTc1MTI4NDMyNXww&ixlib=rb-4.1.0&q=80&w=1080',
  'proj3': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8RW50ZXJwcmlzZSUyMERhdGElMjBBbmFseXRpY3MlMjBEYXNoYm9hcmR8ZW58MHx8fHwxNzUxMjg0MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'proj4': 'https://images.unsplash.com/photo-1647529734891-b1d1d2b93bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8c3Rvcnl0ZWxsaW5nJTIwbWFzdGVyY2xhc3N8ZW58MHx8fHwxNzUxMzEwNTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'proj5': 'https://images.unsplash.com/photo-1621930032188-2e4f2b8959c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8UmVzZWFyY2glMjBEYXRhJTIwTWFuYWdlbWVudCUyMFN5c3RlbXxlbnwwfHx8fDE3NTEzMTAzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'proj6': 'https://images.unsplash.com/photo-1718806748183-edb0c438a006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8QmxvY2tjaGFpbiUyMGZvciUyMEFjYWRlbWljJTIwQ3JlZGVudGlhbHN8ZW58MHx8fHwxNzUxMzEwMzk0fDA&ixlib=rb-4.1.0&q=80&w=1080'
};

export default async function ProjectsSection() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, projecttags(*, tags(*))")
    .order("id");

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
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">My Projects</h2>
          <p className="text-lg text-muted-foreground mt-2">A selection of my work. See what I've been building.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => {
            const imageSrc = projectImageMap[project.json_id] ||
              (project.image_src && (project.image_src.startsWith('http') || project.image_src.startsWith('/'))
              ? project.image_src
              : "https://placehold.co/600x400.png");

            return (
              <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="p-0 relative">
                  <Image
                    src={imageSrc}
                    alt={project.alt_text || project.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint="software project"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-full backdrop-blur-sm">
                    {iconMap[project.icon] || iconMap.default}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <CardTitle className="text-xl font-bold mb-2">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.projecttags?.map((pt: any) => <Badge key={pt.tag_id} variant="outline">{pt.tags.name}</Badge>)}
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-muted/50">
                  {project.button_link && (
                    <Button variant="default" asChild className="w-full">
                      <Link href={project.button_link} target="_blank" rel="noopener noreferrer">
                        {project.button_text}
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
