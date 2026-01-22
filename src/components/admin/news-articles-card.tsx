
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
import { upsertNewsArticle, deleteNewsArticle } from "@/app/admin/actions";
import { NewsArticleForm } from "./news-article-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { format } from "date-fns";

export default function NewsArticlesCard({ newsArticles }: { newsArticles: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertNewsArticle(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save news article.",
          variant: "destructive",
        });
        console.error(result.error);
      } else {
        toast({
          title: "Success",
          description: "News article saved successfully.",
        });
        setShowForm(false);
        setSelectedArticle(null);
      }
    });
  };

  const handleDelete = (article: any) => {
    startTransition(async () => {
      const result = await deleteNewsArticle(article.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete news article.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "News article deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (article: any) => {
    setSelectedArticle(article);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedArticle(null);
    setShowForm(true);
  };

  return (
    <>
      <NewsArticleForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        article={selectedArticle}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>News & Press</CardTitle>
          <CardDescription>Manage your news articles and press mentions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Publication</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.publication_name}</TableCell>
                  <TableCell>{format(new Date(article.published_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {article.is_featured && <Badge>Featured</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(article)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(article)} itemName={article.title} />
                  </TableCell>
                </TableRow>
              ))}
               {newsArticles.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No news articles found.</TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Article</Button>
        </CardFooter>
      </Card>
    </>
  );
}
