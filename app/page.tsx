"use client"
import CreateShortcuts from '@/components/CreateShortcuts'
import JsonParser from '@/components/JsonFormatter'
import NavBar from '@/components/ToolBarNav' 
import Main from '@/components/Bookmarks/main'
import React, { useState } from 'react'
import { BookMarked, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Smain from '@/components/summiraser/Smain'

const sectionIds = {
  quicklinks: "create-quicklinks-section",
  shortcuts: "create-shortcuts-section",
  jsonParser: "json-parser-section",
  sammariser: "sammarise-text-section",
};

function Page() {
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-googleBgDark">
      <NavBar />

      <main className="p-4 max-w-7xl mx-auto">
        {/* Quick Links */}
        <div id={sectionIds.quicklinks} className="mb-10 pt-16 -mt-16">
          <header
            className="
              w-full border-b 
              border-slate-200 dark:border-googleBorderDark
              bg-white dark:bg-googleSurfaceDark
            "
          >
            <div className="h-16 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg">
                  <BookMarked size={20} />
                </div>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-googleTextDark">
                  Quick Links
                </h1>
              </div>

              <Button
                onClick={() => setIsAdding(true)}
                className="
                  h-9 px-4 text-sm font-medium
                  bg-indigo-600 hover:bg-indigo-700
                  dark:bg-indigo-500 dark:hover:bg-indigo-600
                "
              >
                <Plus size={16} />
                Add Link
              </Button>
            </div>
          </header>

          <Main isAdding={isAdding} setIsAdding={setIsAdding} />
        </div>

        {/* Shortcuts */}
        <div id={sectionIds.shortcuts} className="mb-10 pt-16 -mt-16">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-googleTextDark mb-4">
            ⌨️ Create Shortcuts
          </h2>
          <CreateShortcuts />
        </div>

        {/* JSON Parser */}
        <div id={sectionIds.jsonParser} className="mb-10 pt-16 -mt-16">
          <h2 className="text-2xl font-semibold mb-4">
            ⚙️ JSON Formatter
          </h2>
          <JsonParser />
        </div>

        {/* Summariser */}
        <div id={sectionIds.sammariser} className="mb-10 pt-16 -mt-16">
          <h2 className="text-2xl font-semibold mb-4">
            Summarise Text
          </h2>
          <Smain />
        </div>
      </main>
    </div>
  )
}

export default Page
