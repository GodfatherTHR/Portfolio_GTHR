import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { buildPageMetadata } from '@/lib/seo';
import { jsonLdGraph, personSchema, breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Media & Press',
  description:
    'News coverage, interviews, and media mentions featuring Shariful Haque — articles about his research, books, and work in data analytics and technology.',
  path: '/media',
  keywords: ['Shariful Haque media', 'Shariful Haque news', 'Shariful Haque press', 'Shariful Haque interviews'],
});

export default async function MediaPage() {
  const supabase = createClient();
  const { data: articles, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_date', { ascending: false });

  const jsonLds = [
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Media & Press', url: absoluteUrl('/media') },
    ]),
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }}
      />
      <div className="container mx-auto max-w-5xl py-12 md:py-20">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Media & Press</span>
        </div>

        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Media & Press</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            News coverage, interviews, and media mentions featuring Shariful Haque.
          </p>
        </header>

        {error && (
          <p className="text-destructive mb-8">Unable to load media mentions at this time.</p>
        )}

        {!error && (!articles || articles.length === 0) ? (
          <p className="text-muted-foreground">No media mentions are listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles?.map((article) => (
              <Card key={article.id} className="flex flex-col overflow-hidden group">
                {article.thumbnail_url && (
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={article.thumbnail_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{article.publication_name}</p>
                </CardHeader>
                {article.description && (
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
                  </CardContent>
                )}
                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{format(new Date(article.published_date), 'MMM d, yyyy')}</span>
                  <Button asChild variant="link" className="p-0">
                    <Link href={article.article_url} target="_blank" rel="noopener noreferrer">
                      Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
