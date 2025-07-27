
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function VideoHoverCard({ project }: { project: any }) {
  const [isHovering, setIsHovering] = useState(false);
  const imageSrc = project.image_src || "https://placehold.co/600x400.png";
  const videoSrc = project.video_src;

  return (
    <Dialog>
      <Card
        className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardHeader className="p-0 relative h-48">
          {isHovering && videoSrc ? (
            <DialogTrigger asChild>
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover cursor-pointer"
              />
            </DialogTrigger>
          ) : (
            <Image
              src={imageSrc}
              alt={project.alt_text || project.title}
              fill
              className="w-full h-full object-cover"
              data-ai-hint="software project"
            />
          )}
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <CardTitle className="text-xl font-bold mb-2">{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.projecttags?.map((pt: any) => (
              <Badge key={pt.tag_id} variant="outline">{pt.tags.name}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/50">
          {project.button_link && (
            <Button variant="default" asChild className="w-full">
              <Link href={project.button_link} target="_blank" rel="noopener noreferrer">
                {project.button_text}
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
      {videoSrc && (
         <DialogContent className="max-w-4xl h-auto p-0">
            <DialogTitle className="sr-only">{project.title} Video Preview</DialogTitle>
            <video src={videoSrc} controls autoPlay className="w-full h-full rounded-md" />
        </DialogContent>
      )}
    </Dialog>
  );
}
