import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ExternalLink, Star } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo';
import { jsonLdGraph, personSchema, breadcrumbSchema, scholarlyArticleSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Research & Publications',
  description:
    'Explore the research and publications of Shariful Haque — papers on AI, blockchain, data analytics, and ERP systems, with citations and links to full publications.',
  path: '/research',
  keywords: ['Shariful Haque research', 'Shariful Haque publications', 'Shariful Haque papers', 'AI research', 'blockchain research'],
});

export default async function ResearchPage() {
  const supabase = createClient();
  const [researchResult, publicationsResult] = await Promise.all([
    supabase.from('researchcontent').select('*').maybeSingle(),
    supabase.from('publications').select('*, publicationtags(*, tags(*))').order('year', { ascending: false }),
  ]);

  const researchContent = researchResult.data;
  const publications = publicationsResult.data || [];
  const publicationsError = publicationsResult.error;

  const jsonLds = [
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Research & Publications', url: absoluteUrl('/research') },
    ]),
    ...publications.slice(0, 10).map((pub: any) =>
      scholarlyArticleSchema({
        title: pub.title,
        description: pub.description || undefined,
        url: pub.link || absoluteUrl('/research'),
        venue: pub.venue,
        year: pub.year,
        citationCount: pub.citation_count,
      })
    ),
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
          <span className="text-foreground">Research & Publications</span>
        </div>

        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Research & Publications</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {researchContent?.description || 'My contributions to the academic and research community.'}
          </p>
        </header>

        {publicationsError && (
          <p className="text-destructive mb-8">Unable to load publications at this time.</p>
        )}

        {publications.length === 0 && !publicationsError ? (
          <p className="text-muted-foreground">No publications are listed yet.</p>
        ) : (
          <div className="space-y-6">
            {publications.map((pub: any) => (
              <Card key={pub.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <CardTitle className="text-xl">{pub.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {pub.venue}, {pub.year}
                        {pub.type ? ` · ${pub.type}` : ''}
                      </p>
                    </div>
                    {pub.type && <Badge variant="outline">{pub.type}</Badge>}
                  </div>
                </CardHeader>
                {pub.description && (
                  <CardContent>
                    <p className="text-muted-foreground">{pub.description}</p>
                  </CardContent>
                )}
                <CardFooter className="flex flex-wrap items-center gap-3">
                  {pub.publicationtags?.map((pt: any) => (
                    <Badge key={pt.tag_id} variant="secondary">{pt.tags.name}</Badge>
                  ))}
                  {pub.citation_count > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                      Cited {pub.citation_count} times
                    </span>
                  )}
                  {pub.link && (
                    <Button asChild variant="secondary" size="sm" className="ml-auto">
                      <Link href={pub.link} target="_blank" rel="noopener noreferrer">
                        View Publication <ExternalLink className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Research Profiles</h2>
          <p className="text-muted-foreground mb-4">
            For the complete research profile of Shariful Haque, visit:
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="https://scholar.google.com/citations?user=6ZjMFM0AAAAJ" target="_blank" rel="noopener noreferrer">Google Scholar</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="https://orcid.org/0009-0003-0832-5539" target="_blank" rel="noopener noreferrer">ORCID</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="https://www.researchgate.net/profile/Shariful-Haque-5" target="_blank" rel="noopener noreferrer">ResearchGate</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="https://www.semanticscholar.org/author/Shariful-Haque/2321960937" target="_blank" rel="noopener noreferrer">Semantic Scholar</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
