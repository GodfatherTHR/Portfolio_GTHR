"use client";

import dynamic from "next/dynamic";

const Dither = dynamic(() => import("@/components/animation/Dither"), {
  ssr: false,
});

export default function HeroAnimation() {
  return (
    <div className="absolute inset-0 z-0">
      <Dither
        waveColor={[0.5, 0.3, 0.5]}
        disableAnimation={false}
        enableMouseInteraction={true}
        mouseRadius={0.2}
        colorNum={24.4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.1}
      />
    </div>
  );
}
