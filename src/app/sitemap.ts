import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()

  const [blogResult, booksResult] = await Promise.all([
    supabase.from('blog_posts').select('slug, published_at').eq('status', 'published'),
    supabase.from('books').select('slug, published_at').eq('status', 'published'),
  ])

  const blogPosts = blogResult.data || []
  const books = booksResult.data || []

  const staticPages: MetadataRoute.Sitemap = [
    { url: 'https://www.sharifulhaque.org', lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: 'https://www.sharifulhaque.org/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.sharifulhaque.org/book', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `https://www.sharifulhaque.org/blog/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `https://www.sharifulhaque.org/book/${book.slug}`,
    lastModified: new Date(book.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages, ...bookPages]
}
