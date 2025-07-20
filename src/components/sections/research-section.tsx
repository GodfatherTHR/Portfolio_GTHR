import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GlareHover from "../animation/GlareHover";
import ResearchGateIcon from "../icons/researchgate-icon";
import GoogleScholarIcon from "../icons/googlescholar-icon";
import OrcidIcon from "../icons/orcid-icon";

const iconMap: { [key: string]: React.ReactNode } = {
  'researchgate': <ResearchGateIcon className="h-5 w-5" />,
  'googlescholar': <GoogleScholarIcon className="h-5 w-5" />,
  'orcid': <OrcidIcon className="h-5 w-5" />,
};


export default async function ResearchSection() {
  const supabase = createClient();
  const { data: publications, error } = await supabase
    .from("publications")
    .select("*, publicationtags(*, tags(*))")
    .order("year", { ascending: false });

  const hasContent = !error && publications && publications.length > 0;
  
  return (
    <section id="research" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">Research & Publications</h2>
          <p className="text-lg text-muted-foreground mt-2">My contributions to the academic community.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publications.map((pub: any) => (
              <GlareHover
                key={pub.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col h-full"
                glareColor="#6B46C1"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <CardTitle>{pub.title}</CardTitle>
                      <CardDescription className="mt-1">{pub.venue}, {pub.year}</CardDescription>
                    </div>
                    {pub.type && <Badge variant="outline" className="flex-shrink-0">{pub.type}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {pub.publicationtags.map((pt: any) => (
                      <Badge key={pt.tag_id} variant="secondary">{pt.tags.name}</Badge>
                    ))}
                  </div>
                  {pub.citation_count > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground pt-2">
                          <Star className="w-4 h-4 mr-1.5 fill-yellow-400 text-yellow-500" />
                          <span>Cited by {pub.citation_count}</span>
                      </div>
                  )}
                </CardContent>
                <CardFooter>
                  {pub.link && (
                    <Button asChild>
                      <Link href={pub.link} target="_blank">{pub.link_text || 'Read More'}</Link>
                    </Button>
                  )}
                </CardFooter>
              </GlareHover>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
