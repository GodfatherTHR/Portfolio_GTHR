import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const siteUrl = 'https://www.sharifulhaque.org';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: '%s | Shariful Haque',
      default: 'Shariful Haque | Portfolio',
    },
    description: 'Personal portfolio of Shariful Haque, a passionate developer, DBA student, and data analytics expert pioneering blockchain and AI solutions for ERP systems.',
    keywords: ['Shariful Haque', 'portfolio', 'DBA', 'data analytics', 'blockchain', 'AI', 'ERP', 'researcher', 'developer', 'Bangladesh'],
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: '5UsrGLgWGhkR1HVyuJxxkcFXubmeePr6ozOWgTytdAM',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Shariful Haque',
      url: siteUrl,
      title: 'Shariful Haque | Portfolio',
      description: 'Personal portfolio of Shariful Haque, a passionate developer, DBA student, and data analytics expert pioneering blockchain and AI solutions for ERP systems.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Shariful Haque | Portfolio',
      description: 'Personal portfolio of Shariful Haque, a passionate developer, DBA student, and data analytics expert pioneering blockchain and AI solutions for ERP systems.',
    },
    alternates: {
      canonical: siteUrl,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Shariful Haque',
    url: siteUrl,
    jobTitle: 'DBA Student & Data Analytics Expert',
    description: 'Passionate developer and data analytics expert pioneering blockchain and AI solutions for ERP systems.',
    sameAs: [
      'https://www.linkedin.com/in/sharifulhaque',
      'https://github.com/sharifulhaque',
    ],
  };

  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
