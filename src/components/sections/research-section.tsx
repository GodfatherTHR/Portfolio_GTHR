import { createClient } from "@/lib/supabase/server";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Terminal, GraduationCap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GlareHover from "../animation/GlareHover";

// Inline SVGs for ResearchGate and ORCID icons for better styling control
const ResearchGateIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
        <path d="M18.333 18.333h-3.355c-.38 0-.667.284-.667.666v1.458h4.022V12.5H12.5v4.022h1.458c.38 0 .666.285.666.667v3.333c0 .38-.286.667-.666.667h-3.542c-.38 0-.667-.287-.667-.667v-3.333c0-.38.287-.667.667-.667h1.458V12.5H5.667v4.458h1.458c.38 0 .667.285.667.667v3.333c0 .38-.287.667-.667.667H3.542c-.38 0-.667-.287-.667-.667v-3.333c0-.38.287-.667.667-.667h1.458v-4.022H-.001V3.54C-.001 3.16.286 0 .665 0h17.668c.38 0 .667.284.667.666v1.458H.665V11.83h17.668v-1.458h-4.022V2.124h3.356c.38 0 .666.286.666.667v14.876c0 .38-.286.666-.666.666z"/>
    </svg>
);


const OrcidIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378h2.03c.193 0 .348.156.348.348v7.455c0 .193-.156.348-.348.348h-2.03c-.193 0-.348-.156-.348-.348V4.726c0-.193.156.348.348-.348zm3.298 2.417c0-1.33.886-2.417 2.45-2.417s2.45 1.087 2.45 2.417c0 1.33-.886 2.417-2.45 2.417s-2.45-1.087-2.45-2.417zm6.75 5.578h-2.123c-.223 0-.38.156-.38.348v4.62c0 .193.156.348.38.348h2.123c.223 0 .38-.156.38-.348v-4.62c0-.193-.156-.348-.38-.348z"/>
    </svg>
);

const iconMap: { [key: string]: React.ReactNode } = {
  researchgate: <ResearchGateIcon />,
  googlescholar: <GraduationCap className="w-5 h-5"/>,
  orcid: <OrcidIcon />,
};

export default async function ResearchSection() {
  const supabase = createClient();
  const { data: publications, error } = await supabase
    .from("publications")
    .select("*, publicationtags(*, tags(*))")
    .order("year", { ascending: false });
  const { data: researchProfiles } = await supabase.from("researchprofiles").select().order('id');

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
        
        {researchProfiles && researchProfiles.length > 0 && (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">For my complete research profile, please visit:</p>
            <div className="flex justify-center items-center flex-wrap gap-4">
              {researchProfiles.map(profile => {
                  if (!profile.url) return null;
                  
                  return (
                    <Button key={profile.id} asChild variant="secondary" className="shadow-lg">
                      <Link href={profile.url} target="_blank" rel="noopener noreferrer">
                        {profile.icon && (
                          <span 
                              className="mr-2 flex items-center justify-center p-1 rounded-full"
                              style={{ 
                                backgroundColor: profile.bg_color || 'transparent', 
                                color: profile.text_color || 'inherit' 
                              }}
                          >
                            {iconMap[profile.icon]}
                          </span>
                        )}
                        {profile.name}
                      </Link>
                    </Button>
                  );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
