import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <article className="container max-w-3xl mx-auto py-12 md:py-20">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold russo-one-regular mb-4">{post.title}</h1>
        <div className="text-muted-foreground text-sm">
          <span>By {post.author}</span>
          <span className="mx-2">&middot;</span>
          <time dateTime={post.published_at}>
            {format(new Date(post.published_at), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>

      <div
        className="prose prose-lg dark:prose-invert max-w-none mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: posts } = await supabase.from('blog_posts').select('slug').eq('status', 'published');
  return posts || [];
}
