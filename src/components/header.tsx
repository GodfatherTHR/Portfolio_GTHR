import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type NavLink = {
  href: string;
  label: string;
  is_button: boolean;
};

export default async function Header() {
  const supabase = createClient();
  const { data: navigationItems } = await supabase
    .from("NavigationItems")
    .select()
    .order("id");

  const navLinks: NavLink[] =
    navigationItems?.map((item) => ({
      href: item.link,
      label: item.text,
      is_button: item.is_button,
    })) || [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block russo-one-regular">
              Shariful Haque
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {navLinks.filter(l => !l.is_button).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="mb-4 flex items-center">
                   <span className="font-bold russo-one-regular">Shariful Haque</span>
                </Link>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
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
  );
}
