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
import { upsertSkill, deleteSkill } from "@/app/admin/actions";
import { SkillForm } from "./skill-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export default function SkillsCard({ skills }: { skills: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertSkill(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save skill.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Skill saved successfully.",
        });
        setShowForm(false);
        setSelectedSkill(null);
      }
    });
  };

  const handleDelete = (skill: any) => {
    startTransition(async () => {
      const result = await deleteSkill(skill.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete skill.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Skill deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (skill: any) => {
    setSelectedSkill(skill);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedSkill(null);
    setShowForm(true);
  };

  return (
    <>
      <SkillForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        skill={selectedSkill}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Manage your technical skills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.skill_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{skill.skill_type}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(skill)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(skill)} itemName={skill.skill_name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Skill</Button>
        </CardFooter>
      </Card>
    </>
  );
}
