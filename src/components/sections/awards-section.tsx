import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export default async function AwardsSection() {
  const supabase = createClient();
  const { data: awards } = await supabase
    .from("Awards")
    .select("*")
    .order("year", { ascending: false });

  if (!awards || awards.length === 0) return null;

  return (
    <section id="awards" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">Awards & Recognitions</h2>
          <p className="text-lg text-muted-foreground mt-2">Honored for my contributions and achievements.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award: any) => (
            <Card key={award.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Award className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle>{award.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{award.organization}, {award.year}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p>{award.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
