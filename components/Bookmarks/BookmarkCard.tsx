"use client";

import React, { useMemo, useState } from "react";
import { Bookmark } from "@/types";
import { Trash2, Calendar, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  const { formattedDate, hostname, faviconUrl } = useMemo(() => {
    const date = new Date(bookmark.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    let host = "";
    try {
      host = new URL(bookmark.url).hostname.replace("www.", "");
    } catch {
      host = "Unknown";
    }

    const favicon = host
      ? `https://s2.googleusercontent.com/s2/favicons?domain=${host}&sz=64`
      : "";

    return { formattedDate: date, hostname: host, faviconUrl: favicon };
  }, [bookmark.createdAt, bookmark.url]);

  return (
    <div
      className="
        group relative flex flex-col h-full w-full rounded-xl 
        border border-slate-200 bg-white 
        shadow-sm hover:shadow-lg 
        transition-all duration-300 hover:-translate-y-1
      "
    >
      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Hostname / Favicon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 
                            flex items-center justify-center overflow-hidden shadow-sm">
              {!imageError && faviconUrl ? (
                <img
                  src={faviconUrl}
                  alt=""
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Globe size={14} className="text-slate-400" />
              )}
            </div>

            <span className="truncate max-w-[150px] text-slate-600">
              {hostname}
            </span>
          </div>

          <ExternalLink
            size={16}
            className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Title */}
        <h3
          className="
            font-semibold text-lg leading-snug text-slate-900 
            line-clamp-2 group-hover:text-indigo-600 transition-colors
          "
        >
          <Link
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0"
          >
            {bookmark.title}
          </Link>
        </h3>
      </div>

      {/* Footer */}
      <div
        className="
          mt-auto border-t border-slate-200 bg-slate-50
          p-3 px-5 flex items-center justify-between
        "
      >
        <div className="flex items-center text-[11px] text-slate-500 font-medium">
          <Calendar size={12} className="mr-2 opacity-60" />
          {formattedDate}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(bookmark.id);
          }}
          className="
            z-10 p-1.5 rounded-md text-slate-500 
            hover:text-red-500 hover:bg-red-100 
            transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
