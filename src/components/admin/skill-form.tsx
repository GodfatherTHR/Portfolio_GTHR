"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const skillTypes = [
    "programming_languages",
    "web_development",
    "cloud_and_devops",
    "data_analytics_and_visualization",
    "blockchain_and_web3",
    "tools_and_ide"
];


export function SkillForm({
  isOpen,
  onOpenChange,
  skill,
  onSave,
  isPending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  skill: any | null;
  onSave: (formData: FormData) => void;
  isPending: boolean;
}) {
  const title = skill ? "Edit Skill" : "Add New Skill";
  const [skillType, setSkillType] = useState(skill?.skill_type || "");

  useEffect(() => {
    if (isOpen) {
      setSkillType(skill?.skill_type || "");
    }
  }, [isOpen, skill]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={onSave} className="space-y-4">
          {skill && <input type="hidden" name="id" defaultValue={skill.id} />}
          <div className="grid gap-2">
            <Label htmlFor="skill_name">Skill Name</Label>
            <Input id="skill_name" name="skill_name" defaultValue={skill?.skill_name} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skill_type">Skill Type</Label>
             <Select name="skill_type" onValueChange={setSkillType} value={skillType} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select a skill type" />
                </SelectTrigger>
                <SelectContent>
                    {skillTypes.map(type => (
                        <SelectItem key={type} value={type}>
                           {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
