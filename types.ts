export interface Shortcut {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  shortcut: Shortcut | null;
  createdAt: number;
}
