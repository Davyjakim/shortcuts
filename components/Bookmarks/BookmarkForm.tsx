'use client';
import React, { useState } from 'react';
import { BookmarkFormData } from '@/types';

interface BookmarkFormProps {
  onAdd: (data: BookmarkFormData) => void;
  onCancel: () => void;
}

export const BookmarkForm: React.FC<BookmarkFormProps> = ({ onAdd, onCancel }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    onAdd({
      url,
      title: title || url,

    });
    
    // Reset form
    setUrl('');
    setTitle('');

  };

  const inputClasses = "flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";
  const labelClasses = "text-sm font-medium leading-none text-slate-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
  const buttonBase = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-2">
        <label className={labelClasses}>URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            required
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className={inputClasses}
          />
          
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome website"
          className={inputClasses}
        />
      </div>

      

      

      <div className="flex justify-end gap-3 pt-4 sm:space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className={`${buttonBase} border border-slate-800 bg-transparent hover:bg-slate-800 text-slate-50 h-10 px-4 py-2`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!url}
          className={`${buttonBase} bg-slate-50 text-slate-900 hover:bg-slate-200 h-10 px-4 py-2`}
        >
          Save Bookmark
        </button>
      </div>
    </form>
  );
};