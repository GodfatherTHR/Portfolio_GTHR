
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useState, useRef, useEffect } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function NewsArticleForm({
  isOpen,
  onOpenChange,
  article,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  article: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = article ? "Edit News Article" : "Add New News Article";
  const { toast } = useToast();
  
  const [logoPreview, setLogoPreview] = useState(article?.publication_logo_url || null);
  const [thumbnailPreview, setThumbnailPreview] = useState(article?.thumbnail_url || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLogoPreview(article?.publication_logo_url || null);
      setThumbnailPreview(article?.thumbnail_url || null);
      setIsFeatured(article?.is_featured || false);
    }
  }, [article, isOpen]);

  const handleImageUpload = async (
    file: File,
    setUploading: (isUploading: boolean) => void,
    setPreview: (url: string) => void,
    inputName: string
  ) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setPreview(data.url);
      const urlInput = document.getElementsByName(inputName)[0] as HTMLInputElement;
      if (urlInput) urlInput.value = data.url;
      
      toast({ title: "Upload Successful", description: "Image has been uploaded." });
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4 flex-grow overflow-y-auto pr-6">
          {article && <input type="hidden" name="id" defaultValue={article.id} />}
          
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={article?.title} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={article?.description} rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="publication_name">Publication Name</Label>
              <Input id="publication_name" name="publication_name" defaultValue={article?.publication_name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="article_url">Article URL</Label>
              <Input id="article_url" name="article_url" type="url" defaultValue={article?.article_url} required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="published_date">Published Date</Label>
              <Input id="published_date" name="published_date" type="date" defaultValue={article?.published_date ? new Date(article.published_date).toISOString().split('T')[0] : ''} required />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="author_name">Author Name</Label>
              <Input id="author_name" name="author_name" defaultValue={article?.author_name} />
            </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={article?.category} placeholder="e.g., interview, feature"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue={article?.display_order || 0} />
              </div>
           </div>

          <div className="space-y-4 rounded-md border p-4">
             <h3 className="text-sm font-medium">Publication Logo</h3>
             <input type="file" ref={logoInputRef} onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], setIsUploadingLogo, setLogoPreview, 'publication_logo_url')} className="hidden" accept="image/*" disabled={isUploadingLogo} />
             <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} disabled={isUploadingLogo}>
                {isUploadingLogo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Upload Logo
             </Button>
             <Input id="publication_logo_url" name="publication_logo_url" type="url" placeholder="Or paste logo URL" defaultValue={logoPreview} onBlur={(e) => setLogoPreview(e.target.value)} readOnly={isUploadingLogo} />
             {logoPreview && <Image src={logoPreview} alt="Logo preview" width={100} height={100} className="rounded-md object-contain border" />}
          </div>

          <div className="space-y-4 rounded-md border p-4">
             <h3 className="text-sm font-medium">Article Thumbnail</h3>
             <input type="file" ref={thumbnailInputRef} onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], setIsUploadingThumbnail, setThumbnailPreview, 'thumbnail_url')} className="hidden" accept="image/*" disabled={isUploadingThumbnail} />
             <Button type="button" variant="outline" size="sm" onClick={() => thumbnailInputRef.current?.click()} disabled={isUploadingThumbnail}>
                {isUploadingThumbnail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Upload Thumbnail
             </Button>
             <Input id="thumbnail_url" name="thumbnail_url" type="url" placeholder="Or paste thumbnail URL" defaultValue={thumbnailPreview} onBlur={(e) => setThumbnailPreview(e.target.value)} readOnly={isUploadingThumbnail} />
             {thumbnailPreview && <Image src={thumbnailPreview} alt="Thumbnail preview" width={150} height={100} className="rounded-md object-cover border" />}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="is_featured" name="is_featured" checked={isFeatured} onCheckedChange={(checked) => setIsFeatured(Boolean(checked))} />
            <Label htmlFor="is_featured">Feature this article on the homepage</Label>
          </div>

          <DialogFooter className="sticky bottom-0 bg-background py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={isPending || isUploadingLogo || isUploadingThumbnail}>
              {isPending ? "Saving..." : "Save Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

