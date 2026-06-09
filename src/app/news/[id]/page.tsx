import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News | Shariful Haque",
  description: "Latest news and updates about Shariful Haque.",
  robots: { index: false, follow: false },
};

export default function NewsArticlePage() {
  return null;
}

export async function generateStaticParams() {
  return [];
}
