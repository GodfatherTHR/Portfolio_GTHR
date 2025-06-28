import { createClient } from "@/lib/supabase/server";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Skill = {
  id: string;
  name: string;
  proficiency: number;
};

export default async function SkillsSection() {
  const supabase = createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, proficiency")
    .order("proficiency", { ascending: false });

  const finalSkills: Skill[] = skills || [];

  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">Technical Skills</h2>
          <p className="text-lg text-muted-foreground mt-2">The tools and technologies I'm proficient with.</p>
        </div>
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">My Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {finalSkills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-lg">{skill.name}</h4>
                    <span className="text-sm font-medium text-primary">{skill.proficiency}%</span>
                  </div>
                  <Progress value={skill.proficiency} aria-label={`${skill.name} proficiency`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
