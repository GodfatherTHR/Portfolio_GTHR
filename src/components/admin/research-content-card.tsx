"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { updateResearchContent } from "@/app/admin/actions";

export default function ResearchContentCard({ researchContent }: { researchContent: any }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateResearchContent(formData);
      if (result?.error) {
        const errorMessage = ("_server" in result.error && result.error._server?.[0]) || "Failed to update research section.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Research section updated successfully.",
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Section Content</CardTitle>
        <CardDescription>Manage the heading and intro text for the public research section.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {researchContent ? (
          <div className="space-y-2">
            <p><strong>Title:</strong> {researchContent.title}</p>
            <p><strong>Description:</strong> {researchContent.description}</p>
          </div>
        ) : (
          <p>No research section content found. Run the latest database migration.</p>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button disabled={!researchContent}>Edit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Research Section</DialogTitle>
            </DialogHeader>
            <form action={handleAction} className="space-y-4">
              <input type="hidden" name="id" defaultValue={researchContent?.id} />

              <div className="grid gap-2">
                <Label htmlFor="research-title">Section Title</Label>
                <Input id="research-title" name="title" defaultValue={researchContent?.title} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="research-description">Section Description</Label>
                <Textarea id="research-description" name="description" defaultValue={researchContent?.description} required />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
