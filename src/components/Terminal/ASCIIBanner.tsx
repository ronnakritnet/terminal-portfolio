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

      {/* Terminal Intro and Profile Details - Always crisp and readable across all devices */}
      <div className="mt-3 text-xs sm:text-sm font-mono space-y-2 leading-relaxed" style={{ color: 'var(--terminal-light-green)' }}>
        <p className="text-gray-300">
          Welcome to Ronnakrit's Terminal <span className="text-green-400">[Version 1.0.1]</span>
          <br />
          <span className="text-gray-400">Authorized session.</span>
        </p>

        <div className="pt-1">
          <div className="text-green-400 font-bold mb-1">USER_PROFILE:</div>
          <div className="pl-2 sm:pl-4 space-y-0.5 text-gray-300">
            <div>- Role &nbsp; &nbsp; : <span className="text-white">Computer Engineering Student</span></div>
            <div>- Focus &nbsp; &nbsp;: <span className="text-white">Network Engineering &amp; Automation</span></div>
            <div>- Status &nbsp; : <span className="text-white">CCNA Preparation | Linux Enthusiast</span></div>
            <div>- Session &nbsp;: <span className="text-white">{sessionTime || 'Active'} (Active)</span></div>
          </div>
        </div>

        <div className="pt-1 text-gray-400 space-y-0.5 text-[11px] sm:text-xs">
          <div>* Type <span className="text-green-400 font-semibold">'help'</span> to explore available commands.</div>
          <div>* Type <span className="text-green-400 font-semibold">'about'</span> for more information.</div>
        </div>
      </div>
    </div>
  );
};

export default ASCIIBanner;
