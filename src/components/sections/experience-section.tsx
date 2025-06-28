import { createClient } from "@/lib/supabase/server";
import ExperienceItem from "./experience-item";

export type Experience = {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string;
};

export default async function ExperienceSection() {
  const supabase = createClient();
  const { data: experience } = await supabase
    .from("experience")
    .select("id, role, company, start_date, end_date, description")
    .order("start_date", { ascending: false });

  const finalExperience: Experience[] = experience || [];

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">Work Experience</h2>
          <p className="text-lg text-muted-foreground mt-2">My professional journey so far.</p>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border hidden md:block" />

          {finalExperience.map((job, index) => (
            <ExperienceItem key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
