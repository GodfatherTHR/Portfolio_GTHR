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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function BlogPostForm({
  isOpen,
  onOpenChange,
  post,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = post ? "Edit Blog Post" : "Add New Blog Post";
  const [status, setStatus] = useState(post?.status || "draft");

  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4 flex-grow overflow-y-auto pr-6">
          {post && <input type="hidden" name="id" defaultValue={post.id} />}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title" 
              defaultValue={post?.title} 
              required 
              onChange={(e) => {
                const slugInput = document.getElementById('slug') as HTMLInputElement;
                if(slugInput) slugInput.value = slugify(e.target.value);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={post?.slug} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" defaultValue={post?.author} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input id="image_url" name="image_url" type="url" defaultValue={post?.image_url} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content (HTML allowed)</Label>
            <Textarea id="content" name="content" defaultValue={post?.content} required rows={10} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <input type="hidden" name="status" value={status} />
            <Select onValueChange={setStatus} defaultValue={status} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sticky bottom-0 bg-background py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
