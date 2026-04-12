import React from 'react';
import { asciiArt, asciiArtMobile } from '../../constants/ascii';

interface ASCIIBannerProps {
  isMobile: boolean;
}

const ASCIIBanner: React.FC<ASCIIBannerProps> = ({ isMobile }) => {
  const asciiArtToShow = isMobile ? asciiArtMobile : asciiArt;

  return (
    <pre 
      className={`whitespace-pre-wrap text-sm ${isMobile ? 'ascii-art' : ''}`}
      style={{ color: 'var(--terminal-light-green)' }}
    >
      {asciiArtToShow}
    </pre>
  );
};

export default ASCIIBanner;
