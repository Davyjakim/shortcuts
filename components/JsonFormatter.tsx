"use client";

import {
  useState,
  useRef,
  useMemo,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { Textarea } from "@/components/ui/textarea"; // Assuming this forwards refs
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  FileJson,
  Trash2,
  Copy,
  AlignLeft,
  Minimize2,
  ListPlus,
} from "lucide-react";
import { safeJsonParse, ParseResult } from "@/lib/safeJsonParse";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Snippet } from "@/types";
import { toast } from "sonner";

// --- Types ---
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
interface JsonArray extends Array<JsonValue> {}
interface JsonSchema {
  type?: string | string[];
  properties?: { [key: string]: JsonSchema };
  items?: JsonSchema | JsonSchema[];
  required?: string[];
  oneOf?: JsonSchema[];
}
interface ParsedDataType {
  [key: string]: any;
}

// --- Utility Functions ---
const smartPrettyPrint = (data: unknown): string => {
  const json = JSON.stringify(data, null, 2);
  return json.replace(
    /\[\n\s+([\s\S]*?)\n\s+\]/g,
    (match: string, content: string) => {
      if (content.includes("{") || content.includes("[")) return match;
      const collapsed = `[ ${content.replace(/\s+/g, " ").trim()} ]`;
      const formatted = collapsed.replace(/\s+,/g, ",");
      return formatted.length > 80 ? match : formatted;
    },
  );
};

const generateJsonSchema = (json: JsonValue): JsonSchema => {
  const getPrimitiveType = (value: JsonValue): string | null => {
    if (value === null) return "null";
    const t = typeof value;
    if (t === "string") return "string";
    if (t === "boolean") return "boolean";
    if (t === "number") return "number";
    return null;
  };

  const primitiveType = getPrimitiveType(json);
  if (primitiveType) return { type: primitiveType };

  if (Array.isArray(json)) {
    const jsonArray = json as JsonArray;
    const schema: JsonSchema = { type: "array" };
    if (jsonArray.length > 0) {
      const uniqueItemSchemas: JsonSchema[] = [];
      const seenSchemaStrings = new Set<string>();
      for (const item of jsonArray) {
        const itemSchema = generateJsonSchema(item);
        const itemSchemaString = JSON.stringify(itemSchema);
        if (!seenSchemaStrings.has(itemSchemaString)) {
          uniqueItemSchemas.push(itemSchema);
          seenSchemaStrings.add(itemSchemaString);
        }
      }
      if (uniqueItemSchemas.length === 1) schema.items = uniqueItemSchemas[0];
      else if (uniqueItemSchemas.length > 1)
        schema.items = { oneOf: uniqueItemSchemas };
    }
    return schema;
  }

  if (typeof json === "object" && json !== null) {
    const jsonObject = json as JsonObject;
    const properties: { [key: string]: JsonSchema } = {};
    const required: string[] = [];
    for (const key in jsonObject) {
      if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
        required.push(key);
        properties[key] = generateJsonSchema(jsonObject[key]);
      }
    }
    return {
      type: "object",
      properties: properties,
      ...(required.length > 0 && { required: required }),
    };
  }
  return { type: "null" };
};

// --- Main Component ---
export default function JsonParser() {
  // 1. JSON & Validation State
  const [inputJson, setInputJson] = useState<string>("");
  const [result, setResult] = useState<ParseResult<ParsedDataType> | null>(
    null,
  );
  const [generatedSchema, setGeneratedSchema] = useState<JsonSchema | null>(
    null,
  );
  const [isSchemaMinified, setIsSchemaMinified] = useState(false);

  // 2. Slash Command State
  const [menuOpen, setMenuOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [snippets] = useLocalStorage<Snippet[]>("snapkey-snippets", []); // Ensure this hook is available
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // --- Logic: Slash Commands Filter ---
  const filteredCommands = useMemo(() => {
    if (!command) return snippets;
    const lowerCmd = command.toLowerCase();

    return snippets
      .filter((item) => item.title.toLowerCase().includes(lowerCmd))
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle === lowerCmd) return -1;
        if (bTitle === lowerCmd) return 1;
        const aStarts = aTitle.startsWith(lowerCmd);
        const bStarts = bTitle.startsWith(lowerCmd);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aTitle.localeCompare(bTitle);
      });
  }, [command, snippets]);

  // --- Logic: Handlers for JSON Actions ---
  const handleParse = (): void => {
    if (!inputJson.trim()) {
      setResult(null);
      setGeneratedSchema(null);
      return;
    }
    const parseResult = safeJsonParse<ParsedDataType>(inputJson);
    setResult(parseResult);
    if (!parseResult.success) setGeneratedSchema(null);
  };

  const handleGenerateSchema = (): void => {
    if (!inputJson.trim()) {
      setGeneratedSchema(null);
      return;
    }
    const parseResult = safeJsonParse<ParsedDataType>(inputJson);
    setResult(parseResult);
    if (parseResult.success && parseResult.data) {
      const schema = generateJsonSchema(parseResult.data);
      setGeneratedSchema(schema);
    } else {
      setGeneratedSchema(null);
    }
  };

  const handleFormat = (): void => {
    if (!inputJson.trim()) return;
    const parseResult = safeJsonParse<ParsedDataType>(inputJson);
    if (parseResult.success && parseResult.data) {
      const pretty = smartPrettyPrint(parseResult.data);
      setInputJson(pretty);
      setResult(parseResult);
    } else {
      setResult(parseResult);
    }
  };

  const handleMinify = (): void => {
    if (!inputJson.trim()) return;
    const parseResult = safeJsonParse<ParsedDataType>(inputJson);
    if (parseResult.success && parseResult.data) {
      setInputJson(JSON.stringify(parseResult.data));
      setResult(parseResult);
    } else {
      setResult(parseResult);
    }
  };

  const handleClear = (): void => {
    setInputJson("");
    setResult(null);
    setGeneratedSchema(null);
  };

  const copyToClipboard = (text: string): void => {
    void navigator.clipboard.writeText(text);
  };

  // --- Logic: Unified Textarea Handlers ---

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputJson(val);

    // Slash command detection
    const selectionStart = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, selectionStart);
    const match = textBeforeCursor.match(/\/(\w*)$/);

    if (match) {
      setCommand(match[1]);
      setMenuOpen(true);
      setActiveIndex(0);
    } else {
      setMenuOpen(false);
      setCommand("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // If menu is closed, do nothing special
    if (!menuOpen || filteredCommands.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (i) => (i - 1 + filteredCommands.length) % filteredCommands.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault(); // Stop newline
      if (filteredCommands.length > 0) {
        insertSnippet(filteredCommands[activeIndex].content);
      }
    } else if (e.key === "Escape") {
      setMenuOpen(false);
    }
  };

  const insertSnippet = (snippetContent: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const textBefore = textarea.value.slice(0, start);
    const match = textBefore.match(/\/\w*$/);

    if (!match) return;

    // We calculate where the slash command started
    const replaceStart = start - match[0].length;

    // Use native execCommand to preserve Undo history,
    // but ensure we sync React state afterwards
    textarea.focus();
    textarea.setSelectionRange(replaceStart, start);

    // Attempt native insert
    const success = document.execCommand(
      "insertText",
      false,
      `${snippetContent} `,
    );

    // Sync React state
    if (success) {
      // execCommand usually triggers an input event, but in React we might need to force it
      // if the event handler doesn't catch it correctly immediately.
      // However, since we are controlled, we usually want to manually set the state
      // to ensure no flicker.
      const newValue = textarea.value;
      setInputJson(newValue);
    } else {
      // Fallback if execCommand is blocked
      const before = textarea.value.slice(0, replaceStart);
      const after = textarea.value.slice(start);
      const newValue = before + snippetContent + " " + after;
      setInputJson(newValue);

      // We'd need to manually move cursor here, but execCommand is preferred
    }

    setMenuOpen(false);
    setCommand("");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <div className="flex items-center gap-2">
          <FileJson className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>JSON Editor & Validator</CardTitle>
            <CardDescription>
              Format JSON, generate schemas, and use{" "}
              <span className="font-mono bg-slate-200 px-1 rounded">/</span>{" "}
              commands for snippets.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 ">
        {/* --- JSON SCHEMA HELP (DROPDOWN) --- */}
        <details className="rounded-lg border border-slate-200 bg-slate-50">
          <summary className="px-4 py-2 cursor-pointer select-none font-semibold text-sm bg-slate-100 border-b hover:bg-slate-200">
            JSON Schema — Quick Guide
          </summary>

          <div className="p-4 text-sm space-y-3 text-slate-700">
            <p>
              A JSON Schema describes the <b>shape</b> of your JSON: required
              fields, types, and nested structures.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="font-medium">Common keywords</p>
                <ul className="list-disc ml-4">
                  <li>
                    <code>type</code>: string, number, boolean, object, array,
                    null
                  </li>
                  <li>
                    <code>properties</code>: fields inside an object
                  </li>
                  <li>
                    <code>required</code>: fields that must exist
                  </li>
                  <li>
                    <code>items</code>: schema for array elements
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium">Minimal example</p>
                <pre className="bg-slate-900 text-slate-100 rounded-md p-2 text-xs overflow-auto">
                  {`{
  "type": "object",
  "properties": {
    "id": { "type": "number" },
    "name": { "type": "string" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["id", "name"]
}`}
                </pre>
              </div>
            </div>
          </div>
        </details>
        {/* --- Toolbar --- */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleFormat}>
              <AlignLeft className="h-4 w-4 mr-2" /> Format
            </Button>
            <Button variant="outline" size="sm" onClick={handleMinify}>
              <Minimize2 className="h-4 w-4 mr-2" /> Minify
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={handleParse}
              variant="secondary"
              className="min-w-[120px]"
            >
              Validate JSON
            </Button>
            <Button
              onClick={handleGenerateSchema}
              className="min-w-[150px] bg-purple-600 hover:bg-purple-700"
            >
              <ListPlus className="h-4 w-4 mr-2" /> Generate Schema
            </Button>
          </div>
        </div>

        {/* --- Unified Textarea Container --- */}
        <div className="relative">
          {menuOpen && filteredCommands.length > 0 && (
            <div className="absolute z-50 bottom-full left-0 mb-2 border rounded-lg bg-white shadow-xl w-[200px] max-h-48 overflow-y-auto">
              {filteredCommands.map((cmd, i) => (
                <div
                  key={cmd.id || i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => insertSnippet(cmd.content)}
                  className={`p-2 px-3 cursor-pointer text-sm ${
                    i === activeIndex
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{cmd.title}</div>
                  {/* Optional: Show truncated content preview */}
                  {/* <div className="text-xs text-gray-400 truncate">{cmd.content}</div> */}
                </div>
              ))}
            </div>
          )}

          <Textarea
            ref={textareaRef}
            placeholder='Paste JSON or type "/" for snippets...'
            className="font-mono text-sm min-h-[300px] resize-y p-4 leading-relaxed bg-slate-50 focus:bg-white transition-colors"
            value={inputJson}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown} // Important: Attach keydown here
            spellCheck={false}
          />
        </div>

        {/* --- Result: Validation --- */}
        {result && !generatedSchema && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {result.success ? (
              <div className="rounded-lg border border-green-200 bg-green-50/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-green-100/50 border-b border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold text-sm">Valid JSON</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-700 hover:bg-green-200/50"
                    onClick={() =>
                      copyToClipboard(smartPrettyPrint(result.data))
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 max-h-[400px] overflow-auto">
                  <pre className="text-xs text-green-900 font-mono">
                    {smartPrettyPrint(result.data)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100/50 border-b border-red-200 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-semibold text-sm">Syntax Error</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-red-600 font-medium">
                    {result.error}
                  </p>
                  {result.errorContext && (
                    <div className="bg-white border border-red-200 rounded-md shadow-sm">
                      <div className="flex justify-between items-center px-3 py-1.5 bg-slate-50 border-b text-xs text-gray-500">
                        <span>Line: {result.errorContext.line}</span>
                        <span>Column: {result.errorContext.column}</span>
                      </div>
                      <div className="p-3 bg-slate-900 overflow-x-auto rounded-b-md">
                        <pre className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre">
                          {result.errorContext.snippet}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Result: Schema --- */}
        {generatedSchema && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="rounded-lg border border-purple-200 bg-purple-50/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-purple-100/50 border-b border-purple-200">
                <div className="flex items-center gap-2 text-purple-700">
                  <ListPlus className="h-5 w-5" />
                  <span className="font-semibold text-sm">
                    Generated JSON Schema
                  </span>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 px-2 w-max text-purple-700 hover:bg-purple-200/50"
                    onClick={() => setIsSchemaMinified(!isSchemaMinified)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-purple-700 hover:bg-purple-200/50"
                    onClick={() => {
                      copyToClipboard(
                        isSchemaMinified
                          ? JSON.stringify(generatedSchema)
                          : JSON.stringify(generatedSchema, null, 2),
                      );
                      toast.success("JSON schema copied")
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 max-h-[400px] overflow-auto">
                <pre className="text-xs text-purple-900 font-mono">
                  {isSchemaMinified
                    ? JSON.stringify(generatedSchema)
                    : JSON.stringify(generatedSchema, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
