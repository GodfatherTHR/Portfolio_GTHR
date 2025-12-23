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

export function PublicationForm({
  isOpen,
  onOpenChange,
  publication,
  allTags,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  publication: any | null;
  allTags: any[];
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = publication ? "Edit Publication" : "Add New Publication";
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (publication?.publicationtags) {
      const currentTagIds = new Set<number>(publication.publicationtags.map((pt: any) => Number(pt.tag_id)));
      setSelectedTagIds(currentTagIds);
    } else {
      setSelectedTagIds(new Set());
    }
  }, [publication, isOpen]);

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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={publication?.description} />
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
          <div className="grid gap-2">
            <Label htmlFor="json_id">JSON ID (for images)</Label>
            <Input id="json_id" name="json_id" defaultValue={publication?.json_id} />
          </div>
          
          <div className="space-y-2 rounded-md border p-4">
             <Label>Tags</Label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allTags.map(tag => (
                   <div key={tag.id} className="flex items-center space-x-2">
                     <Checkbox
                       id={`tag-${tag.id}`}
                       checked={selectedTagIds.has(tag.id)}
                       onCheckedChange={(checked) => handleTagChange(tag.id, !!checked)}
                     />
                     <label
                       htmlFor={`tag-${tag.id}`}
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
