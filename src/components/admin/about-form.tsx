
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
import { Sparkles, UploadCloud, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function AboutForm({
  isOpen,
  onOpenChange,
  aboutContent,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  aboutContent: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  const [imagePreview, setImagePreview] = useState(aboutContent?.image_src || null);
  const [isUploading, setIsUploading] = useState(false);
  const [expertiseItems, setExpertiseItems] = useState(aboutContent?.aboutexpertise || []);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      setImagePreview(aboutContent?.image_src || null);
      setExpertiseItems(aboutContent?.aboutexpertise || []);
      setDeletedIds([]);
    }
  }, [aboutContent, isOpen]);

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
        if (formRef.current) {
          const imageUrlInput = formRef.current.elements.namedItem('image_src') as HTMLInputElement;
          if (imageUrlInput) {
            imageUrlInput.value = data.url;
          }
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
  
  const handleAddExpertise = () => {
      setExpertiseItems([...expertiseItems, { id: null, expertise_item: '', about_id: aboutContent.id }]);
  };
  
  const handleRemoveExpertise = (id: number | null, index: number) => {
    if (typeof id === 'number') {
      setDeletedIds([...deletedIds, id]);
    }
    setExpertiseItems(expertiseItems.filter((_: any, i: number) => i !== index));
  };
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      formData.append('deleted_expertise_ids', deletedIds.join(','));
      onSave(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit About Section</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4 flex-grow overflow-y-auto pr-6">
          <input type="hidden" name="id" defaultValue={aboutContent?.id} />
          
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={aboutContent?.title} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (one paragraph per line)</Label>
            <Textarea id="description" name="description" defaultValue={aboutContent?.description} required rows={5} />
          </div>

          <div className="space-y-4 rounded-md border p-4">
             <h3 className="text-sm font-medium">About Image</h3>
             <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" disabled={isUploading} />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {isUploading ? 'Uploading...' : 'Upload from Device'}
               </Button>
              <div className="grid gap-2">
                <Label htmlFor="image_src">Or paste Image URL</Label>
                <Input
                  id="image_src"
                  name="image_src"
                  type="url"
                  placeholder="https://example.com/image.png"
                  defaultValue={imagePreview}
                  onBlur={(e) => setImagePreview(e.target.value)}
                  readOnly={isUploading}
                />
              </div>
               {imagePreview && (
                <div className="mt-2">
                   <p className="text-sm font-medium mb-2">Image Preview:</p>
                   <Image src={imagePreview} alt="Image preview" width={120} height={150} className="rounded-md object-cover border" />
                </div>
              )}
               <div className="grid gap-2">
                <Label htmlFor="image_alt">Image Alt Text</Label>
                <Input id="image_alt" name="image_alt" defaultValue={aboutContent?.image_alt} />
              </div>
          </div>

          <div className="space-y-4 rounded-md border p-4">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Expertise Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddExpertise}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
             </div>
              <div className="grid gap-2">
                <Label htmlFor="expertise_title">Expertise Section Title</Label>
                <Input id="expertise_title" name="expertise_title" defaultValue={aboutContent?.expertise_title} required />
              </div>
              <div className="space-y-2">
                {expertiseItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                         <input type="hidden" name={`expertise_id_${index}`} value={item.id || 'null'} />
                         <Input 
                            name={`expertise_item_${index}`} 
                            defaultValue={item.expertise_item} 
                            placeholder="e.g. Data Analytics"
                            required
                         />
                         <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveExpertise(item.id, index)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                    </div>
                ))}
              </div>
          </div>
          
           <div className="space-y-4 rounded-md border p-4">
             <h3 className="text-sm font-medium">Call To Action Button</h3>
              <div className="grid gap-2">
                <Label htmlFor="cta_text">CTA Button Text</Label>
                <Input id="cta_text" name="cta_text" defaultValue={aboutContent?.cta_text} />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="cta_link">CTA Button Link</Label>
                <Input id="cta_link" name="cta_link" defaultValue={aboutContent?.cta_link} placeholder="/#contact or https://example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cta_icon">CTA Icon (e.g., arrow-right)</Label>
                <Input id="cta_icon" name="cta_icon" defaultValue={aboutContent?.cta_icon} />
              </div>
          </div>


          <DialogFooter className="sticky bottom-0 bg-background py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={isPending || isUploading}>
              {isPending ? "Saving..." : isUploading ? "Wait for Upload..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
