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

export function AwardForm({
  isOpen,
  onOpenChange,
  award,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  award: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = award ? "Edit Award" : "Add New Award";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4">
          {award && <input type="hidden" name="id" defaultValue={award.id} />}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={award?.title} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" name="organization" defaultValue={award?.organization} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" defaultValue={award?.year} required />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" name="description" defaultValue={award?.description} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input id="image_url" name="image_url" type="url" defaultValue={award?.image_url} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="url">Link URL (Optional)</Label>
            <Input id="url" name="url" type="url" defaultValue={award?.url} />
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
