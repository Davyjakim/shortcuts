"use client";

import {
  Bookmark,
  Keyboard,
  FileText,
  Braces,
} from "lucide-react";

// Section IDs
const sectionIds = {
  quicklinks: "create-quicklinks-section",
  shortcuts: "create-shortcuts-section",
  textEditor: "text-editor-section",
  jsonParser: "json-parser-section",
};

const NavBar = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-14 gap-2 sm:gap-10">
          <NavItem
            id={sectionIds.quicklinks}
            label="Quick Links"
            Icon={Bookmark}
            onClick={scrollToSection}
          />

          <NavItem
            id={sectionIds.shortcuts}
            label="Shortcuts"
            Icon={Keyboard}
            onClick={scrollToSection}
          />

          <NavItem
            id={sectionIds.textEditor}
            label="Text Editor"
            Icon={FileText}
            onClick={scrollToSection}
          />

          <NavItem
            id={sectionIds.jsonParser}
            label="JSON Formatter"
            Icon={Braces}
            onClick={scrollToSection}
          />
        </div>
      </div>
    </nav>
  );
};

// Single Nav Item Component
const NavItem = ({
  id,
  label,
  Icon,
  onClick,
}: {
  id: string;
  label: string;
  Icon: any;
  onClick: (id: string) => void;
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className="
        group relative inline-flex items-center gap-2 
        font-medium text-sm text-slate-600 
        transition-colors duration-200 px-2
        hover:text-indigo-600
        focus:outline-none focus:text-indigo-600
      "
    >
      <Icon
        size={16}
        className="text-slate-400 group-hover:text-indigo-500 transition-colors duration-200"
      />

      {label}

      {/* Animated underline */}
      <span
        className="
          absolute bottom-0 left-0 right-0 
          h-0.5 bg-indigo-500 rounded-full 
          scale-x-0 group-hover:scale-x-100 
          transition-transform duration-300 origin-center
        "
      />
    </button>
  );
};

export default NavBar;
