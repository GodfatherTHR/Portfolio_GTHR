import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AwardCard from '@/components/award-card';
import { buildPageMetadata } from '@/lib/seo';
import { jsonLdGraph, personSchema, breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Awards & Recognitions',
  description:
    'Awards and recognitions received by Shariful Haque in recognition of his contributions to research, data analytics, and technology.',
  path: '/awards',
  keywords: ['Shariful Haque awards', 'Shariful Haque recognitions', 'achievements', 'honors'],
});

export default async function AwardsPage() {
  const supabase = createClient();
  const { data: awards, error } = await supabase
    .from('awards')
    .select('*')
    .order('year', { ascending: false });

  const jsonLds = [
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Awards & Recognitions', url: absoluteUrl('/awards') },
    ]),
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }} />
      <div className="container mx-auto py-12 md:py-20">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Awards & Recognitions</span>
        </div>

        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold">Awards & Recognitions</h1>
          <p className="text-lg text-muted-foreground mt-2">Honored for my contributions and achievements.</p>
        </header>

        {error && (
          <p className="text-destructive mb-8">Unable to load awards at this time.</p>
        )}

        {!error && (!awards || awards.length === 0) ? (
          <p className="text-muted-foreground text-center">No awards are listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards?.map((award: any) => (
              <AwardCard key={award.id} award={award} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}