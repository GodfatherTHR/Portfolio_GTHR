import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format } from 'date-fns';

export default async function BlogSection() {
  const supabase = createClient();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  if (error || !posts || posts.length === 0) {
    return null; // Don't render the section if there are no posts or an error occurs
  }

  return (
    <section id="blog" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">From the Blog</h2>
          <p className="text-lg text-muted-foreground mt-2">Check out my latest articles and insights.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  {format(new Date(post.published_at), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href={`/blog/${post.slug}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/blog">View All Posts</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
