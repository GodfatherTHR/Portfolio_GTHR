
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
import { updateContactInfo } from "@/app/admin/actions";
import { Textarea } from "../ui/textarea";

export default function ContactInfoCard({ contactInfo }: { contactInfo: any }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateContactInfo(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to update contact info.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Contact info updated successfully.",
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Section & Social Links</CardTitle>
        <CardDescription>
          Manage the content and links in your contact and research sections.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contactInfo ? (
          <div className="space-y-2 text-sm">
            <p><strong>Title:</strong> {contactInfo.title}</p>
            <p><strong>Description:</strong> {contactInfo.description}</p>
            <p><strong>Email:</strong> {contactInfo.email}</p>
            <p><strong>Phone:</strong> {contactInfo.phone}</p>
            <p><strong>ResearchGate URL:</strong> {contactInfo.researchgate_url}</p>
            <p><strong>Google Scholar URL:</strong> {contactInfo.googlescholar_url}</p>
            <p><strong>ORCID URL:</strong> {contactInfo.orcid_url}</p>
          </div>
        ) : (
          <p>No contact info data found.</p>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Edit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Contact Info & Links</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={handleAction} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
              <input type="hidden" name="id" defaultValue={contactInfo?.id} />
              
              <div className="grid gap-2">
                <Label htmlFor="title">Section Title</Label>
                <Input id="title" name="title" defaultValue={contactInfo?.title} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Section Description</Label>
                <Textarea id="description" name="description" defaultValue={contactInfo?.description} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={contactInfo?.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={contactInfo?.phone} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="researchgate_url">ResearchGate URL</Label>
                <Input id="researchgate_url" name="researchgate_url" type="url" defaultValue={contactInfo?.researchgate_url} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="googlescholar_url">Google Scholar URL</Label>
                <Input id="googlescholar_url" name="googlescholar_url" type="url" defaultValue={contactInfo?.googlescholar_url} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="orcid_url">ORCID URL</Label>
                <Input id="orcid_url" name="orcid_url" type="url" defaultValue={contactInfo?.orcid_url} />
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
