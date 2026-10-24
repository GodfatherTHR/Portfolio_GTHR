export const siteConfig = {
  name: 'Shariful Haque',
  // Primary canonical host. Keep the www prefix to match the live site.
  url: 'https://www.sharifulhaque.org',
  // Used for JSON-LD @id anchoring of the person entity.
  personId: 'https://www.sharifulhaque.org/#person',
  description:
    'Official website of Shariful Haque — researcher, data analyst, and technology strategist specializing in AI, business analytics, blockchain, and ERP systems.',
  // Default social sharing image (served from the site itself).
  ogImage: 'https://www.sharifulhaque.org/og-image.png',
  locale: 'en_US',
  twitterHandle: '@sharifulhaque',
  // Verified external profiles that belong to the same person.
  sameAs: [
    'https://www.linkedin.com/in/sharifulhaque',
    'https://github.com/sharifulhaque',
    'https://orcid.org/0009-0003-0832-5539',
    'https://scholar.google.com/citations?user=6ZjMFM0AAAAJ',
    'https://www.researchgate.net/profile/Shariful-Haque-5',
    'https://www.semanticscholar.org/author/Shariful-Haque/2321960937',
  ],
} as const;

export const siteUrl = siteConfig.url;

/** Metademic Lab — the research laboratory founded by Shariful Haque. */
export const metademicConfig = {
  name: 'Metademic Lab',
  url: 'https://www.metademic.org',
  tagline: 'Research, made reproducible.',
  description:
    'Metademic is an independent research laboratory exploring artificial intelligence, intelligent systems, and computing — investigating ideas, building experimental technology, and sharing reproducible knowledge.',
} as const;

/** Build an absolute canonical URL from a site-relative path. */
export function absoluteUrl(path = ''): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Build an absolute URL for an image that may be relative or remote.
 * Falls back to the default OG image when no image is available.
 */
export function absoluteImage(image?: string | null): string | undefined {
  if (!image) return siteConfig.ogImage;
  if (image.startsWith('http')) return image;
  return absoluteUrl(image);
}
