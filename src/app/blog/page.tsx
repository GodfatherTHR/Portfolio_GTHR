import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Blog | Shariful Haque',
  description: 'Read the latest articles and insights from Shariful Haque.',
}

export default async function BlogIndexPage() {
  const supabase = createClient()
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Homepage
            </Link>
          </Button>
        </div>
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold">Blog</h1>
        <p className="text-lg text-muted-foreground mt-2">My latest articles and insights.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts && posts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden">
             {post.image_url && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>
                By {post.author} on {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild variant="secondary">
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {(!posts || posts.length === 0) && (
            <p className="col-span-full text-center text-muted-foreground">No blog posts found.</p>
        )}
      </div>
    </div>
  )
}
