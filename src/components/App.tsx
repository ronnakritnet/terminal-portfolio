import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import Terminal from './Terminal/Terminal';
import Footer from './Footer';
import TreeView from './TreeView';
import { fileSystem } from './Terminal/data/fileSystem';
import type { FileSystemNode, PathArray } from './Terminal/types';

const App: React.FC = () => {
  const [externalCommand, setExternalCommand] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathArray>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCommandExecute = useCallback((command: string) => {
    setExternalCommand(command);
    // Clear command after a short delay to prevent re-execution
    setTimeout(() => setExternalCommand(''), 100);
  }, []);

  const handleNodeSelect = useCallback((node: FileSystemNode, path: PathArray) => {
    if (node.type === 'directory') {
      // Navigate to directory
      const pathString = path.length === 0 ? '~' : `~/${path.join('/')}`;
      handleCommandExecute(`cd ${pathString}`);
    } else {
      // Display file content
      const pathString = path.length === 0 ? path[path.length - 1] : `${path.join('/')}/${path[path.length - 1]}`;
      handleCommandExecute(`cat ${pathString}`);
    }
  }, [handleCommandExecute]);

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
    <div className="h-[100dvh] bg-black flex flex-col overflow-hidden">
      <Navbar onCommandExecute={handleCommandExecute} />
      <main className="flex-1 flex overflow-hidden">
        <aside className="hidden md:block w-[260px] bg-gray-800 border-r border-gray-800/10 flex-shrink-0 h-full overflow-y-auto scroll-smooth overscroll-contain pt-16" style={{ WebkitOverflowScrolling: 'touch' }}>
          <TreeView 
            fileSystem={fileSystem} 
            currentPath={currentPath} 
            onNodeSelect={handleNodeSelect} 
          />
        </aside>
        <div className="flex-1 overflow-hidden">
          <Terminal 
            externalCommand={externalCommand} 
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
