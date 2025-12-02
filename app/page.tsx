// app/page.jsx or relevant file
"use client"
import CreateShortcuts from '@/components/CreateShortcuts'
import JsonParser from '@/components/JsonFormatter'
import TextEditor from '@/components/TextEditor'
// Import the new Navigation Bar
import NavBar from '@/components/ToolBarNav' 
import React from 'react'

// Define the IDs (should match the IDs used in NavBar.jsx)
const sectionIds = {
  shortcuts: 'create-shortcuts-section',
  textEditor: 'text-editor-section',
  jsonParser: 'json-parser-section',
};

function page() {
  return (
    <div>
      {/* 1. Insert the sticky Navigation Bar at the top */}
      <NavBar />
      
      <main className="p-4"> 
        {/* 2. Wrap each component in a div with the target ID */}
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
      </main>
    </div>
  )
}

export default page