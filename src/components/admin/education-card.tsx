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
import { upsertEducation, deleteEducation } from "@/app/admin/actions";
import { EducationForm } from "./education-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export default function EducationCard({ education }: { education: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertEducation(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save education entry.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Education saved successfully.",
        });
        setShowForm(false);
        setSelectedEducation(null);
      }
    });
  };

  const handleDelete = (edu: any) => {
    startTransition(async () => {
      const result = await deleteEducation(edu.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete education entry.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Education deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (edu: any) => {
    setSelectedEducation(edu);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedEducation(null);
    setShowForm(true);
  };

  return (
    <>
      <EducationForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        education={selectedEducation}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>Manage your academic qualifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Degree</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {education.map((edu) => (
                <TableRow key={edu.id}>
                  <TableCell className="font-medium">{edu.degree}</TableCell>
                  <TableCell>{edu.institution}</TableCell>
                  <TableCell>{edu.dates}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(edu)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(edu)} itemName={`${edu.degree} at ${edu.institution}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Education</Button>
        </CardFooter>
      </Card>
    </>
  );
}
