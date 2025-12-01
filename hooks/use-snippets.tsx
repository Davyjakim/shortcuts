// hooks/use-snippets.ts
'use client';

import { useState, useEffect } from 'react';

export interface Snippet {
  id: string;
  trigger: string; // e.g., ":email"
  content: string; // e.g., "johndoe@example.com"
  description: string;
}

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('text-expander-data');
    if (saved) {
      try {
        setSnippets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse snippets", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever snippets change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('text-expander-data', JSON.stringify(snippets));
    }
  }, [snippets, isLoaded]);

  const addSnippet = (snippet: Omit<Snippet, 'id'>) => {
    const newSnippet = { ...snippet, id: crypto.randomUUID() };
    setSnippets((prev) => [...prev, newSnippet]);
  };

  const removeSnippet = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  return { snippets, addSnippet, removeSnippet, isLoaded };
}