import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
                <CardTitle>{pub.title}</CardTitle>
                <CardDescription>{pub.venue}, {pub.year}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <div className="flex flex-wrap gap-2">
                  {pub.PublicationTags.map((pt: any) => (
                    <Badge key={pt.tag_id} variant="secondary">{pt.Tags.name}</Badge>
                  ))}
                </div>
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
