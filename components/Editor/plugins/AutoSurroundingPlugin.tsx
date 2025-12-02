// components/Editor/plugins/AutoSurroundPlugin.tsx
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  COMMAND_PRIORITY_HIGH,
  KEY_DOWN_COMMAND,
} from "lexical";

// Define the characters that should trigger wrapping
const WRAPPING_CHARS: { [key: string]: string } = {
  '"': '"',
  "'": "'",
  "(": ")",
};

/**
 * Handles the logic for wrapping selected text with the typed character,
 * similar to VS Code's auto-surround feature.
 */
function wrapSelection(editor: any, openChar: string, closeChar: string) {
  editor.update(() => {
    const selection = $getSelection();

    // 1. Ensure we have a range selection (text is highlighted)
    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      return false; // Not a valid selection to wrap
    }

    // 2. Get the selection details
    const selectedText = selection.getTextContent();
    const anchor = selection.anchor;
    const focus = selection.focus;

    // 3. Delete the selected content
    selection.removeText();

    // 4. Create the surrounding nodes
    const openTextNode = $createTextNode(openChar);
    const closeTextNode = $createTextNode(closeChar);
    const wrappedTextNode = $createTextNode(selectedText);

    // 5. Insert the new structure: " + selectedText + "
    selection.insertNodes([openTextNode, wrappedTextNode, closeTextNode]);

    // 6. Reset the selection to the outside of the closing character
    // This moves the cursor to after the inserted closing character
    if (anchor.isBefore(focus)) {
      closeTextNode.selectNext();
    } else {
      openTextNode.selectPrevious();
    }
  });

  return true; // Command was handled
}

export default function AutoSurroundPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register a keydown command listener with HIGH priority
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        const key = event.key;
        const closeChar = WRAPPING_CHARS[key];

        // Check if the pressed key is one of the wrapping characters
        if (closeChar) {
          // Prevent the default insertion of the typed key
          event.preventDefault(); 
          // Perform the wrapping operation
          return wrapSelection(editor, key, closeChar);
        }
        return false; // Allow other plugins to handle the key
      },
      COMMAND_PRIORITY_HIGH // Use high priority to intercept before default key handlers
    );
  }, [editor]);

  return null;
}