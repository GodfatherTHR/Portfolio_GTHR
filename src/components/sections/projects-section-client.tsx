
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileText, Lightbulb, BarChart2, Tv, Code, School, Terminal } from "lucide-react";

const iconMap: { [key: string]: React.ReactNode } = {
  "patent-icon": <FileText className="h-8 w-8 text-primary" />,
  "innovation-icon": <Lightbulb className="h-8 w-8 text-primary" />,
  "data-analytics-icon": <BarChart2 className="h-8 w-8 text-primary" />,
  "content-icon": <Tv className="h-8 w-8 text-primary" />,
  "software-icon": <Code className="h-8 w-8 text-primary" />,
  "default": <Code className="h-8 w-8 text-primary" />
};

export default function ProjectsSectionClient({ projects }: { projects: any[] }) {
    const [showAll, setShowAll] = useState(false);
    const initialCount = 6;
    const displayedProjects = showAll ? projects : projects.slice(0, initialCount);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProjects.map((project: any) => {
                const imageSrc = (project.image_src && (project.image_src.startsWith('http') || project.image_src.startsWith('/')))
                  ? project.image_src
                  : "https://placehold.co/600x400.png";

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
            {projects.length > initialCount && !showAll && (
                <div className="text-center mt-12">
                    <Button onClick={() => setShowAll(true)} size="lg">See More</Button>
                </div>
            )}
        </>
    );
}
