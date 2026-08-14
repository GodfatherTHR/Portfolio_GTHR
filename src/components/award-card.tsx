
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award as AwardIcon, ExternalLink } from "lucide-react";
import RichText from "@/components/rich-text";

export default function AwardCard({ award }: { award: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = award.description || "";
  const isLongDescription = description.length > 150;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {award.image_url && (
        <Link href={award.image_url} target="_blank" rel="noopener noreferrer" className="block relative h-56 w-full">
          <Image
            src={award.image_url}
            alt={award.title}
            fill
            className="object-cover"
          />
        </Link>
      )}
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          <AwardIcon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <CardTitle>{award.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {award.organization}, {award.year}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {description && (
          <>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <RichText
                content={
                  isLongDescription && !isExpanded
                    ? `${description.substring(0, 150)}...`
                    : description
                }
              />
            </div>
            {isLongDescription && (
              <Button
                variant="link"
                className="p-0 h-auto text-primary mt-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </Button>
            )}
          </>
        )}
      </CardContent>
      {award.url && (
        <CardFooter>
          <Button asChild variant="secondary" className="w-full">
            <Link href={award.url} target="_blank" rel="noopener noreferrer">
              Learn More <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
