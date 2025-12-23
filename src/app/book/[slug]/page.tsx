import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, FileText, Info, Library } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: book } = await supabase
    .from('books')
    .select('title, description, image_url')
    .eq('slug', params.slug)
    .single();

  if (!book) {
    return {
      title: 'Book Not Found',
    }
  }

  return {
    title: book.title,
    description: book.description,
    openGraph: {
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
    .single()

  if (error || !book) {
    notFound()
  }

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

            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p>{book.description}</p>
            </div>

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

export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: books } = await supabase.from('books').select('slug').eq('status', 'published');
  return books || [];
}
