import React from 'react';
import { asciiArt, asciiArtMobile } from '../../constants/ascii';

interface ASCIIBannerProps {
  isMobile: boolean;
}

const ASCIIBanner: React.FC<ASCIIBannerProps> = () => {
  return (
    <div className="select-none font-mono">
      {/* Mobile banner (< sm / < 640px): Compact 'RON' */}
      <div className="block sm:hidden">
        <pre 
          className="whitespace-pre overflow-x-auto text-[11px] leading-tight"
          style={{ color: 'var(--terminal-light-green)' }}
        >
          {asciiArtMobile}
        </pre>
      </div>

      {/* Screen >= sm (>= 640px): Full 'RONNAKRIT' banner */}
      <div className="hidden sm:block">
        <pre 
          className="whitespace-pre overflow-x-auto text-[10px] sm:text-[11.5px] md:text-xs lg:text-sm leading-tight"
          style={{ color: 'var(--terminal-light-green)' }}
        >
          {asciiArt}
        </pre>
      </div>
    </div>
  );
};

export default ASCIIBanner;
