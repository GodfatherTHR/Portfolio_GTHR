import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
        </div>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="destructive">
            Sign Out
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Content</CardTitle>
          <CardDescription>
            Update the content displayed on your portfolio website.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p>Here you can add forms to edit your projects, experience, skills, and more.</p>
             {/* Example form for profile, you can expand this */}
        </CardContent>
      </Card>
    </div>
  );
}
