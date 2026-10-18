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
  title: 'News & Press',
  description:
    'Media mentions, interviews, and articles featuring Shariful Haque — news coverage of his research, books, and technology work.',
  path: '/news',
  keywords: ['Shariful Haque news', 'Shariful Haque press', 'media mentions', 'interviews'],
});

export default async function NewsPage() {
  const supabase = createClient();
  const { data: articles, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_date', { ascending: false });

  const jsonLds = [
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'News & Press', url: absoluteUrl('/news') },
    ]),
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }} />
      <div className="container mx-auto py-12 md:py-20">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">News & Press</span>
        </div>

        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold">News & Press</h1>
          <p className="text-lg text-muted-foreground mt-2">Media mentions, interviews, and articles.</p>
        </header>

        {error && (
          <p className="text-destructive mb-8">Unable to load news at this time.</p>
        )}

        {!error && (!articles || articles.length === 0) ? (
          <p className="text-muted-foreground text-center">No news articles are listed yet.</p>
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
                <CardHeader className="flex-row items-start gap-4">
                  {article.publication_logo_url && (
                    <Image src={article.publication_logo_url} alt={`${article.publication_name} logo`} width={40} height={40} className="rounded-full border object-contain" />
                  )}
                  <div className="flex-grow">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{article.publication_name}</p>
                  </div>
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