'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from './ui/button';
import { Linkedin } from 'lucide-react';
import ResearchGateIcon from './icons/researchgate-icon';
import GoogleScholarIcon from './icons/googlescholar-icon';
import OrcidIcon from './icons/orcid-icon';

const iconMap: { [key: string]: React.ReactNode } = {
  researchgate: <ResearchGateIcon className="h-5 w-5" />,
  googlescholar: <GoogleScholarIcon className="h-5 w-5" />,
  orcid: <OrcidIcon className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />
};

export default function Footer() {
  const [currentYear, setCurrentYear] = useState('');
  const [owner, setOwner] = useState<any>(null);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [researchProfiles, setResearchProfiles] = useState<any[]>([]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
    const supabase = createClient();
    
    async function fetchData() {
      const { data: ownerData } = await supabase.from("portfolioowner").select().single();
      setOwner(ownerData);

      const { data: subtitlesData } = await supabase.from("herosubtitles").select().order('id');
      setSubtitles(subtitlesData || []);

      const { data: profilesData } = await supabase.from("researchprofiles").select().order('id');
      setResearchProfiles(profilesData || []);
    }

    fetchData();

  }, []);

  const subtitleText = subtitles.map(s => s.subtitle_text).join(' | ');

  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold russo-one-regular">{owner?.name || 'Shariful Haque'}</h3>
            <p className="text-muted-foreground">{subtitleText || 'Data Analytics | Blockchain Innovator | Researcher'}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            {owner?.linkedin_url && (
                 <Button variant="ghost" size="icon" asChild>
                    <Link href={owner.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5"/>
                    </Link>
                </Button>
            )}
            {researchProfiles.map(profile => (
                <Button key={profile.id} variant="ghost" size="icon" asChild>
                    <Link href={profile.url} target="_blank" rel="noopener noreferrer" aria-label={profile.name}>
                        {iconMap[profile.icon] || <Info className="h-5 w-5" />}
                    </Link>
                </Button>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border/50 my-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} {owner?.name || 'Shariful Haque'}. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="#" className="hover:text-foreground">Terms of Use</Link>
             <span className="text-muted-foreground">•</span>
            <p>Built with React.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}