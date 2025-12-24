
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";

type NavLink = {
  href: string;
  label: string;
  is_button: boolean;
};

export default function Header() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNavItems = async () => {
      const supabase = createClient();
      const { data: navigationItems } = await supabase
        .from("navigationitems")
        .select()
        .order("id");

      let links: NavLink[] =
        navigationItems?.map((item: any) => ({
          href: item.link,
          label: item.text,
          is_button: item.is_button,
        })) || [];
      
      const aboutIndex = links.findIndex(link => link.label.toLowerCase() === 'about');
      const resumeIndex = links.findIndex(link => link.label.toLowerCase() === 'resume');

      if (aboutIndex !== -1 && resumeIndex !== -1 && resumeIndex > aboutIndex) {
        const [resumeLink] = links.splice(resumeIndex, 1);
        links.splice(aboutIndex + 1, 0, resumeLink);
      }
      
      const awardsIndex = links.findIndex(link => link.label === 'Awards');
      if (awardsIndex !== -1) {
        links.splice(awardsIndex + 1, 0, { href: '/#books', label: 'Books', is_button: false });
      }

      // Manually add blog link if not present
      if (!links.find(link => link.href === '/blog')) {
        const contactIndex = links.findIndex(link => link.label.toLowerCase() === 'contact');
        if (contactIndex !== -1) {
          links.splice(contactIndex, 0, { href: '/blog', label: 'Blog', is_button: false });
        } else {
          links.push({ href: '/blog', label: 'Blog', is_button: false });
        }
      }
      setNavLinks(links);
    };

    fetchNavItems();
  }, []);

  const handleBlogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    router.push('/blog');
  };

  const isBlogLink = (link: NavLink) => link.href === '/blog';

  return (
    <>
      {isLoading && <LoadingSkeleton />}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold sm:inline-block">
                Shariful Haque
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              {navLinks.filter(l => !l.is_button).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-foreground/80 text-foreground"
                >
                  {link.label}
                </Link>
              ))}
               {navLinks.filter(l => l.is_button).map((link) => (
                  <Button key={link.href} asChild size="sm">
                      <Link href={link.href}>{link.label}</Link>
                  </Button>
              ))}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <Link href="/" className="mb-4 flex items-center" onClick={() => setMobileMenuOpen(false)}>
                     <span className="font-bold">Shariful Haque</span>
                  </Link>
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                        onClick={(e) => {
                          if (isBlogLink(link)) {
                            handleBlogClick(e);
                          }
                          setMobileMenuOpen(false);
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <nav className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                 <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Admin Login</span>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
