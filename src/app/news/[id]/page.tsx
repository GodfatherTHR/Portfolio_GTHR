
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';

export default async function NewsArticlePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: article, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !article) {
    notFound();
  }

  // This page will act as a gateway to the external article
  return (
    <div className="container mx-auto max-w-2xl py-12 md:py-20">
      <Card>
        <CardHeader>
          {article.publication_logo_url && (
            <div className="flex justify-center mb-4">
              <Image 
                src={article.publication_logo_url} 
                alt={`${article.publication_name} Logo`} 
                width={150} 
                height={50} 
                className="object-contain"
              />
            </div>
          )}
          <CardTitle className="text-center">{article.title}</CardTitle>
          <CardDescription className="text-center">
            Published by <strong>{article.publication_name}</strong> on {format(new Date(article.published_date), 'MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        {article.thumbnail_url && (
            <div className="px-6">
                <Image 
                    src={article.thumbnail_url} 
                    alt={article.title} 
                    width={800}
                    height={450}
                    className="rounded-lg object-cover w-full"
                />
            </div>
        )}
        <CardContent className="mt-6">
          <p className="text-muted-foreground">{article.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full">
            <Link href={article.article_url} target="_blank" rel="noopener noreferrer">
              Read Full Article <ExternalLink className="ml-2 h-4 w-4"/>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/#news">
              <Home className="mr-2 h-4 w-4"/> Back to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export async function generateStaticParams() {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: articles } = await supabase.from('news_articles').select('id');
    return articles || [];
}
