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

export function ProjectForm({
  isOpen,
  onOpenChange,
  project,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = project ? "Edit Project" : "Add New Project";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4">
          {project && <input type="hidden" name="id" defaultValue={project.id} />}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project?.title} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue={project?.category} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={project?.description} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="button_link">Button Link</Label>
            <Input id="button_link" name="button_link" type="url" defaultValue={project?.button_link} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="button_text">Button Text</Label>
            <Input id="button_text" name="button_text" defaultValue={project?.button_text} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="icon">Icon</Label>
            <Input id="icon" name="icon" defaultValue={project?.icon} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="json_id">JSON ID</Label>
            <Input id="json_id" name="json_id" defaultValue={project?.json_id} />
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
