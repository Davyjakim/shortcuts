// app/page.jsx or relevant file
"use client"
import CreateShortcuts from '@/components/CreateShortcuts'
import JsonParser from '@/components/JsonFormatter'
import TextEditor from '@/components/TextEditor'
// Import the new Navigation Bar
import NavBar from '@/components/ToolBarNav' 
import  Main  from '@/components/Bookmarks/main'
import React, { useState } from 'react'
import { BookMarked, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Smain from '@/components/summiraser/Smain'

// Define the IDs (should match the IDs used in NavBar.jsx)
const sectionIds = {
  quicklinks: "create-quicklinks-section",
  shortcuts: "create-shortcuts-section",
  textEditor: "text-editor-section",
  jsonParser: "json-parser-section",
  sammariser: "sammarise-text-section",
};

function page() {
    const [isAdding, setIsAdding] = useState(false);
  return (
    <div>
      {/* 1. Insert the sticky Navigation Bar at the top */}
      <NavBar />
      
      
      <main className="p-4  "> 
        {/* 2. Wrap each component in a div with the target ID */}
        <div id={sectionIds.quicklinks} className="mb-10 pt-16 -mt-16">
          {/* pt-16 and -mt-16 are used to offset the sticky header when scrolling */}
           <header className="w-full border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100  p-2 rounded-lg shadow-sm">
              <BookMarked size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Quick Links
            </h1>
          </div>

          <Button
            onClick={() => setIsAdding(true)}
            className="
              inline-flex items-center gap-2 rounded-md 
               text-white text-sm
              
              h-9 px-4 transition-all shadow-sm
            "
          >
            <Plus size={16} />
            Add Link
          </Button>
        </div>
      </header>
          <Main 
          isAdding={isAdding} setIsAdding={setIsAdding}
          />
        </div>
        <div id={sectionIds.shortcuts} className="mb-10 pt-16 -mt-16">
          {/* pt-16 and -mt-16 are used to offset the sticky header when scrolling */}
          <h2 className="text-2xl font-bold mb-4">⌨️ Create Shortcuts</h2>
          <CreateShortcuts/>
        </div>

        <div id={sectionIds.textEditor} className="mb-10 pt-16 -mt-16">
          <h2 className="text-2xl font-bold mb-4">📝 Text Editor</h2>
          <TextEditor/>
        </div>

        <div id={sectionIds.jsonParser} className="mb-10 pt-16 -mt-16">
          <h2 className="text-2xl font-bold mb-4">⚙️ JSON Formatter</h2>
          <JsonParser/>
        </div>
          <div id={sectionIds.sammariser} className="mb-10 pt-16 -mt-16">
          <h2 className="text-2xl font-bold mb-4">Summarise Text</h2>
          <Smain/>
        </div>
      </main>
    </div>
  )
}

export default page