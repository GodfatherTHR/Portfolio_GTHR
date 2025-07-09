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
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { upsertPublication, deletePublication } from "@/app/admin/actions";
import { PublicationForm } from "./publication-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export default function PublicationsCard({ publications }: { publications: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertPublication(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save publication.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Publication saved successfully.",
        });
        setShowForm(false);
        setSelectedPublication(null);
      }
    });
  };

  const handleDelete = (publication: any) => {
    startTransition(async () => {
      const result = await deletePublication(publication.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete publication.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Publication deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (publication: any) => {
    setSelectedPublication(publication);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedPublication(null);
    setShowForm(true);
  };

  return (
    <>
      <PublicationForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        publication={selectedPublication}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Publications</CardTitle>
          <CardDescription>Manage your published research.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.map((pub) => (
                <TableRow key={pub.id}>
                  <TableCell className="font-medium">{pub.title}</TableCell>
                  <TableCell>{pub.venue}</TableCell>
                  <TableCell>{pub.year}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(pub)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(pub)} itemName={pub.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Publication</Button>
        </CardFooter>
      </Card>
    </>
  );
}
