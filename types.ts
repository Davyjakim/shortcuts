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

export interface Token {
  id: string;
  original: string;
  current: string;
  isChanged: boolean;
  type: 'word' | 'punctuation' | 'whitespace';
  alternatives?: string[];
}

export interface DictionaryEntry {
  synonyms: string[];
  pos?: 'noun' | 'verb' | 'adjective' | 'adverb';
}

export interface EngineSettings {
  strength: number; // 0 to 100
  preserveCapitalization: boolean;
  lockedWords: string[];
  mode: 'standard' | 'formal' | 'creative';
}


export interface ToolbarState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isCode: boolean;
  blockType: string;
}
export interface Bookmark {
  id: string;
  url: string;
  title: string;
 
  createdAt: number;
}

export type BookmarkFormData = Omit<Bookmark, 'id' | 'createdAt'>;


