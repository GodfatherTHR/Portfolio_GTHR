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
import { Textarea } from "@/components/ui/textarea";

export function PublicationForm({
  isOpen,
  onOpenChange,
  publication,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  publication: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = publication ? "Edit Publication" : "Add New Publication";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4">
          {publication && <input type="hidden" name="id" defaultValue={publication.id} />}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={publication?.title} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" defaultValue={publication?.venue} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" defaultValue={publication?.year} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link">Link</Label>
            <Input id="link" name="link" type="url" defaultValue={publication?.link} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link_text">Link Text</Label>
            <Input id="link_text" name="link_text" defaultValue={publication?.link_text} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type (e.g., Conference)</Label>
            <Input id="type" name="type" defaultValue={publication?.type} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="citation_count">Citation Count</Label>
            <Input id="citation_count" name="citation_count" type="number" defaultValue={publication?.citation_count || 0} />
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
