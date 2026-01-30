import React from 'react';

interface VibeSyncLogoProps {
  size?: number;
  variant?: 'full-color' | 'white' | 'black' | 'purple';
  className?: string;
}

export const VibeSyncLogo: React.FC<VibeSyncLogoProps> = ({ 
  size = 200, 
  variant = 'full-color',
  className = '' 
}) => {
  const renderFullColor = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#A259FF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6CD7FF', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FF64AA', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFC850', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="80" cy="100" r="45" fill="url(#gradient-purple)" opacity="0.8" />
      <circle cx="120" cy="100" r="45" fill="url(#gradient-pink)" opacity="0.8" />
      <circle cx="100" cy="100" r="25" fill="rgba(255, 255, 255, 0.15)" />
      <circle cx="100" cy="100" r="18" fill="url(#gradient-purple)" />
      <circle cx="100" cy="100" r="10" fill="white" opacity="0.3" />
    </svg>
  );

  const renderWhite = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="80" cy="100" r="45" fill="white" opacity="0.7" />
      <circle cx="120" cy="100" r="45" fill="white" opacity="0.5" />
      <circle cx="100" cy="100" r="25" fill="rgba(255, 255, 255, 0.3)" />
      <circle cx="100" cy="100" r="18" fill="white" />
      <circle cx="100" cy="100" r="10" fill="rgba(0, 0, 0, 0.2)" />
    </svg>
  );

  const renderBlack = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="80" cy="100" r="45" fill="#000000" opacity="0.7" />
      <circle cx="120" cy="100" r="45" fill="#000000" opacity="0.5" />
      <circle cx="100" cy="100" r="25" fill="rgba(0, 0, 0, 0.3)" />
      <circle cx="100" cy="100" r="18" fill="#000000" />
      <circle cx="100" cy="100" r="10" fill="rgba(255, 255, 255, 0.3)" />
    </svg>
  );

  const renderPurple = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="80" cy="100" r="45" fill="#A259FF" opacity="0.7" />
      <circle cx="120" cy="100" r="45" fill="#A259FF" opacity="0.5" />
      <circle cx="100" cy="100" r="25" fill="rgba(162, 89, 255, 0.3)" />
      <circle cx="100" cy="100" r="18" fill="#A259FF" />
      <circle cx="100" cy="100" r="10" fill="white" opacity="0.3" />
    </svg>
  );

  switch (variant) {
    case 'white':
      return renderWhite();
    case 'black':
      return renderBlack();
    case 'purple':
      return renderPurple();
    default:
      return renderFullColor();
  }
};

export default VibeSyncLogo;

// Usage examples:
// <VibeSyncLogo size={100} variant="full-color" />
// <VibeSyncLogo size={50} variant="white" className="hover:scale-110 transition" />
// <VibeSyncLogo size={200} variant="purple" />
