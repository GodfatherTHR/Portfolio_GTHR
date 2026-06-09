import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, FileText, Info, Library, Terminal } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { extractFirstUrl, normalizeBookEmbedUrl } from '@/lib/book-embed'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const dynamic = 'force-dynamic'

type DescriptionBlock =
  | { type: 'markdown'; content: string }
  | { type: 'iframe'; src: string; title: string };

function getIframeAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`${attribute}=(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? null;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, '&');
}

function hasIframeMarkup(value?: string | null) {
  if (!value) {
    return false;
  }

  const decodedValue = decodeHtmlEntities(value);
  return /<iframe\b[\s\S]*?<\/iframe>/i.test(decodedValue);
}

function buildDescriptionBlocks(description?: string | null): DescriptionBlock[] {
  if (!description) {
    return [];
  }

  const decodedDescription = decodeHtmlEntities(description);
  const iframeRegex = /<iframe\b[\s\S]*?<\/iframe>/gi;
  const blocks: DescriptionBlock[] = [];
  let lastIndex = 0;

  for (const match of decodedDescription.matchAll(iframeRegex)) {
    const iframeTag = match[0];
    const matchIndex = match.index ?? 0;
    const markdownBefore = decodedDescription.slice(lastIndex, matchIndex).trim();

    if (markdownBefore) {
      blocks.push({ type: 'markdown', content: markdownBefore });
    }

    const src = getIframeAttribute(iframeTag, 'src');
    const normalizedSrc = src ? normalizeBookEmbedUrl(src) : null;

    if (normalizedSrc) {
      blocks.push({
        type: 'iframe',
        src: normalizedSrc,
        title: getIframeAttribute(iframeTag, 'title') || 'Embedded book content',
      });
    }

    lastIndex = matchIndex + iframeTag.length;
  }

  const markdownAfter = decodedDescription.slice(lastIndex).trim();
  if (markdownAfter) {
    blocks.push({ type: 'markdown', content: markdownAfter });
  }

  if (blocks.length === 0) {
    const detectedUrl = extractFirstUrl(decodedDescription);
    const normalizedSrc = detectedUrl ? normalizeBookEmbedUrl(detectedUrl) : null;

    if (normalizedSrc) {
      return [
        {
          type: 'iframe',
          src: normalizedSrc,
          title: 'Embedded book content',
        },
      ];
    }
  }

  return blocks;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: book } = await supabase
    .from('books')
    .select('title, description, image_url')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!book) {
    return {
      title: 'Book Not Found',
    }
  }

  const url = `https://www.sharifulhaque.org/book/${params.slug}`;

  return {
    title: book.title,
    description: book.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: book.title,
      description: book.description,
      url,
      type: 'book',
      images: book.image_url ? [{ url: book.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description: book.description,
      images: book.image_url ? [book.image_url] : [],
    },
  }
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    return (
      <div className="container max-w-3xl mx-auto py-12 md:py-20">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/book">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Book Could Not Be Loaded</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!book) {
    notFound()
  }

  const descriptionBlocks = buildDescriptionBlocks(book.description);
  const renderDescriptionAsHtml = hasIframeMarkup(book.description);

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-5xl py-12 md:py-20">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/#books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Books
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1">
            {book.image_url ? (
              <Image
                src={book.image_url}
                alt={book.title}
                width={400}
                height={600}
                className="rounded-lg shadow-lg object-cover w-full aspect-[2/3]"
              />
            ) : (
              <div className="aspect-[2/3] w-full bg-secondary flex items-center justify-center rounded-lg">
                <BookOpen className="w-24 h-24 text-muted-foreground" />
              </div>
            )}
            {book.link && (
                <Button asChild size="lg" className="w-full mt-6">
                    <Link href={book.link} target="_blank" rel="noopener noreferrer">
                        Purchase or View
                    </Link>
                </Button>
            )}
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{book.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">by {book.author}</p>

            {renderDescriptionAsHtml && book.description ? (
              <div
                className="mb-8 [&_iframe]:w-full [&_iframe]:min-h-[520px] [&_iframe]:rounded-2xl [&_iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(book.description) }}
              />
            ) : descriptionBlocks.length > 0 && (
              <div className="mb-8 space-y-6">
                {descriptionBlocks.map((block, index) =>
                  block.type === 'iframe' ? (
                    <div key={`${block.src}-${index}`} className="not-prose overflow-hidden rounded-2xl border bg-card shadow-sm">
                      <div className="aspect-[16/10] w-full">
                        <iframe
                          src={block.src}
                          title={block.title}
                          className="h-full w-full border-0"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>
                    </div>
                  ) : (
                    <div key={`markdown-${index}`} className="prose prose-lg dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {block.content}
                      </ReactMarkdown>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="space-y-4 text-sm border-t pt-6">
                {book.publisher && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Library className="w-5 h-5 text-primary" />
                        <div>
                            <strong>Publisher:</strong> {book.publisher}
                        </div>
                    </div>
                )}
                {book.published_at && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                            <strong>Published:</strong> {format(new Date(book.published_at), 'MMMM yyyy')}
                        </div>
                    </div>
                )}
                {book.page_count && (
                     <div className="flex items-center gap-3 text-muted-foreground">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                            <strong>Pages:</strong> {book.page_count}
                        </div>
                    </div>
                )}
                {book.isbn && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Info className="w-5 h-5 text-primary" />
                        <div>
                            <strong>ISBN:</strong> {book.isbn}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
