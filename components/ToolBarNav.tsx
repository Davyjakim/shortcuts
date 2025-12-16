"use client";

import { Bookmark, Keyboard, FileText, Braces } from "lucide-react";

const sectionIds = {
  quicklinks: "create-quicklinks-section",
  shortcuts: "create-shortcuts-section",
  jsonParser: "json-parser-section",
  summariser: "sammarise-text-section",
};

const NavBar = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-lg border-b border-slate-200">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-center ">
          {/* Brand */}
          {/* <div className="flex items-center gap-3 font-bold text-indigo-600">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow">J@</div>
          </div> */}

          {/* Navigation */}
          <div className=" flex    items-center gap-1 sm:gap-3">
            <NavItem id={sectionIds.quicklinks} label="Quick Links" Icon={Bookmark} onClick={scrollToSection} />
            <NavItem id={sectionIds.shortcuts} label="Shortcuts" Icon={Keyboard} onClick={scrollToSection} />
            <NavItem id={sectionIds.jsonParser} label="JSON" Icon={Braces} onClick={scrollToSection} />
            <NavItem id={sectionIds.summariser} label="Summariser" Icon={FileText} onClick={scrollToSection} />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ id, label, Icon, onClick }: any) => {
  return (
    <button
      onClick={() => onClick(id)}
      className="group relative  flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
    >
      <Icon size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
      <span className="">{label}</span>
      <span className="absolute inset-x-2 -bottom-0.5 h-0.5 scale-x-0 bg-indigo-500 transition-transform group-hover:scale-x-100 origin-center" />
    </button>
  );
};

export default NavBar;
