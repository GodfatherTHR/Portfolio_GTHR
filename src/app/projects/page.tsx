import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { FileText, Lightbulb, BarChart2, Tv, Code } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo';
import { jsonLdGraph, personSchema, breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

const iconMap: { [key: string]: React.ReactNode } = {
  'patent-icon': <FileText className="h-8 w-8 text-primary" />,
  'innovation-icon': <Lightbulb className="h-8 w-8 text-primary" />,
  'data-analytics-icon': <BarChart2 className="h-8 w-8 text-primary" />,
  'content-icon': <Tv className="h-8 w-8 text-primary" />,
  'software-icon': <Code className="h-8 w-8 text-primary" />,
  default: <Code className="h-8 w-8 text-primary" />,
};

export const metadata = buildPageMetadata({
  title: 'Projects & Patents',
  description:
    'Explore the projects and patents of Shariful Haque — innovations in AI, data analytics, blockchain, and ERP systems.',
  path: '/projects',
  keywords: ['Shariful Haque projects', 'Shariful Haque patents', 'AI projects', 'blockchain patents', 'data analytics projects'],
});

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, projecttags(*, tags(*))')
    .order('serial');

  const jsonLds = [
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Projects & Patents', url: absoluteUrl('/projects') },
    ]),
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }} />
      <div className="container mx-auto py-12 md:py-20">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Projects & Patents</span>
        </div>

        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold">Projects & Patents</h1>
          <p className="text-lg text-muted-foreground mt-2">A selection of my work. See what I've been building.</p>
        </header>

        {error && (
          <p className="text-destructive mb-8">Unable to load projects at this time.</p>
        )}

        {!error && (!projects || projects.length === 0) ? (
          <p className="text-muted-foreground text-center">No projects are listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project: any) => {
              const imageSrc =
                project.image_src && (project.image_src.startsWith('http') || project.image_src.startsWith('/'))
                  ? project.image_src
                  : 'https://placehold.co/600x400.png';
              return (
                <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="p-0 relative">
                    <Image
                      src={imageSrc}
                      alt={project.alt_text || project.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-full backdrop-blur-sm">
                      {iconMap[project.icon] || iconMap.default}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-6">
                    <CardTitle className="text-xl font-bold mb-2">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.projecttags?.map((pt: any) => (
                        <Badge key={pt.tag_id} variant="outline">{pt.tags.name}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  {project.button_link && (
                    <CardFooter className="p-6 bg-muted/50">
                      <Button variant="default" asChild className="w-full">
                        <Link href={project.button_link} target="_blank" rel="noopener noreferrer">
                          {project.button_text}
                        </Link>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}