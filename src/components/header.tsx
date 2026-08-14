import { createClient } from "@/lib/supabase/server";
import HeaderClient from "./header-client";

export default async function Header() {
  const supabase = createClient();
  const { data: navigationItems } = await supabase
    .from("navigationitems")
    .select()
    .order("id");

  const navLinks = (navigationItems || []).map((item: any) => ({
    href: item.link,
    label: item.text,
    is_button: item.is_button,
  }));

  // Reorder: move Resume right after About if it appears later.
  const aboutIndex = navLinks.findIndex((link) => link.label.toLowerCase() === 'about');
  const resumeIndex = navLinks.findIndex((link) => link.label.toLowerCase() === 'resume');
  if (aboutIndex !== -1 && resumeIndex !== -1 && resumeIndex > aboutIndex) {
    const [resumeLink] = navLinks.splice(resumeIndex, 1);
    navLinks.splice(aboutIndex + 1, 0, resumeLink);
  }

  // Inject News/Books after Awards if present.
  const awardsIndex = navLinks.findIndex((link) => link.label === 'Awards');
  if (awardsIndex !== -1) {
    if (!navLinks.some((l) => l.href === '/#news')) {
      navLinks.splice(awardsIndex + 1, 0, { href: '/#news', label: 'News', is_button: false });
    }
    if (!navLinks.some((l) => l.href === '/#books')) {
      navLinks.splice(awardsIndex + 2, 0, { href: '/#books', label: 'Books', is_button: false });
    }
  }

  // Add blog link if not present.
  if (!navLinks.some((link) => link.href === '/blog')) {
    const contactIndex = navLinks.findIndex((link) => link.label.toLowerCase() === 'contact');
    if (contactIndex !== -1) {
      navLinks.splice(contactIndex, 0, { href: '/blog', label: 'Blog', is_button: false });
    } else {
      navLinks.push({ href: '/blog', label: 'Blog', is_button: false });
    }
  }

  return <HeaderClient navLinks={navLinks} />;
}
