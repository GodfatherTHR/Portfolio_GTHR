"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { upsertBlogPost, deleteBlogPost } from "@/app/admin/actions";
import { BlogPostForm } from "./blog-post-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { format } from "date-fns";

export default function BlogPostsCard({ blogPosts }: { blogPosts: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertBlogPost(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save blog post.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Blog post saved successfully.",
        });
        setShowForm(false);
        setSelectedPost(null);
      }
    });
  };

  const handleDelete = (post: any) => {
    startTransition(async () => {
      const result = await deleteBlogPost(post.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete blog post.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Blog post deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (post: any) => {
    setSelectedPost(post);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedPost(null);
    setShowForm(true);
  };

  return (
    <>
      <BlogPostForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        post={selectedPost}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage your blog articles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{post.status}</Badge>
                  </TableCell>
                   <TableCell>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(post)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(post)} itemName={post.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Post</Button>
        </CardFooter>
      </Card>
    </>
  );
}
