import React from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, FileText, Code, Braces } from 'lucide-react';
import type { TreeNodeProps } from './types';

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  level, 
  path, 
  isExpanded, 
  isSelected, 
  onToggle, 
  onSelect,
  name 
}) => {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'md':
        return <FileText size={16} />;
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <Code size={16} />;
      case 'json':
        return <Braces size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const handleClick = () => {
    if (node.type === 'directory') {
      onToggle();
    }
    onSelect(node, [...path, name]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="tree-node-container">
      <div
        className={`tree-node ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="treeitem"
        aria-expanded={node.type === 'directory' ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={0}
      >
        {node.type === 'directory' && (
          <span className="tree-node-arrow">
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
        
        <span className="tree-node-icon">
          {node.type === 'directory' ? (
            isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
          ) : (
            getFileIcon(name)
          )}
        </span>
        
        <span className="tree-node-label">{name}</span>
        
        {node.type === 'directory' && (
          <span className="tree-node-suffix">/</span>
        )}
      </div>
      
      {node.type === 'directory' && isExpanded && node.children && (
        <div className="tree-node-children">
          {Object.entries(node.children)
            .sort(([a], [b]) => {
              // Directories first, then files, alphabetically
              const aIsDir = node.children![a].type === 'directory';
              const bIsDir = node.children![b].type === 'directory';
              
              if (aIsDir && !bIsDir) return -1;
              if (!aIsDir && bIsDir) return 1;
              
              return a.localeCompare(b);
            })
            .map(([childName, childNode]) => (
              <TreeNode
                key={childName}
                node={childNode}
                level={level + 1}
                path={[...path, name]}
                isExpanded={false} // Individual expansion state managed by parent
                isSelected={false} // Selection state managed by parent
                onToggle={() => {}} // Toggle handled by parent
                onSelect={onSelect}
                name={childName}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(TreeNode);
