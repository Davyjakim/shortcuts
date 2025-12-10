"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Bookmark, BookmarkFormData } from "@/types";
import { getStoredBookmarks, saveStoredBookmarks } from "@/hooks/storage";
import { BookmarkForm } from "@/components/Bookmarks/BookmarkForm";
import { BookmarkCard } from "@/components/Bookmarks/BookmarkCard";
import { Modal } from "@/components/Bookmarks/Modal";
import { Plus, Search, BookMarked } from "lucide-react";
import { Button } from "../ui/button";

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

interface Props {
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

const App = ({ isAdding, setIsAdding }: Props) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const stored = getStoredBookmarks();
    setBookmarks(stored);
  }, []);

  useEffect(() => {
    saveStoredBookmarks(bookmarks);
  }, [bookmarks]);

  const handleAddBookmark = (data: BookmarkFormData) => {
    const newBookmark: Bookmark = {
      ...data,
      id: generateId(),
      createdAt: Date.now(),
    };
    setBookmarks((prev) => [newBookmark, ...prev]);
    setIsAdding(false);
  };

  const handleDeleteBookmark = (id: string) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q)
      );
    });
  }, [bookmarks, searchQuery]);

  return (
    <div>
      {/* Header */}
     

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Modal */}
        <Modal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          title="Add a Quick Link"
        >
          <BookmarkForm
            onAdd={handleAddBookmark}
            onCancel={() => setIsAdding(false)}
          />
        </Modal>

        {/* Search Bar */}
        <div className="w-full md:w-1/2 lg:w-1/3 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full h-11 rounded-md pl-10 pr-3
              border border-slate-300 bg-white
              text-sm shadow-sm
              placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-300
            "
          />
        </div>

        {/* Grid / Empty State */}
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-dashed border-slate-300 bg-white">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <BookMarked size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              No Quick links yet
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
              Add your first quick link to keep your favorite URLs organized.
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              className="
                inline-flex items-center justify-center gap-2
                rounded-md text-white text-sm
                
                px-4 py-2 shadow-sm
              "
            >
              <Plus size={16} />
              Add Links
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
