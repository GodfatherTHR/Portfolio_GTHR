import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Send } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Profile = {
  contact_email: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
};

export default async function ContactSection() {
  const supabase = createClient();
  const { data } = await supabase.from("profile").select("contact_email, social_links").single();

  const profile: Profile = data || {
    contact_email: "",
    social_links: {},
  };

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold russo-one-regular">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mt-2">Have a project in mind or just want to say hi? I'd love to hear from you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Find me on these platforms or send me an email.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.contact_email && (
                  <div className="flex items-center gap-4">
                    <Send className="w-6 h-6 text-primary" />
                    <a href={`mailto:${profile.contact_email}`} className="hover:text-primary transition-colors">
                      {profile.contact_email}
                    </a>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  {profile.social_links?.github && <Button variant="outline" size="icon" asChild><Link href={profile.social_links.github} target="_blank"><Github /></Link></Button>}
                  {profile.social_links?.linkedin && <Button variant="outline" size="icon" asChild><Link href={profile.social_links.linkedin} target="_blank"><Linkedin /></Link></Button>}
                  {profile.social_links?.twitter && <Button variant="outline" size="icon" asChild><Link href={profile.social_links.twitter} target="_blank"><Twitter /></Link></Button>}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>Your message will be sent directly to my inbox.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" required />
                  <Input type="email" placeholder="Your Email" required />
                </div>
                <Textarea placeholder="Your Message" rows={5} required />
                <Button type="submit" className="w-full">
                  Send Message <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
