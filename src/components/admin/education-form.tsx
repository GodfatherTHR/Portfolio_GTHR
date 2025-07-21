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

export function EducationForm({
  isOpen,
  onOpenChange,
  education,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  education: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = education ? "Edit Education" : "Add New Education";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4">
          {education && <input type="hidden" name="id" defaultValue={education.id} />}
          <div className="grid gap-2">
            <Label htmlFor="degree">Degree</Label>
            <Input id="degree" name="degree" defaultValue={education?.degree} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" name="institution" defaultValue={education?.institution} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dates">Dates (e.g., 2020 - 2024)</Label>
            <Input id="dates" name="dates" defaultValue={education?.dates} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" defaultValue={education?.notes} />
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
