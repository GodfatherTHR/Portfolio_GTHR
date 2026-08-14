

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GlareHover from "../animation/GlareHover";
import RichText from "../rich-text";

function getBookExcerpt(description?: string | null) {
  if (!description) {
    return "";
  }

  return `${description.substring(0, 100)}${description.length > 100 ? "..." : ""}`;
}

export default async function BooksSection() {
  const supabase = createClient();
  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !books || books.length === 0) {
    return null; // Don't render section if no published books
  }

  return (
    <section id="books" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Books</h2>
          <p className="text-lg text-muted-foreground mt-2">A collection of my authored works and recommended reading.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((book) => (
            <Link key={book.id} href={`/book/${book.slug}`} className="block group">
              <GlareHover
                className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col h-full"
              >
                <CardHeader className="p-0">
                  {book.image_url ? (
                    <Image
                      src={book.image_url}
                      alt={book.title}
                      width={400}
                      height={600}
                      className="w-full h-auto object-cover rounded-t-lg aspect-[2/3]"
                    />
                  ) : (
                    <div className="aspect-[2/3] w-full bg-secondary flex items-center justify-center rounded-t-lg">
                      <BookOpen className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <CardTitle className="text-lg font-bold mb-2 group-hover:underline">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                  <div className="text-sm text-muted-foreground">
                     <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                        <RichText content={getBookExcerpt(book.description)} />
                     </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto">
                  <div className="text-primary font-semibold flex items-center group-hover:underline">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardFooter>
              </GlareHover>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
