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
import { upsertResearchProfile, deleteResearchProfile } from "@/app/admin/actions";
import { ResearchProfileForm } from "./research-profile-form";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export default function ResearchProfilesCard({ researchProfiles }: { researchProfiles: any[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertResearchProfile(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save research profile.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Research profile saved successfully.",
        });
        setShowForm(false);
        setSelectedProfile(null);
      }
    });
  };

  const handleDelete = (profile: any) => {
    startTransition(async () => {
      const result = await deleteResearchProfile(profile.id);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete research profile.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Research profile deleted successfully.",
        });
      }
    });
  };

  const openFormForEdit = (profile: any) => {
    setSelectedProfile(profile);
    setShowForm(true);
  };

  const openFormForNew = () => {
    setSelectedProfile(null);
    setShowForm(true);
  };

  return (
    <>
      <ResearchProfileForm
        isOpen={showForm}
        onOpenChange={setShowForm}
        profile={selectedProfile}
        onSave={handleSave}
        isPending={isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>Research Profiles</CardTitle>
          <CardDescription>Manage links to your external research profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {researchProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell>{profile.link}</TableCell>
                  <TableCell>{profile.icon}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openFormForEdit(profile)}>
                      Edit
                    </Button>
                    <DeleteConfirmationDialog onConfirm={() => handleDelete(profile)} itemName={profile.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={openFormForNew}>Add New Profile</Button>
        </CardFooter>
      </Card>
    </>
  );
}
