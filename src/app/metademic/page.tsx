import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  FlaskConical,
  Gauge,
  Network,
  Share2,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildPageMetadata } from '@/lib/seo';
import { jsonLdGraph, personSchema, breadcrumbSchema, metademicOrganizationSchema, metademicWebPageSchema } from '@/lib/schema';
import { absoluteUrl, metademicConfig } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Metademic Lab — AI Research Founded by Shariful Haque',
  description:
    'Metademic Lab, founded by Shariful Haque, is an independent research laboratory exploring AI, distributed computing, autonomous systems, and trustworthy technology.',
  path: '/metademic',
  keywords: [
    'Metademic',
    'Metademic Lab',
    'Metademic founder',
    'Shariful Haque Metademic',
    'AI research laboratory',
    'artificial intelligence research',
    'distributed computing',
    'autonomous systems',
    'trustworthy AI',
    'reproducible research',
  ],
});

const researchAreas = [
  {
    title: 'Artificial intelligence',
    description: 'Learning, reasoning, and evaluation methods for developing capable AI models and practical applications.',
    icon: BrainCircuit,
  },
  {
    title: 'Distributed computing',
    description: 'Methods and architectures for coordinating computation across heterogeneous devices, networks, and changing resource conditions.',
    icon: Network,
  },
  {
    title: 'Intelligent control',
    description: 'Feedback, decision-making, and adaptive control for systems operating under uncertainty.',
    icon: Gauge,
  },
  {
    title: 'Autonomous systems',
    description: 'Perception, planning, and coordinated decision-making for autonomous systems in physical environments.',
    icon: Bot,
  },
  {
    title: 'Trustworthy systems',
    description: 'Reliability, security, interpretability, and transparent evaluation for AI and engineered systems.',
    icon: ShieldCheck,
  },
];

const approach = [
  {
    step: '01',
    title: 'Research',
    description: 'Ask precise questions and map the knowledge gap before committing to a direction.',
    icon: FlaskConical,
  },
  {
    step: '02',
    title: 'Experiment',
    description: 'Test ideas with explicit baselines, documented assumptions, and measurable outcomes.',
    icon: Gauge,
  },
  {
    step: '03',
    title: 'Build',
    description: 'Turn validated research into software, tools, and experimental technology.',
    icon: Wrench,
  },
  {
    step: '04',
    title: 'Share',
    description: 'Publish methods, data decisions, and results so others can reproduce and extend the work.',
    icon: Share2,
  },
];

export default function MetademicPage() {
  const jsonLds = [
    personSchema(),
    metademicOrganizationSchema(),
    metademicWebPageSchema(),
    breadcrumbSchema([
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Metademic Lab', url: absoluteUrl('/metademic') },
    ]),
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }} />

      <div className="container py-12 md:py-20">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Metademic Lab</span>
        </div>

        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>

        <header className="max-w-3xl">
          <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1 text-[11px] uppercase tracking-wider">
            <FlaskConical className="h-3.5 w-3.5" />
            Independent research laboratory
          </Badge>
          <h1 className="text-4xl font-extrabold md:text-5xl">{metademicConfig.name}</h1>
          <p className="mt-3 text-2xl font-medium text-muted-foreground">{metademicConfig.tagline}</p>
          <p className="mt-5 text-lg text-muted-foreground">{metademicConfig.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={metademicConfig.url} target="_blank" rel="noopener noreferrer">
                Visit metademic.org <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about-shariful-haque">
                About the founder <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="mt-16 rounded-2xl border bg-card p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Founder</p>
              <h2 className="mt-2 text-2xl font-bold">Shariful Haque</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Shariful Haque founded Metademic to connect rigorous research practice with applied
                engineering. His work spans artificial intelligence, business analytics, blockchain, and
                enterprise systems — with an emphasis on questions that can be tested, measured, and
                reproduced by others.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/about-shariful-haque">
                Read the full profile <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold md:text-3xl">How the lab works</h2>
            <p className="mt-2 text-muted-foreground">Research, experiment, build, share — in that order.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((item) => (
              <div key={item.step} className="rounded-xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <item.icon className="h-6 w-6 text-teal-600" />
                  <span className="text-sm font-semibold text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold md:text-3xl">Research areas</h2>
            <p className="mt-2 text-muted-foreground">
              A laboratory for connected fields — each area has its own questions, evidence, and output.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area) => (
              <Card key={area.title} className="h-full">
                <CardHeader>
                  <area.icon className="h-6 w-6 text-teal-600" />
                  <CardTitle className="mt-3 text-lg">{area.title}</CardTitle>
                  <CardDescription>{area.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
            <Card className="flex h-full flex-col justify-between border-dashed bg-muted/30">
              <CardHeader>
                <FlaskConical className="h-6 w-6 text-teal-600" />
                <CardTitle className="mt-3 text-lg">Explore the full programme</CardTitle>
                <CardDescription>
                  Publications, projects, and lab notes for every research area are maintained on the Metademic site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`${metademicConfig.url}/research`} target="_blank" rel="noopener noreferrer">
                    View research areas <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-16 rounded-2xl bg-primary p-8 text-primary-foreground md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Badge variant="inverted" className="mb-4 text-[11px] uppercase tracking-wider">
                Featured product · Experimental
              </Badge>
              <h2 className="text-2xl font-bold md:text-3xl">RACoN</h2>
              <p className="mt-1 text-primary-foreground/80">Reciprocal Agentic Compute Network</p>
              <p className="mt-3 max-w-2xl text-primary-foreground/70">
                A Metademic product exploring how heterogeneous machines can share computational work
                reliably — from scheduling and trust to measurement and reproducibility.
              </p>
            </div>
            <Button
              asChild
              variant="inverted"
              size="lg"
              className="w-fit"
            >
              <Link href={`${metademicConfig.url}/products/racon`} target="_blank" rel="noopener noreferrer">
                Explore RACoN <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border bg-card p-8 text-center md:p-10">
          <h2 className="text-2xl font-bold md:text-3xl">Good questions deserve more than one perspective</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Researchers, engineers, students, and technical writers all have a place in reproducible
            research. Visit the laboratory to see current work, products, and ways to contribute.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href={metademicConfig.url} target="_blank" rel="noopener noreferrer">
              Go to metademic.org <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
