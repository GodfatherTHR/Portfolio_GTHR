import Link from "next/link";
import { ArrowRight, BrainCircuit, Cpu, ExternalLink, FlaskConical, Network, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { metademicConfig } from "@/lib/site";

const focusAreas = [
  {
    title: "Artificial intelligence",
    description: "Learning, reasoning, and evaluation methods for capable AI models and practical applications.",
    icon: BrainCircuit,
  },
  {
    title: "Distributed computing",
    description: "Architectures that coordinate computation across heterogeneous devices and changing networks.",
    icon: Network,
  },
  {
    title: "Trustworthy systems",
    description: "Reliability, security, and transparent evaluation for AI and engineered systems.",
    icon: ShieldCheck,
  },
];

const workflow = ["Research", "Experiment", "Build", "Share"];

export default function MetademicSection() {
  return (
    <section id="metademic" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground md:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Badge variant="inverted" className="mb-5 gap-1.5 px-3 py-1 text-[11px] uppercase tracking-wider">
                <FlaskConical className="h-3.5 w-3.5" />
                Research laboratory
              </Badge>

              <h2 className="text-3xl font-bold md:text-4xl">{metademicConfig.name}</h2>
              <p className="mt-3 text-xl font-medium text-primary-foreground/90 md:text-2xl">
                {metademicConfig.tagline}
              </p>
              <p className="mt-4 max-w-xl text-primary-foreground/70">
                Founded by Shariful Haque, Metademic is an independent laboratory exploring artificial
                intelligence, intelligent systems, and computing — turning research questions into
                experiments, tools, and reproducible knowledge.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild variant="inverted" size="lg">
                  <Link href="/metademic">
                    Explore the Lab <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-transparent text-primary-foreground hover:bg-white hover:text-primary"
                >
                  <Link href={metademicConfig.url} target="_blank" rel="noopener noreferrer">
                    metademic.org <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/60">
                {workflow.map((step, index) => (
                  <span key={step} className="flex items-center gap-2">
                    {step}
                    {index < workflow.length - 1 && <ArrowRight className="h-3 w-3 text-primary-foreground/30" />}
                  </span>
                ))}
              </div>

              <div className="grid gap-3">
                {focusAreas.map((area) => (
                  <div
                    key={area.title}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <area.icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                      <div>
                        <h3 className="text-sm font-semibold">{area.title}</h3>
                        <p className="mt-1 text-sm text-primary-foreground/65">{area.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary-foreground/70">
                <Cpu className="h-4 w-4 text-teal-600" />
                Featured product: <span className="font-semibold text-primary-foreground">RACoN</span> — Reciprocal Agentic Compute Network
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
