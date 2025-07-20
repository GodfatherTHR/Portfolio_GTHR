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
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" defaultValue={profile?.url} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon">Icon Key (e.g., researchgate, googlescholar, orcid)</Label>
            <Input id="icon" name="icon" defaultValue={profile?.icon} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bg_color">Icon BG Color (hex, e.g., #00CCBB)</Label>
            <Input id="bg_color" name="bg_color" defaultValue={profile?.bg_color} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text_color">Icon Text Color (hex, e.g., #FFFFFF)</Label>
            <Input id="text_color" name="text_color" defaultValue={profile?.text_color} />
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
