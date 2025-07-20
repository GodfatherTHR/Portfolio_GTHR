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
import { upsertAward, deleteAward } from "@/app/admin/actions";
import { AwardForm } from "./award-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export default function AwardsCard({ awards }: { awards: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedAward, setSelectedAward] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertAward(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save award.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Award saved successfully.",
        });
        setShowForm(false);
        setSelectedAward(null);
      }
    });
  };

  const handleDelete = (award: any) => {
    startTransition(async () => {
      const result = await deleteAward(award.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete award.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Award deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (award: any) => {
    setSelectedAward(award);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedAward(null);
    setShowForm(true);
  };

  return (
    <>
      <AwardForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        award={selectedAward}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Awards</CardTitle>
          <CardDescription>Manage your awards and recognitions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awards.map((award) => (
                <TableRow key={award.id}>
                  <TableCell className="font-medium">{award.title}</TableCell>
                  <TableCell>{award.organization}</TableCell>
                  <TableCell>{award.year}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(award)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(award)} itemName={award.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Award</Button>
        </CardFooter>
      </Card>
    </>
  );
}
