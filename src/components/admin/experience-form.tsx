"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

export function ExperienceForm({
  isOpen,
  onOpenChange,
  experience,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  experience: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = experience ? "Edit Experience" : "Add New Experience";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4">
          {experience && <input type="hidden" name="id" defaultValue={experience.id} />}
          <div className="grid gap-2">
            <Label htmlFor="title">Role / Title</Label>
            <Input id="title" name="title" defaultValue={experience?.title} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" defaultValue={experience?.company} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dates">Dates (e.g., 2020 - Present)</Label>
            <Input id="dates" name="dates" defaultValue={experience?.dates} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" name="description" defaultValue={experience?.description} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
