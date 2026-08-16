import React from 'react';
import { Icon } from '@chakra-ui/react';

/**
 * Official Apple Maps App Icon SVG
 * Circular icon with map grid, roads, and blue navigation arrow badge
 */
export const AppleMapsIcon = (props) => (
  <Icon viewBox="0 0 100 100" boxSize="18px" borderRadius="full" overflow="hidden" {...props}>
    <defs>
      <clipPath id="apple-maps-clip">
        <circle cx="50" cy="50" r="50" />
      </clipPath>
      <linearGradient id="apple-maps-blue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2F80ED" />
        <stop offset="100%" stopColor="#0056C6" />
      </linearGradient>
    </defs>
    
    <g clipPath="url(#apple-maps-clip)">
      {/* Background base */}
      <rect width="100" height="100" fill="#E5E5EA" />
      
      {/* Green park / land area (top & right) */}
      <path d="M40,0 L100,0 L100,65 Q70,45 55,25 Z" fill="#62D368" />
      <path d="M65,55 Q85,50 100,60 L100,90 L75,85 Z" fill="#58CC02" />
      
      {/* Yellow / orange block (bottom right) */}
      <path d="M50,70 L100,85 L100,100 L45,100 Z" fill="#FFCC00" />
      
      {/* Pink / red residential area (bottom left) */}
      <path d="M0,60 Q25,65 35,100 L0,100 Z" fill="#FF6961" />
      
      {/* White roads / intersection */}
      <path d="M0,35 Q40,38 50,0 L64,0 Q54,42 100,48 L100,62 Q45,55 35,100 L20,100 Q30,50 0,48 Z" fill="#FFFFFF" />
      
      {/* Blue primary route line */}
      <path d="M48,0 Q43,35 0,38 L0,44 Q46,41 52,0 Z" fill="#007AFF" opacity="0.9" />
      <path d="M50,25 Q50,45 80,50 L80,54 Q46,49 46,25 Z" fill="#007AFF" opacity="0.9" />
      
      {/* Blue location badge with white arrow */}
      <circle cx="48" cy="52" r="22" fill="url(#apple-maps-blue-grad)" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" />
      <circle cx="48" cy="52" r="20" fill="#007AFF" />
      
      {/* White Navigation Arrow */}
      <path
        d="M48,39 L57,59 L48,54.5 L39,59 Z"
        fill="#FFFFFF"
      />
    </g>
  </Icon>
);

/**
 * Official Google Maps Multi-Color Pin Icon SVG
 */
export const GoogleMapsIcon = (props) => (
  <Icon viewBox="0 0 100 100" boxSize="18px" {...props}>
    <g>
      {/* Red Top */}
      <path d="M50,10 C34,10 21,23 21,39 C21,52 32,66 50,90 C68,66 79,52 79,39 C79,23 66,10 50,10 Z" fill="#EA4335" />
      {/* Blue / Green / Yellow pin segments */}
      <path d="M50,90 C50,90 32,66 21,39 C21,37 21.2,35 21.5,33 L50,65 Z" fill="#4285F4" opacity="0.3" />
      <path d="M50,10 C66,10 79,23 79,39 C79,52 68,66 50,90 L50,55 Z" fill="#EA4335" />
      <path d="M21.5,33 C23.5,23 32,15 42,11 L50,55 Z" fill="#FBBC04" />
      <path d="M42,11 C44.6,10.3 47.3,10 50,10 L50,55 Z" fill="#EA4335" />
      <path d="M21.5,33 L50,65 L50,90 C36,71 23,54 21.5,33 Z" fill="#34A853" />
      <path d="M50,65 L78.5,33 C77,54 64,71 50,90 Z" fill="#4285F4" />
      
      {/* Center White Hole */}
      <circle cx="50" cy="38" r="13" fill="#FFFFFF" />
      <circle cx="50" cy="38" r="8" fill="#D93025" />
    </g>
  </Icon>
);
