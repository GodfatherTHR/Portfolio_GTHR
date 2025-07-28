
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
import { useState, useTransition } from "react";
import { updateOwner } from "@/app/admin/actions";

export default function OwnerCard({ owner }: { owner: any }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateOwner(formData);
      if (result?.error) {
        let errorMessage = "Failed to update owner info.";
        // This checks for specific validation errors from Zod and displays them
        const fieldErrors = Object.values(result.error).flat().join(' ');
        if (fieldErrors) {
            errorMessage = fieldErrors;
        }
        toast({
          title: "Error",
          description: errorMessage,
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
        <CardTitle>Portfolio Owner &amp; Social Links</CardTitle>
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Owner Info &amp; Links</DialogTitle>
            </DialogHeader>
            <form action={handleAction} className="space-y-4">
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
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
