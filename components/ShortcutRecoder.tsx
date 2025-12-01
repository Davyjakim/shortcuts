import React, { useState, useEffect } from 'react';
import { simpleCn as cn } from '@/lib/utils';
import { Shortcut } from '@/types';
import { Keyboard } from 'lucide-react';

interface ShortcutRecorderProps {
  value: Shortcut | null;
  onChange: (shortcut: Shortcut | null) => void;
}

export const ShortcutRecorder: React.FC<ShortcutRecorderProps> = ({ value, onChange }) => {
  const [recording, setRecording] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Helper to format shortcut for display
  const formatShortcut = (s: Shortcut) => {
    const parts = [];
    if (s.ctrlKey) parts.push('Ctrl');
    if (s.shiftKey) parts.push('Shift');
    if (s.altKey) parts.push('Alt');
    if (s.metaKey) parts.push('Cmd');
    parts.push(s.key.toUpperCase());
    return parts.join(' + ');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!recording) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Prevent single modifier keys from triggering completion
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
      return;
    }

    const newShortcut: Shortcut = {
      key: e.key,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
    };

    onChange(newShortcut);
    setRecording(false);
  };

  // Click outside to cancel recording handling could be added, but simple focus-out is usually enough
  // Here we just use a button to toggle recording state

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Shortcut
      </label>
      <div 
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all hover:bg-accent/50 cursor-pointer items-center justify-between",
          recording ? "ring-2 ring-ring ring-offset-2 border-primary" : ""
        )}
        onClick={() => setRecording(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        onBlur={() => setRecording(false)}
      >
        <span className={cn("flex items-center gap-2", !value && !recording && "text-muted-foreground")}>
          <Keyboard className="w-4 h-4" />
          {recording 
            ? "Press keys now..." 
            : value 
              ? formatShortcut(value) 
              : "Click to record shortcut"}
        </span>
        {value && (
          <button 
            type="button"
            className="text-xs text-muted-foreground hover:text-destructive p-1 rounded-sm z-10"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          >
            Clear
          </button>
        )}
      </div>
      <p className="text-[0.8rem] text-muted-foreground">
        Click the box and press a key combination (e.g., Ctrl + B).
      </p>
    </div>
  );
};
