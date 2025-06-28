"use client";

import Balatro from '@/components/animation/Balatro';

export default function HeroAnimation() {
  return (
    <Balatro
      isRotate={true}
      mouseInteraction={false}
      pixelFilter={2000}
    />
  );
}
