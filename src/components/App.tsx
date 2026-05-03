import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Terminal from './Terminal/Terminal';
import Footer from './Footer';

const App: React.FC = () => {
  const [externalCommand, setExternalCommand] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCommandExecute = (command: string) => {
    setExternalCommand(command);
    // Clear command after a short delay to prevent re-execution
    setTimeout(() => setExternalCommand(''), 100);
  };

  if (!isMounted) {
    return (
      <div className="h-[100dvh] bg-black flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-green-400 font-mono">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-black flex flex-col">
      <Navbar onCommandExecute={handleCommandExecute} />
      <main className="flex-1">
        <Terminal externalCommand={externalCommand} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
