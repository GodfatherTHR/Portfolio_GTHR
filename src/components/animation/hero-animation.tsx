"use client";

import Balatro from '@/components/animation/Balatro';

export default function HeroAnimation() {
  return (
    <Balatro
      isRotate={true}
      mouseInteraction={false}
      pixelFilter={2000}
      color1="#A100A1"
      color2="#333333"
      color3="#D3D3D3"
    />
  );
}
