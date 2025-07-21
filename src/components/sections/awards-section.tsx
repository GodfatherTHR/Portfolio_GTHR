import { createClient } from "@/lib/supabase/server";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AwardCard from "@/components/award-card";

export default async function AwardsSection() {
  const supabase = createClient();
  const { data: awards, error } = await supabase
    .from("awards")
    .select("*")
    .order("year", { ascending: false });

  if (error || !awards || awards.length === 0) {
     return (
       <section id="awards" className="py-16 md:py-24">
        <div className="container">
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Awards Content Not Found</AlertTitle>
            <AlertDescription>
               Could not fetch content for the 'Awards' section. Please ensure your 'awards' table has data and that Row Level Security (RLS) is configured to allow public read access.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  return (
    <section id="awards" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">Awards & Recognitions</h2>
          <p className="text-lg text-muted-foreground mt-2">Honored for my contributions and achievements.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award: any) => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
      </div>
    </section>
  );
}
