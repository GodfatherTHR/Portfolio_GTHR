import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/rich-text";
import { buildPageMetadata } from "@/lib/seo";
import { jsonLdGraph, personSchema, breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Books",
  description:
    "Books authored or recommended by Shariful Haque — practical guides to data analytics, AI, and ERP systems for professionals.",
  path: "/book",
  keywords: ["Shariful Haque books", "data analytics books", "blockchain books", "AI books", "ERP books"],
});

function getBookExcerpt(description?: string | null) {
  if (!description) {
    return "";
  }

  return `${description.substring(0, 140)}${description.length > 140 ? "..." : ""}`;
}

export default async function BooksIndexPage() {
  const supabase = createClient();
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const jsonLds = [
    personSchema(),
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Books", url: absoluteUrl("/book") },
    ]),
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdGraph(jsonLds) }}
      />
      <div className="container mx-auto py-12 md:py-20">
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Books</span>
        </div>
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Homepage
            </Link>
          </Button>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold">Books</h1>
          <p className="text-lg text-muted-foreground mt-2">A collection of authored works and recommended reading.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books?.map((book) => (
            <Link key={book.id} href={`/book/${book.slug}`} className="block group">
              <Card className="flex flex-col overflow-hidden h-full group-hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  {book.image_url ? (
                    <Image
                      src={book.image_url}
                      alt={book.title}
                      width={400}
                      height={600}
                      className="w-full h-auto object-cover aspect-[2/3]"
                    />
                  ) : (
                    <div className="aspect-[2/3] w-full bg-secondary flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <CardTitle className="text-lg font-bold mb-2 group-hover:underline">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                  {book.description && (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                      <RichText content={getBookExcerpt(book.description)} />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-primary font-semibold flex items-center group-hover:underline">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
          {(!books || books.length === 0) && (
            <p className="col-span-full text-center text-muted-foreground">No published books found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
