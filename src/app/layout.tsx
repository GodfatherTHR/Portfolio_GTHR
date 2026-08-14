import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Public_Sans } from 'next/font/google';
import { siteConfig } from '@/lib/site';
import { jsonLdGraph, personSchema, webSiteSchema, organizationSchema } from '@/lib/schema';

const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    // Pages provide a unique title; the site name is appended once.
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name} — Researcher, Data Analyst & Technology Strategist`,
  },
  description: siteConfig.description,
  keywords: ['Shariful Haque', 'Shariful Haque researcher', 'Shariful Haque publications', 'data analytics', 'AI research', 'blockchain', 'ERP systems', 'Bangladesh'],
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '5UsrGLgWGhkR1HVyuJxxkcFXubmeePr6ozOWgTytdAM',
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: `${siteConfig.name} — Researcher, Data Analyst & Technology Strategist`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Official Website`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Researcher, Data Analyst & Technology Strategist`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLds = [personSchema(), webSiteSchema(), organizationSchema()];

  return (
    <html lang="en" className={`!scroll-smooth ${publicSans.variable}`} suppressHydrationWarning={true}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MEL49L0EQJ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MEL49L0EQJ');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
