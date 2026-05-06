import type { FileSystemNode, PathArray } from '../Terminal/types';

export type { FileSystemNode };

export interface TreeNodeProps {
  node: FileSystemNode;
  level: number;
  path: PathArray;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onSelect: (node: FileSystemNode, path: PathArray) => void;
  name: string;
}

export interface TreeViewProps {
  fileSystem: Record<string, FileSystemNode>;
  currentPath: PathArray;
  onNodeSelect: (node: FileSystemNode, path: PathArray) => void;
}
