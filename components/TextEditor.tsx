import React from 'react';
import Editor from '@/components/Editor/Editor';


function TextEditor() {
  return (
    <div className=" bg-[#F4F4F5] text-zinc-900 flex flex-col">
     

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mb-4">
            Write and format your text
          </h2>
        </div>

        <Editor />
        
    
      </main>
    </div>
  );
}

export default TextEditor;