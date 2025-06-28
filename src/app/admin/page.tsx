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

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: owner } = await supabase.from("PortfolioOwner").select().single();
  const { data: projects } = await supabase.from("Projects").select();
  const { data: experiences } = await supabase.from("ProfessionalExperience").select();
  const { data: skills } = await supabase.from("Skills").select();
  const { data: publications } = await supabase.from("Publications").select();
  const { data: awards } = await supabase.from("Awards").select();


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
            <CardTitle>Portfolio Owner</CardTitle>
             <CardDescription>
              This is the main contact and identity information for the portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {owner ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {owner.name}</p>
                <p><strong>Email:</strong> {owner.email}</p>
                <p><strong>LinkedIn:</strong> <a href={owner.linkedin_url} className="text-primary hover:underline">{owner.linkedin_url}</a></p>
                <p><strong>GitHub:</strong> <a href={owner.github_url} className="text-primary hover:underline">{owner.github_url}</a></p>
              </div>
            ) : <p>No owner data found.</p> }
             <Button className="mt-4">Edit</Button>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell><Badge variant="secondary">{project.category}</Badge></TableCell>
                      <TableCell>{project.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Button className="mt-4">Add New Project</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Publications</CardTitle>
            <CardDescription>Manage your published research.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publications?.map((pub) => (
                    <TableRow key={pub.id}>
                      <TableCell className="font-medium">{pub.title}</TableCell>
                      <TableCell>{pub.venue}</TableCell>
                      <TableCell>{pub.year}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Button className="mt-4">Add New Publication</Button>
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
                {experiences?.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium">{exp.title}</TableCell>
                      <TableCell>{exp.company}</TableCell>
                      <TableCell>{exp.dates}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Button className="mt-4">Add New Experience</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Awards</CardTitle>
            <CardDescription>Manage your awards and recognitions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awards?.map((award) => (
                    <TableRow key={award.id}>
                      <TableCell className="font-medium">{award.title}</TableCell>
                      <TableCell>{award.organization}</TableCell>
                      <TableCell>{award.year}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Button className="mt-4">Add New Award</Button>
          </CardContent>
        </Card>

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
                {skills?.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.skill_name}</TableCell>
                      <TableCell><Badge variant="outline">{skill.skill_type}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Button className="mt-4">Add New Skill</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
