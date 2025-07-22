
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useRef, useTransition, useEffect } from "react";
import { updateContactInfo } from "@/app/admin/actions";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ContactInfoCard({ contactInfo }: { contactInfo: any }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
      
      if (!error && count !== null) {
        setUnreadCount(count);
      }
    }
    fetchUnreadCount();
  }, []);

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateContactInfo(formData);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to update contact info.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Contact info updated successfully.",
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Section Content</CardTitle>
        <CardDescription>
          Manage the title and description for your contact section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {contactInfo ? (
          <div className="space-y-2">
            <p><strong>Title:</strong> {contactInfo.title}</p>
            <p><strong>Description:</strong> {contactInfo.description}</p>
            <p><strong>Email:</strong> {contactInfo.email}</p>
            <p><strong>Phone:</strong> {contactInfo.phone}</p>
          </div>
        ) : (
          <p>No contact info data found.</p>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Edit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Contact Info</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={handleAction} className="space-y-4">
              <input type="hidden" name="id" defaultValue={contactInfo?.id} />
              
              <div className="grid gap-2">
                <Label htmlFor="title">Section Title</Label>
                <Input id="title" name="title" defaultValue={contactInfo?.title} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Section Description</Label>
                <Textarea id="description" name="description" defaultValue={contactInfo?.description} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" name="email" type="email" defaultValue={contactInfo?.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Contact Phone</Label>
                <Input id="phone" name="phone" defaultValue={contactInfo?.phone} />
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
         <Button asChild variant="secondary" className="relative">
          <Link href="/admin/messages">
            Messages
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
