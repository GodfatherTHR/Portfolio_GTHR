import type { Metadata } from 'next';
import { siteConfig, siteUrl, absoluteImage } from './site';

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  type?: 'website' | 'article' | 'book' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
  keywords?: string[];
};

/**
 * Build a complete, consistent Metadata object for any page.
 * Every page gets a unique title, description, canonical, OG and Twitter tags.
 */
export function buildPageMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [siteConfig.name],
  robots,
  keywords,
}: PageMetadataOptions): Metadata {
  const url = `${siteUrl}${path === '/' ? '' : path}`;
  const ogImage = absoluteImage(image);

  const openGraph: Record<string, unknown> = {
    title,
    description,
    url,
    type,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : [],
  };

  if (publishedTime) openGraph.publishedTime = publishedTime;
  if (modifiedTime) openGraph.modifiedTime = modifiedTime;
  if (type === 'article' && authors.length) openGraph.authors = authors;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: robots ?? { index: true, follow: true },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}
