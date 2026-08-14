import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()

  const [blogResult, booksResult] = await Promise.all([
    supabase.from('blog_posts').select('slug, published_at').eq('status', 'published'),
    supabase.from('books').select('slug, published_at').eq('status', 'published'),
  ])

  const blogPosts = blogResult.data || []
  const books = booksResult.data || []

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${siteUrl}/about-shariful-haque`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/research`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/media`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/book`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${siteUrl}/book/${book.slug}`,
    lastModified: new Date(book.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages, ...bookPages]
}
