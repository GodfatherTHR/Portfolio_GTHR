
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from 'date-fns';
import { Badge } from "../ui/badge";

export default async function NewsSection() {
  const supabase = createClient();
  const { data: articles, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("published_date", { ascending: false });

  if (error || !articles || articles.length === 0) {
    return null; // Don't render section if no articles
  }

  return (
    <section id="news" className="py-16 md:py-24 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">News & Press</h2>
          <p className="text-lg text-muted-foreground mt-2">Media mentions, interviews, and articles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
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
                    <Image src={article.publication_logo_url} alt={`${article.publication_name} logo`} width={40} height={40} className="rounded-full border object-contain"/>
                  )}
                  <div className="flex-grow">
                     <CardTitle className="text-lg">{article.title}</CardTitle>
                     <p className="text-sm text-muted-foreground">{article.publication_name}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
                </CardContent>
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
      </div>
    </section>
  );
}
