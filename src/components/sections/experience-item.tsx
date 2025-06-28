'use client';

import { Briefcase } from "lucide-react";
import type { Experience } from "./experience-section";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ExperienceItem({ job, index }: { job: Experience; index: number }) {
  return (
    <div className="relative mb-8 md:mb-12">
      <div className="md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 p-2 bg-primary rounded-full">
        <Briefcase className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className={`flex ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} md:items-center w-full`}>
        <div className="w-full md:w-5/12">
          <div className={`p-6 rounded-lg shadow-md bg-card border ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
            <p className="text-sm text-muted-foreground">
              {formatDate(job.start_date)} - {job.end_date ? formatDate(job.end_date) : 'Present'}
            </p>
            <h3 className="text-xl font-bold mt-1 text-primary">{job.role}</h3>
            <p className="text-lg font-semibold">{job.company}</p>
            <p className="mt-2 text-card-foreground/80">{job.description}</p>
          </div>
        </div>
         <div className="w-2/12 hidden md:block"></div>
      </div>
    </div>
  );
}
