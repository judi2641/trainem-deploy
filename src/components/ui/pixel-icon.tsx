'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type IconVariant = 
  | 'dumbbell' 
  | 'calendar' 
  | 'chart' 
  | 'sparkle' 
  | 'user' 
  | 'settings' 
  | 'help' 
  | 'home' 
  | 'plus' 
  | 'check' 
  | 'x' 
  | 'edit' 
  | 'trash'
  | 'clock'
  | 'fire'
  | 'target'
  | 'play';

interface PixelIconProps extends React.SVGProps<SVGSVGElement> {
  variant: IconVariant;
  size?: 'sm' | 'md' | 'lg';
}

// Simple 8x8 pixel art icons rendered as SVG paths
const iconPaths: Record<IconVariant, string> = {
  dumbbell: 'M1,3h1v2h1v-3h2v3h1v-2h1v4h-1v-1h-1v1h-2v-1h-1v1h-1z M1,4h1v1h-1z M6,4h1v1h-1z',
  calendar: 'M1,1h6v1h-6z M1,2h1v1h-1z M6,2h1v1h-1z M1,3h6v4h-6z M2,4h1v1h-1z M4,4h1v1h-1z M2,5h1v1h-1z M5,5h1v1h-1z',
  chart: 'M1,6h1v1h-1z M2,5h1v2h-1z M3,4h1v3h-1z M4,3h1v4h-1z M5,2h1v5h-1z M6,1h1v6h-1z',
  sparkle: 'M3,0h1v1h-1z M3,1h1v1h-1z M1,3h1v1h-1z M2,3h1v1h-1z M3,2h1v3h-1z M4,3h1v1h-1z M5,3h1v1h-1z M3,5h1v1h-1z M3,6h1v1h-1z',
  user: 'M2,0h3v2h-3z M1,2h1v1h-1z M5,2h1v1h-1z M1,3h5v2h-5z M1,5h1v2h-1z M5,5h1v2h-1z',
  settings: 'M2,0h3v1h-3z M1,1h1v1h3v-1h1v2h-1v1h-3v-1h-1z M2,4h3v1h-3z M1,5h1v1h3v-1h1v2h-1v-1h-3v1h-1z',
  help: 'M2,0h3v1h-3z M1,1h1v1h-1z M5,1h1v1h-1z M5,2h1v1h-1z M4,3h1v1h-1z M3,4h1v1h-1z M3,6h1v1h-1z',
  home: 'M3,0h1v1h-1z M2,1h1v1h1v-1h1v1h-1v1h-1v-1h-1z M1,2h1v1h1v4h3v-4h1v-1h1v1h-1v5h-5v-5h-1z M3,5h1v2h-1z',
  plus: 'M3,1h1v2h2v1h-2v2h-1v-2h-2v-1h2z',
  check: 'M5,1h1v1h-1z M4,2h1v1h-1z M1,3h1v1h-1z M3,3h1v1h-1z M2,4h1v1h-1z',
  x: 'M1,1h1v1h-1z M5,1h1v1h-1z M2,2h1v1h-1z M4,2h1v1h-1z M3,3h1v1h-1z M2,4h1v1h-1z M4,4h1v1h-1z M1,5h1v1h-1z M5,5h1v1h-1z',
  edit: 'M5,0h1v1h-1z M4,1h1v1h-1z M3,2h1v1h-1z M2,3h1v1h-1z M1,4h1v1h-1z M0,5h2v2h-2z',
  trash: 'M2,0h3v1h2v1h-7v-1h2z M1,2h5v5h-5z M2,3h1v3h-1z M4,3h1v3h-1z',
  clock: 'M2,0h3v1h-3z M1,1h1v1h-1z M5,1h1v1h-1z M0,2h1v3h-1z M6,2h1v3h-1z M3,2h1v2h1v1h-2z M1,5h1v1h-1z M5,5h1v1h-1z M2,6h3v1h-3z',
  fire: 'M3,0h1v1h-1z M2,1h2v1h-2z M1,2h1v1h1v1h-1v1h1v1h-1v1h3v-1h-1v-1h1v-1h-1v-1h1v-1h1v4h-1v1h-3v-1h-1z',
  target: 'M2,0h3v1h-3z M1,1h1v1h-1z M5,1h1v1h-1z M0,2h1v3h-1z M6,2h1v3h-1z M2,2h3v1h-3z M2,3h1v1h1v1h-1v-1h-1z M4,3h1v1h-1z M2,4h3v1h-3z M1,5h1v1h-1z M5,5h1v1h-1z M2,6h3v1h-3z',
  play: 'M2,1h1v1h1v1h1v1h-1v1h-1v1h-1z',
};

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function PixelIcon({ variant, size = 'md', className, ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 7 7"
      fill="currentColor"
      className={cn(sizes[size], 'shrink-0', className)}
      style={{ imageRendering: 'pixelated' }}
      {...props}
    >
      <path d={iconPaths[variant]} />
    </svg>
  );
}
