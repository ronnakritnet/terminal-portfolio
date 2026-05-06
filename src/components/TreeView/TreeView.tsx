import React, { useState, useCallback } from 'react';
import TreeNode from './TreeNode';
import type { TreeViewProps, FileSystemNode } from './types';
import { pathArrayToString } from '../Terminal/utils/pathUtils';
import './TreeView.css';

const TreeView: React.FC<TreeViewProps> = ({ fileSystem, currentPath, onNodeSelect }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Generate unique key for a node based on its path
  const getNodeKey = useCallback((path: string[], name: string) => {
    return [...path, name].join('/');
  }, []);

  // Check if a node is currently selected
  const isNodeSelected = useCallback((nodePath: string[]) => {
    if (nodePath.length !== currentPath.length) return false;
    return nodePath.every((segment, index) => segment === currentPath[index]);
  }, [currentPath]);

  // Toggle expansion state for a directory
  const toggleNodeExpansion = useCallback((path: string[], name: string) => {
    const key = getNodeKey(path, name);
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, [getNodeKey]);

  // Auto-expand nodes that are in the current path
  React.useEffect(() => {
    const newExpandedNodes = new Set<string>();
    
    const expandPathNodes = (fs: Record<string, FileSystemNode>, path: string[], currentDepth: number = 0) => {
      if (currentDepth >= path.length) return;
      
      const segment = path[currentDepth];
      const node = fs[segment];
      
      if (node && node.type === 'directory') {
        const key = getNodeKey(path.slice(0, currentDepth), segment);
        newExpandedNodes.add(key);
        
        if (node.children) {
          expandPathNodes(node.children, path, currentDepth + 1);
        }
      }
    };
    
    expandPathNodes(fileSystem, currentPath);
    setExpandedNodes(newExpandedNodes);
  }, [fileSystem, currentPath, getNodeKey]);

  // Render tree nodes recursively
  const renderTreeNodes = useCallback((
    fs: Record<string, FileSystemNode>, 
    path: string[] = []
  ): React.ReactNode => {
    return Object.entries(fs)
      .sort(([a], [b]) => {
        // Directories first, then files, alphabetically
        const aIsDir = fs[a].type === 'directory';
        const bIsDir = fs[b].type === 'directory';
        
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        
        return a.localeCompare(b);
      })
      .map(([name, node]) => {
        const nodePath = [...path, name];
        const isExpanded = expandedNodes.has(getNodeKey(path, name));
        const isSelected = isNodeSelected(nodePath);

        return (
          <TreeNode
            key={getNodeKey(path, name)}
            node={node}
            level={path.length}
            path={path}
            isExpanded={isExpanded}
            isSelected={isSelected}
            onToggle={() => toggleNodeExpansion(path, name)}
            onSelect={onNodeSelect}
            name={name}
          />
        );
      });
  }, [expandedNodes, getNodeKey, isNodeSelected, toggleNodeExpansion, onNodeSelect]);

  return (
    <div className="tree-view px-6 py-4" role="tree" aria-label="File system tree">
      <div className="tree-view-header mb-4 pt-6">
        <h3 className="text-[10px] font-bold font-mono text-gray-500 tracking-[0.2em] uppercase">
          EXPLORER
        </h3>
      </div>
      <div className="tree-view-content">
        {renderTreeNodes(fileSystem)}
      </div>
    </div>
  );
};

export default React.memo(TreeView);
