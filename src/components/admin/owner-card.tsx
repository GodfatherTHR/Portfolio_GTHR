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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useRef, useTransition } from "react";
import { updateOwner } from "@/app/admin/actions";

export default function OwnerCard({ owner }: { owner: any }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateOwner(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to update owner info.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Portfolio owner updated successfully.",
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Owner & Social Links</CardTitle>
        <CardDescription>
          This is the main identity, contact, and social profile information for the portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {owner ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {owner.name}</p>
            <p><strong>Email:</strong> {owner.email}</p>
            <p><strong>LinkedIn:</strong> <a href={owner.linkedin_url} className="text-primary hover:underline">{owner.linkedin_url}</a></p>
            <p><strong>GitHub:</strong> <a href={owner.github_url} className="text-primary hover:underline">{owner.github_url}</a></p>
            <p><strong>ResearchGate URL:</strong> <a href={owner.researchgate_url} className="text-primary hover:underline">{owner.researchgate_url}</a></p>
            <p><strong>Google Scholar URL:</strong> <a href={owner.googlescholar_url} className="text-primary hover:underline">{owner.googlescholar_url}</a></p>
            <p><strong>ORCID URL:</strong> <a href={owner.orcid_url} className="text-primary hover:underline">{owner.orcid_url}</a></p>
          </div>
        ) : (
          <p>No owner data found.</p>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Edit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Owner Info & Links</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={handleAction} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
              <input type="hidden" name="id" defaultValue={owner?.id} />
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={owner?.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={owner?.email} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input id="linkedin_url" name="linkedin_url" type="url" defaultValue={owner?.linkedin_url} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input id="github_url" name="github_url" type="url" defaultValue={owner?.github_url} />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="researchgate_url">ResearchGate URL</Label>
                <Input id="researchgate_url" name="researchgate_url" type="url" defaultValue={owner?.researchgate_url} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="googlescholar_url">Google Scholar URL</Label>
                <Input id="googlescholar_url" name="googlescholar_url" type="url" defaultValue={owner?.googlescholar_url} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="orcid_url">ORCID URL</Label>
                <Input id="orcid_url" name="orcid_url" type="url" defaultValue={owner?.orcid_url} />
              </div>
              <DialogFooter className="sticky bottom-0 bg-background pt-4">
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
