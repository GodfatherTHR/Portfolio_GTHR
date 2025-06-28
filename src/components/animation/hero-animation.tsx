"use client";

import Balatro from '@/components/animation/Balatro';

export default function HeroAnimation() {
  return (
    <Balatro
      isRotate={true}
      mouseInteraction={false}
      pixelFilter={2000}
      color1="#6B46C1"
      color2="#333333"
      color3="#162325"
    />
  );
}
