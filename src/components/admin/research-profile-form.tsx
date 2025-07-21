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

export function ResearchProfileForm({
  isOpen,
  onOpenChange,
  profile,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = profile ? "Edit Research Profile" : "Add New Research Profile";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4">
          {profile && <input type="hidden" name="id" defaultValue={profile.id} />}
          <div className="grid gap-2">
            <Label htmlFor="name">Name (e.g., ResearchGate)</Label>
            <Input id="name" name="name" defaultValue={profile?.name} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link">URL</Label>
            <Input id="link" name="link" type="url" defaultValue={profile?.link} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon">Icon Key (e.g., researchgate, googlescholar, orcid)</Label>
            <Input id="icon" name="icon" defaultValue={profile?.icon} />
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
