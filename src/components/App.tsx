import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Terminal from './Terminal/Terminal';
import Footer from './Footer';
import FAB from './FAB';

const App: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex flex-col flex-1">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-green-400 font-mono">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col flex-1">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Terminal />
      </div>
      <Footer />
      <FAB />
    </div>
  );
};

export default App;
