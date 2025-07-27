import { createClient } from "@/lib/supabase/server";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ResearchSectionClient from "./research-section-client";
import FaultyTerminal from "../animation/FaultyTerminal";

export default async function ResearchSection() {
  const supabase = createClient();
  const { data: publications, error } = await supabase
    .from("publications")
    .select("*, publicationtags(*, tags(*))")
    .order("year", { ascending: false });

  const hasContent = !error && publications && publications.length > 0;

  return (
    <section id="research" className="py-16 md:py-24 relative bg-transparent">
        <FaultyTerminal
          tint="#00ff00"
        />
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Research & Publications</h2>
          <p className="text-lg text-white mt-2">My contributions to the academic community.</p>
        </div>
        
        {!hasContent ? (
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Research Content Not Found</AlertTitle>
            <AlertDescription>
               Could not fetch content for the 'Research' section. Please ensure your 'publications' table has data and that Row Level Security (RLS) is configured to allow public read access.
            </AlertDescription>
          </Alert>
        ) : (
          <ResearchSectionClient publications={publications} />
        )}
      </div>
    </section>
  )
}
