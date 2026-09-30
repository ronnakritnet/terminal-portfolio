import React, { useState, useEffect } from 'react';
import { asciiLogo, asciiLogoMobile } from '../../constants/ascii';

interface ASCIIBannerProps {
  isMobile?: boolean;
}

const ASCIIBanner: React.FC<ASCIIBannerProps> = () => {
  const [sessionTime, setSessionTime] = useState<string>('');

  useEffect(() => {
    setSessionTime(new Date().toLocaleTimeString());
  }, []);

  return (
    <div className="select-none font-mono mb-4">
      {/* ASCII Logo Section - Scales dynamically so full 'RONNAKRIT' displays on tablet & desktop without breaking */}
      <div className="w-full overflow-hidden">
        {/* Screens >= 500px: Full 'RONNAKRIT' banner scaled smoothly */}
        <div className="hidden min-[500px]:block">
          <pre 
            className="font-mono text-[clamp(7.2px,1.6vw,14px)] leading-[1.12] whitespace-pre text-green-400 select-none overflow-x-hidden"
            style={{ color: 'var(--terminal-light-green)' }}
          >
            {asciiLogo}
          </pre>
        </div>

        {/* Small mobile (< 500px): Compact 'RON' banner */}
        <div className="block min-[500px]:hidden">
          <pre 
            className="font-mono text-xs sm:text-sm leading-[1.15] whitespace-pre text-green-400 select-none"
            style={{ color: 'var(--terminal-light-green)' }}
          >
            {asciiLogoMobile}
          </pre>
        </div>
      </div>

      {/* Terminal Intro and Profile Details - 100% green color, matches command outputs font size */}
      <pre 
        className="mt-3 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed"
        style={{ color: 'var(--terminal-light-green)' }}
      >
{`Welcome to Ronnakrit's Terminal [Version 1.0.1]
Authorized session.

USER_PROFILE:
  - Role     : Computer Engineering Student
  - Focus    : Network Engineering & Automation
  - Status   : CCNA Preparation | Linux Enthusiast
  - Session  : ${sessionTime || 'Active'} (Active)

* Type 'help' to explore available commands.
* Type 'about' for more information.`}
      </pre>
    </div>
  );
};

export default ASCIIBanner;
