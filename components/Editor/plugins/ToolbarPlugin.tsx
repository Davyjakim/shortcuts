import React, { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,$createParagraphNode,
  UNDO_COMMAND,
} from "lexical";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {  $setBlocksType } from "@lexical/selection";
import { Bold, Undo, Redo, Heading1, Heading2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // 1. Update text format status (Bold)
      setIsBold(selection.hasFormat("bold"));

      // 2. Update block type (H1, H2, or Paragraph)
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        const tag = element.getTag();
        setBlockType(tag);
      } else {
        const type = element.getType();
        setBlockType(type);
      }
    }
  }, [editor]);

  // Command and Update Listeners (Same as original)
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  /**
   * Toggles the block type between a heading (h1 or h2) and a paragraph.
   */
  const formatHeading = (headingTag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Check if the current block is already the requested heading type
        if (blockType === headingTag) {
          // If it is, convert it back to a paragraph
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          // Otherwise, convert it to the new heading type
          $setBlocksType(selection, () => $createHeadingNode(headingTag));
        }
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-white p-2 sticky top-0 z-10 rounded-t-lg">
      {/* Undo/Redo Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        disabled={!canUndo}
        className="h-8 w-8"
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        disabled={!canRedo}
        className="h-8 w-8 mr-2"
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-zinc-200 mx-1" />

      {/* Block Formatting Options (H1, H2) */}
      <Button
        variant={blockType === "h1" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => formatHeading("h1")}
        className="h-8 w-8"
        aria-label="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        variant={blockType === "h2" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => formatHeading("h2")}
        className="h-8 w-8"
        aria-label="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-zinc-200 mx-1" />

      {/* Text Formatting Options (Bold) */}
      <Button
        variant={isBold ? "secondary" : "ghost"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="h-8 w-8"
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <div className="flex-1" />
    </div>
  );
}