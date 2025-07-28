
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
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

export function ProjectForm({
  isOpen,
  onOpenChange,
  project,
  allTags,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: any | null;
  allTags: any[];
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = project ? "Edit Project" : "Add New Project";
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (project?.projecttags) {
      const currentTagIds = new Set(project.projecttags.map((pt: any) => pt.tag_id));
      setSelectedTagIds(currentTagIds);
    } else {
      setSelectedTagIds(new Set());
    }
  }, [project, isOpen]);

  const handleTagChange = (tagId: number, checked: boolean) => {
    const newSet = new Set(selectedTagIds);
    if (checked) {
      newSet.add(tagId);
    } else {
      newSet.delete(tagId);
    }
    setSelectedTagIds(newSet);
  };
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    selectedTagIds.forEach(id => {
      formData.append('tags', String(id));
    });
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4 flex-grow overflow-y-auto pr-6">
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
            <Label htmlFor="image_src">Image URL</Label>
            <Input id="image_src" name="image_src" type="url" defaultValue={project?.image_src} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alt_text">Image Alt Text</Label>
            <Input id="alt_text" name="alt_text" defaultValue={project?.alt_text} />
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
            <Label htmlFor="icon">Icon Key</Label>
            <Input id="icon" name="icon" defaultValue={project?.icon} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="json_id">JSON ID (for image mapping)</Label>
            <Input id="json_id" name="json_id" defaultValue={project?.json_id} />
          </div>

          <div className="space-y-2 rounded-md border p-4">
             <Label>Tags</Label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allTags.map(tag => (
                   <div key={tag.id} className="flex items-center space-x-2">
                     <Checkbox
                       id={`project-tag-${tag.id}`}
                       checked={selectedTagIds.has(tag.id)}
                       onCheckedChange={(checked) => handleTagChange(tag.id, !!checked)}
                     />
                     <label
                       htmlFor={`project-tag-${tag.id}`}
                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                       {tag.name}
                     </label>
                   </div>
                ))}
             </div>
          </div>
          
          <DialogFooter className="sticky bottom-0 bg-background py-4">
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
