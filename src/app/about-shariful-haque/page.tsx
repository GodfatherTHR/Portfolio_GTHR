import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, ArrowLeft, ArrowRight, ExternalLink, BookOpen, Award, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { siteConfig } from '@/lib/site';
import { buildPageMetadata } from '@/lib/seo';
import { jsonLdGraph, profilePageSchema, personSchema, breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl, absoluteImage } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'About Shariful Haque',
  description:
    'Learn about Shariful Haque — researcher, data analyst, and technology strategist specializing in AI, business analytics, blockchain, and ERP systems. Biography, experience, education, research, and publications.',
  path: '/about-shariful-haque',
  type: 'profile',
  keywords: ['Shariful Haque about', 'Shariful Haque biography', 'Shariful Haque researcher', 'Shariful Haque career', 'Shariful Haque publications'],
});

export default async function AboutPage() {
  const supabase = createClient();

  const [aboutResult, resumeResult, publicationsResult, awardsResult] = await Promise.all([
    supabase.from('aboutcontent').select('*, aboutexpertise(*)').single(),
    supabase.from('resume').select('*, professionalexperience(*, experienceresponsibilities(*)), education(*), skills(*)').single(),
    supabase.from('publications').select('*, publicationtags(*, tags(*))').order('year', { ascending: false }).limit(6),
    supabase.from('awards').select('*').order('year', { ascending: false }),
  ]);

  const about = aboutResult.data;
  const resume = resumeResult.data;
  const publications = publicationsResult.data || [];
  const awards = awardsResult.data || [];

  if (!about && !resume) {
    notFound();
  }

  const imageSrc =
    about?.image_src && (about.image_src.startsWith('http') || about.image_src.startsWith('/'))
      ? about.image_src
      : null;

  const experiences = resume?.professionalexperience || [];
  const educations = resume?.education || [];
  const skills = resume?.skills || [];

  const jsonLds = [
    personSchema(),
    profilePageSchema(),
    breadcrumbSchema([
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'About Shariful Haque', url: absoluteUrl('/about-shariful-haque') },
    ]),
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }}
      />
      <div className="container mx-auto max-w-5xl py-12 md:py-20">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">About Shariful Haque</span>
        </div>

        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About {siteConfig.name}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {about?.description || siteConfig.description}
          </p>
        </header>

        {about && (
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {imageSrc && (
                <div className="relative w-full max-w-md mx-auto">
                  <Image
                    src={imageSrc}
                    alt={about.image_alt || `Portrait of ${siteConfig.name}`}
                    width={600}
                    height={700}
                    className="rounded-lg shadow-lg object-cover"
                  />
                </div>
              )}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">{about.title}</h2>
                {about.description.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-lg text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {(resume?.professionalexperience?.length > 0) && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" /> Professional Experience
            </h2>
            <div className="space-y-8">
              {experiences.map((exp: any) => (
                <div key={exp.id} className="border-l-2 border-primary pl-6">
                  <h3 className="text-xl font-bold">{exp.title}</h3>
                  <p className="text-muted-foreground mb-2">{exp.company} | {exp.dates}</p>
                  {exp.description && <p className="text-muted-foreground mb-4">{exp.description}</p>}
                  {exp.experienceresponsibilities?.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {exp.experienceresponsibilities.map((resp: any) => (
                        <li key={resp.id}>{resp.responsibility}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(resume?.education?.length > 0) && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" /> Education
            </h2>
            <div className="space-y-8">
              {educations.map((edu: any) => (
                <div key={edu.id} className="border-l-2 border-primary pl-6">
                  <h3 className="text-xl font-bold">{edu.degree}</h3>
                  <p className="text-muted-foreground mb-2">{edu.institution} | {edu.dates}</p>
                  {edu.notes && <p className="text-muted-foreground">{edu.notes}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {publications.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Selected Publications</h2>
            <ul className="space-y-4">
              {publications.map((pub: any) => (
                <li key={pub.id} className="border rounded-lg p-5 bg-card">
                  <h3 className="text-lg font-semibold">{pub.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {pub.venue}, {pub.year}
                    {pub.type ? ` · ${pub.type}` : ''}
                    {pub.citation_count > 0 ? ` · Cited ${pub.citation_count} times` : ''}
                  </p>
                  {pub.description && <p className="text-sm text-muted-foreground">{pub.description}</p>}
                  {pub.link && (
                    <Link
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:underline"
                    >
                      View publication <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild variant="secondary">
                <Link href="/research">
                  All Research & Publications <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        )}

        {awards.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" /> Awards & Recognitions
            </h2>
            <ul className="space-y-4">
              {awards.map((award: any) => (
                <li key={award.id} className="border rounded-lg p-5 bg-card">
                  <h3 className="text-lg font-semibold">{award.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {award.organization} · {award.year}
                  </p>
                  {award.description && <p className="text-sm text-muted-foreground">{award.description}</p>}
                  {award.url && (
                    <Link
                      href={award.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:underline"
                    >
                      Learn more <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {Object.entries(
          skills.reduce((acc: Record<string, any[]>, skill: any) => {
            const key = skill.skill_type;
            (acc[key] = acc[key] || []).push(skill);
            return acc;
          }, {})
        ).length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Skills</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(
                skills.reduce((acc: Record<string, any[]>, skill: any) => {
                  const key = skill.skill_type;
                  (acc[key] = acc[key] || []).push(skill);
                  return acc;
                }, {})
              ).map(([type, skillList]) => (
                <div key={type} className="border rounded-lg p-5 bg-card">
                  <h3 className="font-bold capitalize mb-3">{type.replace(/_/g, ' ')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(skillList as any[]).map((skill: any) => (
                      <Badge key={skill.id} variant="secondary">{skill.skill_name}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">More About {siteConfig.name}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/research" className="group border rounded-lg p-5 bg-card hover:border-primary transition-colors">
              <div className="flex items-center gap-2 font-bold mb-2">
                <FileText className="h-5 w-5 text-primary" /> Research & Publications
              </div>
              <p className="text-sm text-muted-foreground">Explore papers, citations, and research interests.</p>
            </Link>
            <Link href="/book" className="group border rounded-lg p-5 bg-card hover:border-primary transition-colors">
              <div className="flex items-center gap-2 font-bold mb-2">
                <BookOpen className="h-5 w-5 text-primary" /> Books
              </div>
              <p className="text-sm text-muted-foreground">Books authored and recommended reading.</p>
            </Link>
            <Link href="/media" className="group border rounded-lg p-5 bg-card hover:border-primary transition-colors">
              <div className="flex items-center gap-2 font-bold mb-2">
                <ExternalLink className="h-5 w-5 text-primary" /> Media & Press
              </div>
              <p className="text-sm text-muted-foreground">News coverage, interviews, and media mentions.</p>
            </Link>
            <Link href="/blog" className="group border rounded-lg p-5 bg-card hover:border-primary transition-colors">
              <div className="flex items-center gap-2 font-bold mb-2">
                <FileText className="h-5 w-5 text-primary" /> Blog
              </div>
              <p className="text-sm text-muted-foreground">Articles and insights on data analytics and technology.</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
