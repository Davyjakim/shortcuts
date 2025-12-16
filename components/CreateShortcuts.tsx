"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Copy, Search, Command, X, Edit2 } from "lucide-react";
import { nanoid } from "nanoid";

import { Snippet, Shortcut } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShortcutRecorder } from "@/components/ShortcutRecoder";

export default function CreateShortcuts() {
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>(
    "snapkey-snippets",
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
const [isClient, setIsClient] = useState(false);
  // Edit State
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formShortcut, setFormShortcut] = useState<Shortcut | null>(null);

  // Global Shortcut Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Find matching snippet
      const match = snippets.find((s) => {
        if (!s.shortcut) return false;
        return (
          e.key.toLowerCase() === s.shortcut.key.toLowerCase() &&
          e.ctrlKey === s.shortcut.ctrlKey &&
          e.shiftKey === s.shortcut.shiftKey &&
          e.altKey === s.shortcut.altKey &&
          e.metaKey === s.shortcut.metaKey
        );
      });

      if (match) {
        e.preventDefault();
        copyToClipboard(match.content);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [snippets]);
useEffect(() => {
    setIsClient(true);
  }, []);
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() =>
        toast.success("Copied to clipboard!", {
          style: {
            background: "#333",
            color: "#fff",
          },
        })
      )
      .catch(() => toast.error("Failed to copy"));
  };

  const openModal = (snippet?: Snippet) => {
    if (snippet) {
      setEditingSnippetId(snippet.id);
      setFormTitle(snippet.title);
      setFormContent(snippet.content);
      setFormShortcut(snippet.shortcut);
    } else {
      setEditingSnippetId(null);
      setFormTitle("");
      setFormContent("");
      setFormShortcut(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSnippetId(null);
  };

  const saveSnippet = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Title and content are required");
      return;
    }

    if (editingSnippetId) {
      // Update
      setSnippets((prev) =>
        prev.map((s) =>
          s.id === editingSnippetId
            ? {
                ...s,
                title: formTitle,
                content: formContent,
                shortcut: formShortcut,
              }
            : s
        )
      );
      toast.success("Snippet updated");
    } else {
      // Create
      const newSnippet: Snippet = {
        id: nanoid(),
        title: formTitle,
        content: formContent,
        shortcut: formShortcut,
        createdAt: Date.now(),
      };
      setSnippets((prev) => [newSnippet, ...prev]);
      toast.success("Snippet created");
    }
    closeModal();
  };

  const deleteSnippet = (id: string) => {
    if (confirm("Are you sure you want to delete this snippet?")) {
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      toast.success("Snippet deleted");
    }
  };

  const filteredSnippets = snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatShortcutString = (s: Shortcut | null) => {
    if (!s) return null;
    const parts = [];
    if (s.ctrlKey) parts.push("Ctrl");
    if (s.shiftKey) parts.push("Shift");
    if (s.altKey) parts.push("Alt");
    if (s.metaKey) parts.push("Cmd");
    parts.push(s.key.toUpperCase());
    return parts.join("+");
  };

  return (
    <div className=" bg-background text-foreground p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            
            <p className="text-muted-foreground">
              Your personal snippet library. Press shortcuts to copy instantly.
            </p>
          </div>
          <Button onClick={() => openModal()} className="shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> New Snippet
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            className="pl-9 h-11 bg-card/50"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Option 1: Render Snippets wrapped in Suspense for potential async children */}
  <Suspense
    fallback={
      <div className="col-span-full py-12 text-center text-muted-foreground">
        Loading snippets...
      </div>
    }
  >
    {/* This is a better place for your logic now: */}
    {filteredSnippets.length > 0 ? filteredSnippets.map((snippet) => (
              <Card
                key={snippet.id}
                className="group relative transition-all hover:border-primary/50 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight truncate pr-4">
                      {snippet.title}
                    </CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-card p-1 rounded-md shadow-sm border">
                      <button
                        onClick={() => openModal(snippet)}
                        className="p-1.5 hover:bg-accent rounded-sm text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSnippet(snippet.id)}
                        className="p-1.5 hover:bg-destructive/10 rounded-sm text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-md  text-sm text-muted-foreground font-mono break-all line-clamp-4">
                    {snippet.content}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {snippet.shortcut ? (
                        <span className="inline-flex items-center rounded-md border bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                          {formatShortcutString(snippet.shortcut)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No shortcut
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(snippet.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
        
    )) : (
      // Render the 'No snippets found' if the list is empty *after* data is loaded
      <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-card/10">
        <p>
          {snippets.length === 0 && searchQuery === ""
            ? "No snippets found. Create one to get started!"
            : "No snippets match your search criteria."}
        </p>
      </div>
    )}
  </Suspense>
  
  {/* The second conditional is now covered by the new ternary above:
  {filteredSnippets.length === 0 && (
    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-card/10">
      <p>No snippets found. Create one to get started!</p>
    </div>
  )}
  */}
</div>
    
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border shadow-lg w-full max-w-lg rounded-lg animate-in fade-in zoom-in-95 duration-200 p-6 space-y-6 relative">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </button>

            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                {editingSnippetId ? "Edit Snippet" : "Create Snippet"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Save text to clipboard easily. Assign a shortcut for quick
                access.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="E.g. Daily Standup Template"
                  value={formTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormTitle(e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Type the text you want to save..."
                  className="min-h-[120px] font-mono"
                  value={formContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormContent(e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <ShortcutRecorder
                  value={formShortcut}
                  onChange={setFormShortcut}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={saveSnippet}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
