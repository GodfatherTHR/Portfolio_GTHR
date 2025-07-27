import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Send, Phone, FlaskConical, GraduationCap, Info, School } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ContactForm from "../contact-form";
import { Button } from "../ui/button";

export default async function ContactSection() {
  const supabase = createClient();
  const { data: contactInfo } = await supabase.from("contactinfo").select().single();
  const { data: owner } = await supabase.from("portfolioowner").select().single();

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{contactInfo?.title || 'Get In Touch'}</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">{contactInfo?.description || "Have a project in mind or just want to say hi? I'd love to hear from you."}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo?.email && (
                  <div className="flex items-center gap-4">
                    <Send className="w-6 h-6 text-primary" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                )}
                 {contactInfo?.phone && (
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-primary" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 pt-4">
                  {owner?.github_url && <Button variant="outline" size="icon" asChild><Link href={owner.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile"><Github /></Link></Button>}
                  {owner?.linkedin_url && <Button variant="outline" size="icon" asChild><Link href={owner.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile"><Linkedin /></Link></Button>}
                  <Button variant="outline" size="icon" asChild><Link href="https://orcid.org/0009-0003-0832-5539" target="_blank" rel="noopener noreferrer" aria-label="ORCID Profile"><Info /></Link></Button>
                  <Button variant="outline" size="icon" asChild><Link href="https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=6ZjMFM0AAAAJ" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar Profile"><GraduationCap /></Link></Button>
                  <Button variant="outline" size="icon" asChild><Link href="https://www.researchgate.net/profile/Shariful-Haque-5?ev=hdr_xprf" target="_blank" rel="noopener noreferrer" aria-label="ResearchGate Profile"><FlaskConical /></Link></Button>
                  <Button variant="outline" size="icon" asChild><Link href="https://www.semanticscholar.org/author/Shariful-Haque/2321960937" target="_blank" rel="noopener noreferrer" aria-label="Semantic Scholar Profile"><School /></Link></Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
