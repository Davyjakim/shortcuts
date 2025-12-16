'use client';

import { useState, ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  AlertCircle,
  CheckCircle2,
  FileJson,
  Trash2,
  Copy,
  AlignLeft,
  Minimize2,
  ListPlus, // New icon for Schema Generation
} from 'lucide-react';
import { safeJsonParse, ParseResult } from '@/lib/safeJsonParse';

// --- Type Definitions for JSON and Schema (Kept within the component file for completeness) ---

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue; }
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

// --- Utility Functions (Minified for clarity) ---

const smartPrettyPrint = (data: unknown): string => {
  const json = JSON.stringify(data, null, 2);

  return json.replace(/\[\n\s+([\s\S]*?)\n\s+\]/g, (match: string, content: string) => {
    if (content.includes('{') || content.includes('[')) return match;

    const collapsed = `[ ${content.replace(/\s+/g, ' ').trim()} ]`;
    const formatted = collapsed.replace(/\s+,/g, ',');

    if (formatted.length > 80) return match;

    return formatted;
  });
};

/**
 * Generates a Draft 7 compatible JSON Schema from a parsed JavaScript object,
 * correctly handling arrays with mixed-type elements.
 */
const generateJsonSchema = (json: JsonValue): JsonSchema => {
  const getPrimitiveType = (value: JsonValue): string | null => {
    if (value === null) return "null";
    const t = typeof value;
    if (t === "string") return "string";
    if (t === "boolean") return "boolean";
    if (t === "number") return  "number";
    return null;
  };

  const primitiveType = getPrimitiveType(json);
  if (primitiveType) {
    return { type: primitiveType };
  }

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

      if (uniqueItemSchemas.length === 1) {
        schema.items = uniqueItemSchemas[0];
      } else if (uniqueItemSchemas.length > 1) {
        schema.items = { oneOf: uniqueItemSchemas };
      }
    }
    return schema;
  }
  
  if (typeof json === "object" && json !== null) { // The 'json !== null' check is redundant here but good practice
    const jsonObject = json as JsonObject;
    const properties: { [key: string]: JsonSchema } = {};
    const required: string[] = [];
    
    for (const key in jsonObject) {
      if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
        required.push(key);
        properties[key] = generateJsonSchema(jsonObject[key]);
      }
    }

    const schema: JsonSchema = {
      type: "object",
      properties: properties,
      ...(required.length > 0 && { required: required })
    };
    
    return schema;
  }
  
  return { type: "null" }; 
};

// --- React Component ---

export default function JsonParser() {
  const [inputJson, setInputJson] = useState<string>('');
  const [result, setResult] =
    useState<ParseResult<ParsedDataType> | null>(null);
  const [generatedSchema, setGeneratedSchema] = useState<JsonSchema | null>(null);

  const handleParse = (): void => {
    if (!inputJson.trim()) {
      setResult(null);
      setGeneratedSchema(null); // Clear schema on re-validation
      return;
    }

    const parseResult = safeJsonParse<ParsedDataType>(inputJson);
    setResult(parseResult);
    // Clear schema if validation fails
    if (!parseResult.success) {
      setGeneratedSchema(null);
    }
  };

  const handleGenerateSchema = (): void => {
    if (!inputJson.trim()) {
      setGeneratedSchema(null);
      return;
    }

    const parseResult = safeJsonParse<ParsedDataType>(inputJson);
    setResult(parseResult);

    if (parseResult.success && parseResult.data) {
      // The core logic to generate the schema
      const schema = generateJsonSchema(parseResult.data);
      setGeneratedSchema(schema);
    } else {
      // Clear schema and display error if JSON is invalid
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
    setInputJson('');
    setResult(null);
    setGeneratedSchema(null);
  };

  const copyToClipboard = (text: string): void => {
    void navigator.clipboard.writeText(text);
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputJson(e.target.value);
  };

  // Determine which schema to display: either the parsed JSON (if valid) or the generated schema
  const displayResult = generatedSchema ? generatedSchema : result?.success ? result.data : null;
  const isSchemaOutput = !!generatedSchema;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <div className="flex items-center gap-2">
          <FileJson className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>JSON Editor, Validator & Schema Generator</CardTitle>
            <CardDescription>Format, validate, and automatically generate a JSON Schema.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* --- Input Actions --- */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleFormat}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Format
            </Button>

            <Button variant="outline" size="sm" onClick={handleMinify}>
              <Minimize2 className="h-4 w-4 mr-2" />
              Minify
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleParse} variant="secondary" className="min-w-[120px]">
              Validate JSON
            </Button>
            {/* --- NEW SCHEMA GENERATION BUTTON --- */}
            <Button onClick={handleGenerateSchema} className="min-w-[150px] bg-purple-600 hover:bg-purple-700">
              <ListPlus className="h-4 w-4 mr-2" />
              Generate Schema
            </Button>
          </div>
        </div>
        
        {/* --- Input Textarea --- */}
        <div className="relative">
          <Textarea
            placeholder='Paste your JSON here e.g. {"ids": [1, 2, 3]}'
            className="font-mono text-sm min-h-[300px] resize-y p-4 leading-relaxed bg-slate-50 focus:bg-white transition-colors"
            value={inputJson}
            onChange={handleTextareaChange}
            spellCheck={false}
          />
        </div>

        {/* --- Result/Validation Card (Kept for compatibility) --- */}
        {result && !generatedSchema && ( // Only show validation result if no schema is generated
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {result.success && (
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
                    onClick={() => copyToClipboard(smartPrettyPrint(result.data))}
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
            )}

            {/* Error Message */}
            {!result.success && (
              <div className="rounded-lg border border-red-200 bg-red-50 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100/50 border-b border-red-200 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-semibold text-sm">Syntax Error</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-red-600 font-medium">{result.error}</p>
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
                      <div className="px-3 py-2 bg-yellow-50 text-xs text-yellow-700 border-t border-yellow-100 rounded-b-md">
                        Tip: The caret (^) points to the first character the parser rejected.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* --- NEW SCHEMA OUTPUT CARD --- */}
        {generatedSchema && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="rounded-lg border border-purple-200 bg-purple-50/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-purple-100/50 border-b border-purple-200">
                <div className="flex items-center gap-2 text-purple-700">
                  <ListPlus className="h-5 w-5" />
                  <span className="font-semibold text-sm">Generated JSON Schema</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-purple-700 hover:bg-purple-200/50"
                  onClick={() => copyToClipboard(JSON.stringify(generatedSchema, null, 2))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 max-h-[400px] overflow-auto">
                <pre className="text-xs text-purple-900 font-mono">
                  {JSON.stringify(generatedSchema, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}