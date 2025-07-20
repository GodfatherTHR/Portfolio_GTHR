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
import { upsertProject, deleteProject } from "@/app/admin/actions";
import { ProjectForm } from "./project-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export default function ProjectsCard({ projects }: { projects: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertProject(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save project.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Project saved successfully.",
        });
        setShowForm(false);
        setSelectedProject(null);
      }
    });
  };

  const handleDelete = (project: any) => {
      startTransition(async () => {
        const result = await deleteProject(project.id);
        if (result?.error) {
          toast({
            title: "Error",
            description: "Failed to delete project.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Project deleted successfully.",
          });
        }
      });
  };

  const openFormForEdit = (project: any) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  return (
    <>
      <ProjectForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        project={selectedProject}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Manage the projects showcased on your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{project.category}</Badge>
                  </TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openFormForEdit(project)}
                    >
                      Edit
                    </Button>
                    <DeleteConfirmationDialog
                      onConfirm={() => handleDelete(project)}
                      itemName={project.title}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <Button onClick={openFormForNew}>Add New Project</Button>
        </CardFooter>
      </Card>
    </>
  );
}
