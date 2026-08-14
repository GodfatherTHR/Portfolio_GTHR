import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { jsonLdGraph, articleSchema, breadcrumbSchema } from '@/lib/schema'
import { absoluteUrl } from '@/lib/site'
import { demoteHeadings } from '@/lib/html'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, image_url, author, published_at, updated_at')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt || `Read "${post.title}" by ${post.author} on Shariful Haque's blog.`,
    path: `/blog/${params.slug}`,
    image: post.image_url,
    type: 'article',
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
    authors: post.author ? [post.author] : undefined,
  });
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

  const url = absoluteUrl(`/blog/${params.slug}`)
  const jsonLds = [
    articleSchema({
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      image: post.image_url,
      author: post.author,
    }),
    breadcrumbSchema([
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Blog', url: absoluteUrl('/blog') },
      { name: post.title, url },
    ]),
  ]

  return (
    <article className="container max-w-4xl mx-auto py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }}
      />
      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
      </div>
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">{post.title}</h1>
        <div className="text-muted-foreground text-sm text-center">
          <span>By {post.author}</span>
          <span className="mx-2">&middot;</span>
          <time dateTime={post.published_at}>
            {format(new Date(post.published_at), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>

      {post.image_url && (
        <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-lg dark:prose-invert max-w-none mx-auto"
        dangerouslySetInnerHTML={{ __html: demoteHeadings(post.content) }}
      />

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-2">About the Author</h2>
        <p className="text-muted-foreground mb-4">
          This article was written by <strong>{post.author}</strong>. Learn more about
          {' '}
          <Link href="/about-shariful-haque" className="text-primary hover:underline">
            Shariful Haque
          </Link>{' '}
          and explore his{' '}
          <Link href="/research" className="text-primary hover:underline">research and publications</Link>.
        </p>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: posts } = await supabase.from('blog_posts').select('slug').eq('status', 'published');
  return posts || [];
}
