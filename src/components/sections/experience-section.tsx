import { createClient } from "@/lib/supabase/server";
import { Briefcase } from "lucide-react";

type Experience = {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default async function ExperienceSection() {
  const supabase = createClient();
  const { data: experience, error } = await supabase
    .from("experience")
    .select("id, role, company, start_date, end_date, description")
    .order("start_date", { ascending: false });

  const finalExperience: Experience[] = experience && experience.length > 0 ? experience : [
    {
      id: "1",
      role: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      start_date: "2020-01-15",
      end_date: null,
      description: "Led the development of a new client-facing dashboard using React and TypeScript. Improved application performance by 30% through code optimization and bundle splitting. Mentored junior developers.",
    },
    {
      id: "2",
      role: "Mid-Level Software Engineer",
      company: "Innovate Co.",
      start_date: "2018-06-01",
      end_date: "2019-12-30",
      description: "Developed and maintained features for a large-scale web application using Angular. Collaborated with backend teams to design and implement new APIs. Wrote unit and integration tests to ensure code quality.",
    },
    {
      id: "3",
      role: "Junior Web Developer",
      company: "Web Wizards",
      start_date: "2017-05-20",
      end_date: "2018-05-30",
      description: "Assisted in building responsive websites for various clients using HTML, CSS, and JavaScript. Gained experience with version control systems like Git and project management tools.",
    },
  ];

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
            <div key={job.id} className="relative mb-8 md:mb-12">
              <div className="md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 p-2 bg-primary rounded-full">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className={`flex ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} md:items-center w-full`}>
                <div className="w-full md:w-5/12">
                  <div className={`p-6 rounded-lg shadow-md bg-card border ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(job.start_date)} - {job.end_date ? formatDate(job.end_date) : 'Present'}
                    </p>
                    <h3 className="text-xl font-bold mt-1 text-primary">{job.role}</h3>
                    <p className="text-lg font-semibold">{job.company}</p>
                    <p className="mt-2 text-card-foreground/80">{job.description}</p>
                  </div>
                </div>
                 <div className="w-2/12 hidden md:block"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
