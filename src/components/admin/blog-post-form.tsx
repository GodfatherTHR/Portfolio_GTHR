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
import { useState, useRef, useEffect, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Progress } from "../ui/progress";
import { createClient } from "@/lib/supabase/client";


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
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [imagePreview, setImagePreview] = useState(post?.image_url || null);
  
  useEffect(() => {
    setImagePreview(post?.image_url || null);
    setStatus(post?.status || "draft");
  }, [post]);


  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleConvertToHtml = async () => {
    const plainText = contentRef.current?.value;
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

      if (data.success && contentRef.current) {
        contentRef.current.value = data.html;
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
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        toast({ title: "Invalid File Type", description: "Please select a valid image file (JPEG, PNG, WEBP, GIF).", variant: "destructive" });
        return;
    }
    
    setIsUploading(true);
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sh-storage')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        toast({ title: "Upload Failed", description: uploadError.message, variant: "destructive" });
        setIsUploading(false);
        return;
    }
    
    const { data: { publicUrl } } = supabase.storage
        .from('sh-storage')
        .getPublicUrl(uploadData.path);
        
    if (publicUrl) {
      setImagePreview(publicUrl);
      if (imageUrlRef.current) {
        imageUrlRef.current.value = publicUrl;
      }
      toast({ title: "Upload Successful", description: "Image uploaded and URL set." });
    } else {
       toast({ title: "Upload Failed", description: "Could not get public URL for the uploaded file.", variant: "destructive" });
    }
    setIsUploading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={(formData) => onSave(formData)} className="space-y-4 flex-grow overflow-y-auto pr-6">
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
          
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-sm font-medium">Featured Image</h3>
             <div className="grid gap-2">
                <Label htmlFor="image_upload">Upload Image</Label>
                <div className="flex items-center gap-2">
                    <Input id="image_upload" type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
                {isUploading && <Progress value={undefined} className="w-full h-2" />}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Or paste Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                ref={imageUrlRef}
                placeholder="https://example.com/image.png"
                defaultValue={post?.image_url}
                onBlur={(e) => setImagePreview(e.target.value)}
              />
            </div>
             {imagePreview && (
              <div className="mt-2">
                 <Image src={imagePreview} alt="Image preview" width={120} height={80} className="rounded-md object-cover" />
              </div>
            )}
          </div>


          <div className="grid gap-2">
            <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
               <Label htmlFor="content">Content (HTML allowed)</Label>
               <Button type="button" variant="outline" size="sm" onClick={handleConvertToHtml} disabled={isConverting}>
                 <Sparkles className="mr-2 h-4 w-4" />
                 {isConverting ? 'Converting...' : 'AI Convert'}
               </Button>
            </div>
            <Textarea ref={contentRef} id="content" name="content" defaultValue={post?.content} required rows={10} />
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
            <Button type="submit" disabled={isPending || isUploading}>
              {isPending ? "Saving..." : isUploading ? "Uploading..." : "Save Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
