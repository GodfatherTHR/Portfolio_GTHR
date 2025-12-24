
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, Download, Terminal } from 'lucide-react';
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Squares from "../animation/Squares";

export default async function ResumeSection() {
    const supabase = createClient();

    const { data: resume, error } = await supabase.from('resume').select('*, professionalexperience(*, experienceresponsibilities(*)), education(*), skills(*)').single();

    if (error || !resume) {
        return (
            <section id="resume" className="py-16 md:py-24 relative bg-black">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='down'
                    borderColor='#fff'
                    hoverFillColor='#222'
                />
                <div className="container relative z-10">
                   <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Resume Content Not Found</AlertTitle>
                    <AlertDescription>
                      Could not fetch content for the 'Resume' section. Please ensure your 'resume' table has data and that Row Level Security (RLS) is configured to allow public read access.
                    </AlertDescription>
                  </Alert>
                </div>
            </section>
        );
    }

    const experiences = resume.professionalexperience || [];
    const educations = resume.education || [];
    const skills = resume.skills || [];

    const groupedSkills: { [key: string]: any[] } = skills.reduce((acc: any, skill: any) => {
        const key = skill.skill_type;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(skill);
        return acc;
    }, {});


    return (
        <section id="resume" className="py-16 md:py-24 relative bg-black">
             <Squares 
                speed={0.5} 
                squareSize={40}
                direction='down'
                borderColor='#fff'
                hoverFillColor='#222'
              />
            <div className="container relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">{resume.title}</h2>
                    <p className="text-lg text-white mt-2 max-w-2xl mx-auto">{resume.intro}</p>
                     {resume.cv_download_link && (
                        <Button asChild className="mt-4">
                            <Link href="https://mmdqxosbtlgfvfyizfbh.supabase.co/storage/v1/object/public/sh-storage/SH%20Resume.pdf" target="_blank">
                                <Download className="mr-2 h-4 w-4"/>
                                {resume.cv_download_text}
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white"><Briefcase /> Professional Experience</h3>
                        <div className="space-y-8 relative pl-6 before:absolute before:inset-y-0 before:w-0.5 before:bg-border before:left-0">
                            {experiences.map((exp: any) => (
                                <Card key={exp.id} className="relative flex flex-col bg-primary text-primary-foreground">
                                    <div className="absolute -left-[37px] top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full border-4 border-secondary">
                                      <Briefcase className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                    <CardHeader>
                                        <CardTitle>{exp.title}</CardTitle>
                                        <CardDescription className="text-primary-foreground/80">{exp.company} | {exp.dates}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-primary-foreground/80 mb-4">{exp.description || ''}</p>
                                        <ul className="list-disc list-inside space-y-1 text-primary-foreground/80">
                                            {exp.experienceresponsibilities.map((resp: any) => (
                                                <li key={resp.id}>{resp.responsibility}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white"><GraduationCap /> Education</h3>
                        <div className="space-y-8 relative pl-6 before:absolute before:inset-y-0 before:w-0.5 before:bg-border before:left-0">
                             {educations.map((edu: any) => (
                                <Card key={edu.id} className="relative flex flex-col bg-primary text-primary-foreground">
                                     <div className="absolute -left-[37px] top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full border-4 border-secondary">
                                      <GraduationCap className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                    <CardHeader>
                                        <CardTitle>{edu.degree}</CardTitle>
                                        <CardDescription className="text-primary-foreground/80">{edu.institution} | {edu.dates}</CardDescription>
                                    </CardHeader>
                                    {edu.notes && (
                                      <CardContent className="flex-grow">
                                        <p className="text-sm text-primary-foreground/80">{edu.notes}</p>
                                      </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                     <h3 className="text-2xl font-bold mb-8 text-center text-white">Skills</h3>
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Object.entries(groupedSkills).map(([type, skillList]) => (
                            <Card key={type} className="bg-primary">
                                <CardHeader>
                                    <CardTitle className="capitalize text-xl text-primary-foreground">{type.replace(/_/g, ' ')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {(skillList as any[]).map((skill: any) => (
                                            <Badge key={skill.id} variant="inverted">{skill.skill_name}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                     </div>
                </div>
            </div>
        </section>
    )
}
