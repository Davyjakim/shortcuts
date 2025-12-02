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

export enum AICommandType {
  IMPROVE = 'IMPROVE',
  FIX_SPELLING = 'FIX_SPELLING',
  SHORTER = 'SHORTER',
  LONGER = 'LONGER',
  CONTINUE = 'CONTINUE'
}

export interface AIRequest {
  text: string;
  command: AICommandType;
  context?: string;
}

export interface ToolbarState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isCode: boolean;
  blockType: string;
}