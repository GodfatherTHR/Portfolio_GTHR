import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star } from "lucide-react";

export default async function ResearchSection() {
  const supabase = createClient();
  const { data: publications } = await supabase
    .from("Publications")
    .select("*, PublicationTags(*, Tags(*))")
    .order("year", { ascending: false });

  if (!publications || publications.length === 0) return null;

  return (
    <section id="research" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">Research & Publications</h2>
          <p className="text-lg text-muted-foreground mt-2">My contributions to the academic community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publications.map((pub: any) => (
            <Card key={pub.id} className="flex flex-col">
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
                  {pub.PublicationTags.map((pt: any) => (
                    <Badge key={pt.tag_id} variant="secondary">{pt.Tags.name}</Badge>
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
