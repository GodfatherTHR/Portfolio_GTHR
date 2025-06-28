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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase.from("profile").select().single();
  const { data: projects } = await supabase.from("projects").select();
  const { data: experiences } = await supabase
    .from("experience")
    .select()
    .order("start_date", { ascending: false });
  const { data: skills } = await supabase
    .from("skills")
    .select()
    .order("proficiency", { ascending: false });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-10">
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

      <div className="grid gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is your public profile information that appears on the hero
              and contact sections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile ? (
              <div className="space-y-2">
                <p>
                  <strong>Full Name:</strong> {profile.full_name}
                </p>
                <p>
                  <strong>Headline:</strong> {profile.headline}
                </p>
                <p>
                  <strong>Contact Email:</strong> {profile.contact_email}
                </p>
                <div>
                  <strong>Social Links:</strong>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>
                      GitHub:{" "}
                      <a
                        href={profile.social_links?.github}
                        className="text-primary hover:underline"
                      >
                        {profile.social_links?.github}
                      </a>
                    </li>
                    <li>
                      LinkedIn:{" "}
                      <a
                        href={profile.social_links?.linkedin}
                        className="text-primary hover:underline"
                      >
                        {profile.social_links?.linkedin}
                      </a>
                    </li>
                    <li>
                      Twitter:{" "}
                      <a
                        href={profile.social_links?.twitter}
                        className="text-primary hover:underline"
                      >
                        {profile.social_links?.twitter}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p>No profile data found.</p>
            )}
            <Button className="mt-4">Edit Profile</Button>
          </CardContent>
        </Card>

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
                  <TableHead className="w-[20%]">Title</TableHead>
                  <TableHead className="w-[45%]">Description</TableHead>
                  <TableHead className="w-[25%]">Tags</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                      <TableCell>{project.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Button className="mt-4">Add New Project</Button>
          </CardContent>
        </Card>

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
                {experiences && experiences.length > 0 ? (
                  experiences.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium">{exp.role}</TableCell>
                      <TableCell>{exp.company}</TableCell>
                      <TableCell>
                        {new Date(exp.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Present"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No work experience found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Button className="mt-4">Add New Experience</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>
              Manage your technical skills and proficiency levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Skill</TableHead>
                  <TableHead className="w-[50%]">Proficiency</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills && skills.length > 0 ? (
                  skills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={skill.proficiency}
                            className="h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No skills found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Button className="mt-4">Add New Skill</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
