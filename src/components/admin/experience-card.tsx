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
import { upsertExperience, deleteExperience } from "@/app/admin/actions";
import { ExperienceForm } from "./experience-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export default function ExperienceCard({ experiences }: { experiences: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertExperience(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save experience.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Experience saved successfully.",
        });
        setShowForm(false);
        setSelectedExperience(null);
      }
    });
  };

  const handleDelete = (experience: any) => {
    startTransition(async () => {
      const result = await deleteExperience(experience.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete experience.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Experience deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (experience: any) => {
    setSelectedExperience(experience);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedExperience(null);
    setShowForm(true);
  };

  return (
    <>
      <ExperienceForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        experience={selectedExperience}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>Manage your professional journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-medium">{exp.title}</TableCell>
                  <TableCell>{exp.company}</TableCell>
                  <TableCell>{exp.dates}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(exp)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(exp)} itemName={`${exp.title} at ${exp.company}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Experience</Button>
        </CardFooter>
      </Card>
    </>
  );
}
