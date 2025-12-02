"use client"
import AutoSurroundPlugin from "@/components/Editor/plugins/AutoSurroundingPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $insertNodes, TextNode, $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { $createCodeNode } from "@lexical/code";

import theme from "@/components/Editor/theme";
import { EditorNodes } from "@/components/Editor/nodes";
import ToolbarPlugin from "@/components/Editor/plugins/ToolbarPlugin";




// Error Fallback
function Placeholder() {
  return <div className="editor-placeholder absolute top-[9%] px-1  z-20">Start typing ...</div>;
}

const initialConfig = {
  namespace: "ZenithEditor",
  theme,
  onError(error: Error) {
    throw error;
  },
  nodes: EditorNodes,
};

export default function Editor() {
 

  return (
    <div className="relative p-3 w-full max-w-4xl mx-auto my-8 bg-white rounded-xl  border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin   />
        
       <AutoSurroundPlugin />

        <div className=" ">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="ContentEditable__root outline-none h-full  min-h-[600px] resize-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
         
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          
        </div>
      </LexicalComposer>
    </div>
  );
}