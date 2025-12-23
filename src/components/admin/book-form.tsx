
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { UploadCloud, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function BookForm({
  isOpen,
  onOpenChange,
  book,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  book: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = book ? "Edit Book" : "Add New Book";
  const [status, setStatus] = useState(book?.status || "draft");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [imagePreview, setImagePreview] = useState(book?.image_url || null);
  
  useEffect(() => {
    if (isOpen) {
      setImagePreview(book?.image_url || null);
      setStatus(book?.status || "draft");
    }
  }, [book, isOpen]);
  
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleConvertToHtml = async () => {
    const plainText = descriptionRef.current?.value;
    if (!plainText?.trim()) {
      toast({ title: "Content is empty", description: "Please enter some content before converting.", variant: "destructive" });
      return;
    }

    setIsConverting(true);
    try {
      const response = await fetch('/api/convert-to-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: plainText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success && descriptionRef.current) {
        descriptionRef.current.value = data.html;
        toast({ title: "Success", description: "Content converted to HTML." });
      } else {
        throw new Error(data.error || 'Conversion failed');
      }
    } catch (error: any) {
       toast({ title: "Conversion Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsConverting(false);
    }
  };

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
        // We will set this in the hidden input field in the form
        const imageUrlInput = document.getElementById('image_url') as HTMLInputElement;
        if(imageUrlInput) imageUrlInput.value = data.url;
        
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for your book. The slug will be auto-generated from the title.
          </DialogDescription>
        </DialogHeader>
        <form action={onSave} className="space-y-4 flex-grow overflow-y-auto pr-6">
          {book && <input type="hidden" name="id" defaultValue={book.id} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                defaultValue={book?.title} 
                required 
                onChange={(e) => {
                  const slugInput = document.getElementById('slug') as HTMLInputElement;
                  if(slugInput) slugInput.value = slugify(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={book?.slug} required />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Description</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleConvertToHtml} disabled={isConverting}>
                 <Sparkles className="mr-2 h-4 w-4" />
                 {isConverting ? 'Converting...' : 'AI Convert'}
               </Button>
            </div>
            <Textarea ref={descriptionRef} id="description" name="description" defaultValue={book?.description} rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" defaultValue={book?.author} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" name="isbn" defaultValue={book?.isbn} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input id="publisher" name="publisher" defaultValue={book?.publisher} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="page_count">Page Count</Label>
              <Input id="page_count" name="page_count" type="number" defaultValue={book?.page_count} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="link">Book Link</Label>
            <Input id="link" name="link" type="url" defaultValue={book?.link} placeholder="https://example.com/book-purchase-page" />
          </div>
          
          <div className="space-y-4 rounded-md border p-4">
             <h3 className="text-sm font-medium">Book Cover Image</h3>
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {isUploading ? 'Uploading...' : 'Upload Image'}
               </Button>
               
              <div className="grid gap-2">
                <Label htmlFor="image_url">Or paste Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
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
                   <Image src={imagePreview} alt="Image preview" width={100} height={150} className="rounded-md object-cover border" />
                </div>
              )}
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
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sticky bottom-0 bg-background py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={isPending || isUploading || isConverting}>
              {isPending ? "Saving..." : isUploading ? "Wait for Upload..." : isConverting ? "AI is working..." : "Save Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
