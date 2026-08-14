import { siteConfig, siteUrl, absoluteUrl, absoluteImage } from './site';

/** Script-safe JSON-LD serialization for embedding in <script type="application/ld+json">. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Serialize a list of schema.org objects as a single JSON-LD graph.
 * Multiple objects must be in one array — separate <script> blocks would
 * create duplicated, unmerged entities.
 */
export function jsonLdGraph(objects: unknown[]): string {
  return jsonLd(objects);
}

/**
 * Core Person entity for Shariful Haque.
 * Used across the site via @id anchoring so Google builds one consistent entity.
 */
export function personSchema() {
  return {
    '@type': 'Person',
    '@id': siteConfig.personId,
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    sameAs: siteConfig.sameAs,
    image: absoluteImage(),
  };
}

/** WebSite schema for the homepage. */
export function webSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': siteConfig.personId,
    },
    inLanguage: 'en',
  };
}

/** Organization schema — the website itself is operated by the person. */
export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: siteConfig.name,
    url: siteUrl,
    logo: absoluteImage(),
    founder: {
      '@id': siteConfig.personId,
    },
  };
}

/** BreadcrumbList schema. Accepts {name, url}[] in order. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Article schema for blog posts. */
export function articleSchema({
  title,
  description,
  url,
  publishedTime,
  modifiedTime,
  image,
  author = siteConfig.name,
}: {
  title: string;
  description?: string;
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string | null;
  author?: string;
}) {
  return {
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    image: image ? absoluteImage(image) : undefined,
    author: {
      '@type': 'Person',
      '@id': siteConfig.personId,
      name: author,
    },
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    mainEntityOfPage: url,
  };
}

/** Book schema for book pages. */
export function bookSchema({
  name,
  description,
  url,
  isbn,
  publisher,
  publishedAt,
  image,
  author = siteConfig.name,
}: {
  name: string;
  description?: string;
  url: string;
  isbn?: string;
  publisher?: string;
  publishedAt?: string;
  image?: string | null;
  author?: string;
}) {
  const book: Record<string, unknown> = {
    '@type': 'Book',
    name,
    description,
    url,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      '@id': siteConfig.personId,
      name: author,
    },
  };
  if (isbn) book.isbn = isbn;
  if (publisher) book.publisher = publisher;
  if (publishedAt) book.datePublished = publishedAt;
  if (image) book.image = absoluteImage(image);
  return book;
}

/** ScholarlyArticle schema for research publications. */
export function scholarlyArticleSchema({
  title,
  description,
  url,
  venue,
  year,
  citationCount,
}: {
  title: string;
  description?: string;
  url: string;
  venue?: string;
  year?: number;
  citationCount?: number;
}) {
  return {
    '@type': 'ScholarlyArticle',
    headline: title,
    description,
    url,
    author: {
      '@type': 'Person',
      '@id': siteConfig.personId,
      name: siteConfig.name,
    },
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    isPartOf: venue ? { '@type': 'Periodical', name: venue } : undefined,
    datePublished: year ? `${year}-01-01` : undefined,
    citation: citationCount && citationCount > 0 ? String(citationCount) : undefined,
    mainEntityOfPage: url,
  };
}

/** ProfilePage schema for the about page. */
export function profilePageSchema() {
  return {
    '@type': 'ProfilePage',
    '@id': `${absoluteUrl('/about-shariful-haque')}#profile`,
    url: absoluteUrl('/about-shariful-haque'),
    name: `About ${siteConfig.name}`,
    description: siteConfig.description,
    mainEntity: {
      '@id': siteConfig.personId,
    },
    about: {
      '@id': siteConfig.personId,
    },
    inLanguage: 'en',
  };
}
