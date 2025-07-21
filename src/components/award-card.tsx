"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink } from "lucide-react";

export default function AwardCard({ award }: { award: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = award.description || "";
  const isLongDescription = description.length > 150;

  return (
    <Card className="flex flex-col">
      {award.image_url && (
        <div className="relative h-48 w-full">
          <Image
            src={award.image_url}
            alt={award.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      )}
      <CardHeader className="flex flex-row items-start gap-4">
        <Award className="w-10 h-10 text-primary mt-1 flex-shrink-0" />
        <div>
          <CardTitle>{award.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {award.organization}, {award.year}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {isLongDescription && !isExpanded
            ? `${description.substring(0, 150)}...`
            : description}
        </p>
        {isLongDescription && (
          <Button
            variant="link"
            className="p-0 h-auto text-primary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
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
