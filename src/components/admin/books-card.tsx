
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
import { upsertBook, deleteBook } from "@/app/admin/actions";
import { BookForm } from "./book-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { format } from "date-fns";

export default function BooksCard({ books }: { books: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertBook(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save book.",
          variant: "destructive",
        });
        console.error(result.error);
      } else {
        toast({
          title: "Success",
          description: "Book saved successfully.",
        });
        setShowForm(false);
        setSelectedBook(null);
      }
    });
  };

  const handleDelete = (book: any) => {
    startTransition(async () => {
      const result = await deleteBook(book.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete book.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Book deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (book: any) => {
    setSelectedBook(book);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedBook(null);
    setShowForm(true);
  };

  return (
    <>
      <BookForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        book={selectedBook}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Books</CardTitle>
          <CardDescription>Manage your authored or recommended books.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant={book.status === 'published' ? 'default' : 'secondary'}>{book.status}</Badge>
                  </TableCell>
                   <TableCell>{format(new Date(book.updated_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(book)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(book)} itemName={book.title} />
                  </TableCell>
                </TableRow>
              ))}
               {books.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No books found.</TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Book</Button>
        </CardFooter>
      </Card>
    </>
  );
}
