export interface FABProps {
  onCommandExecute?: (command: string) => void;
}

export interface MenuItem {
  label: string;
  command: string;
  isDropdown?: boolean;
  subItems?: string[];
}

export interface FABMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCommandSelect: (command: string) => void;
}
