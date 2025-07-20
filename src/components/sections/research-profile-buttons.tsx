"use client";

import React from 'react';

interface ResearchProfile {
  id: number;
  name: string;
  icon: string;
  bg_color: string;
  text_color: string;
  url: string;
}

const ResearchProfileButtons: React.FC<{ profiles: ResearchProfile[] }> = ({ profiles }) => {
  const handleButtonClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-muted p-8 rounded-lg max-w-2xl mx-auto">
      <p className="text-muted-foreground text-center mb-6 text-lg">
        For my complete research profile, please visit:
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleButtonClick(profile.url)}
            className={`
              px-6 py-3 rounded-full
              flex items-center gap-3
              hover:opacity-90 hover:scale-105
              transition-all duration-200
              shadow-lg hover:shadow-xl
              font-medium
            `}
             style={{ 
                backgroundColor: profile.bg_color || '#6B46C1', 
                color: profile.text_color || '#FFFFFF' 
             }}
          >
            <span className="text-xl font-bold bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center text-sm">
              {profile.icon}
            </span>
            <span>{profile.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResearchProfileButtons;
