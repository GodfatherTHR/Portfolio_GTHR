"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import GlareHover from "../animation/GlareHover";

export default function ResearchSectionClient({ publications }: { publications: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 4;

  const displayedPublications = showAll ? publications : publications.slice(0, initialCount);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedPublications.map((pub: any) => (
          <GlareHover
            key={pub.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col h-full"
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
              <p className="text-sm leading-6 text-muted-foreground line-clamp-3">
                {pub.description || "Description unavailable."}
              </p>
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
      {publications.length > initialCount && !showAll && (
        <div className="text-center mt-12">
          <Button onClick={() => setShowAll(true)} size="lg">See More</Button>
        </div>
      )}
    </>
  );
}
