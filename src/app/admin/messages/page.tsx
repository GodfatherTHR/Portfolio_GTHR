import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MarkAsReadButton from "./mark-as-read-button";

export default async function MessagesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error loading messages: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Panel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Messages from your website visitors.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages?.map((message) => (
                <TableRow key={message.id} className={!message.is_read ? 'bg-secondary' : ''}>
                  <TableCell>
                    <Badge variant={!message.is_read ? "default" : "outline"}>
                      {!message.is_read ? "New" : "Read"}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(message.created_at), 'MMM d, yyyy - p')}</TableCell>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell className="max-w-sm truncate">{message.message}</TableCell>
                  <TableCell className="text-right">
                    {!message.is_read && <MarkAsReadButton messageId={message.id} />}
                  </TableCell>
                </TableRow>
              ))}
              {(!messages || messages.length === 0) && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No messages yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
