
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
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(award?.image_url || null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImagePreview(award?.image_url || null);
    }
  }, [award, isOpen]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      if (data.success && data.url) {
        setImagePreview(data.url);
        const imageUrlInput = document.getElementById('image_url') as HTMLInputElement;
        if (imageUrlInput) {
          imageUrlInput.value = data.url;
        }
        toast({ title: "Upload Successful", description: "Image has been uploaded." });
      } else {
        throw new Error(data.error || 'Failed to get URL from server.');
      }
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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

          <div className="space-y-4 rounded-md border p-4">
             <h3 className="text-sm font-medium">Award Image (Optional)</h3>
             <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" disabled={isUploading} />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {isUploading ? 'Uploading...' : 'Upload from Device'}
               </Button>
              <div className="grid gap-2">
                <Label htmlFor="image_url">Or paste Image URL</Label>
                <Input id="image_url" name="image_url" type="url" defaultValue={imagePreview} onBlur={(e) => setImagePreview(e.target.value)} readOnly={isUploading} />
              </div>
              {imagePreview && (
                <div className="mt-2">
                   <p className="text-sm font-medium mb-2">Image Preview:</p>
                   <Image src={imagePreview} alt="Image preview" width={120} height={80} className="rounded-md object-cover border" />
                </div>
              )}
          </div>

           <div className="grid gap-2">
            <Label htmlFor="url">Link URL (Optional)</Label>
            <Input id="url" name="url" type="url" defaultValue={award?.url} />
          </div>
          <DialogFooter className="sticky bottom-0 bg-background py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={isPending || isUploading}>
               {isPending ? "Saving..." : isUploading ? "Wait for Upload..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
