
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { updateAboutContent } from "@/app/admin/actions";
import { AboutForm } from "./about-form";
import Image from "next/image";

export default function AboutCard({ aboutContent }: { aboutContent: any }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateAboutContent(formData);
      if (result?.error) {
        const errorMessage = "_server" in result.error
          ? result.error._server?.[0]
          : "Please check the highlighted fields and try again.";
        toast({
          title: "Error",
          description: errorMessage || "Failed to update About section.",
          variant: "destructive",
        });
        console.error(result.error);
      } else {
        toast({
          title: "Success",
          description: "About section updated successfully.",
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <AboutForm
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        aboutContent={aboutContent}
        onSave={handleAction}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>About Section Content</CardTitle>
          <CardDescription>
            Manage all the content for your "About Me" section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {aboutContent ? (
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                    <p><strong>Title:</strong> {aboutContent.title}</p>
                    <p><strong>Description:</strong> {aboutContent.description}</p>
                    <p><strong>Expertise Title:</strong> {aboutContent.expertise_title}</p>
                    <ul className="list-disc pl-5">
                        {aboutContent.aboutexpertise.map((item:any) => <li key={item.id}>{item.expertise_item}</li>)}
                    </ul>
                    <p><strong>CTA Text:</strong> {aboutContent.cta_text}</p>
                    <p><strong>CTA Link:</strong> {aboutContent.cta_link}</p>
                </div>
                <div className="space-y-2">
                    <p><strong>Image Preview:</strong></p>
                    {aboutContent.image_src && (
                        <Image src={aboutContent.image_src} alt={aboutContent.image_alt || "About Image"} width={200} height={250} className="rounded-md object-cover border" />
                    )}
                </div>
            </div>
          ) : (
            <p>No "About" section data found.</p>
          )}
        </CardContent>
        <CardFooter>
            <Button onClick={() => setIsOpen(true)}>Edit About Section</Button>
        </CardFooter>
      </Card>
    </>
  );
}
