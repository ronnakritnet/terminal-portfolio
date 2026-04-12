import React, { useState } from 'react';
import Navbar from './Navbar';
import Terminal from './Terminal/Terminal';

const App: React.FC = () => {
  const [externalCommand, setExternalCommand] = useState<string>('');

  const handleCommandExecute = (command: string) => {
    setExternalCommand(command);
    // Clear the command after a short delay to prevent re-execution
    setTimeout(() => setExternalCommand(''), 100);
  };

  return (
    <div className="h-[100dvh] bg-black flex flex-col">
      <Navbar onCommandExecute={handleCommandExecute} />
      <Terminal externalCommand={externalCommand} />
    </div>
  );
};

export default App;
