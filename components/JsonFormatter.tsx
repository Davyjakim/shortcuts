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
} from 'lucide-react';
import { safeJsonParse, ParseResult } from '@/lib/safeJsonParse';

interface ParsedDataType {
  [key: string]: unknown;
}

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

export default function JsonParser() {
  const [inputJson, setInputJson] = useState<string>('');
  const [result, setResult] =
    useState<ParseResult<ParsedDataType> | null>(null);

  const handleParse = (): void => {
    if (!inputJson.trim()) {
      setResult(null);
      return;
    }

    const parseResult = safeJsonParse<ParsedDataType>(inputJson);
    setResult(parseResult);
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
  };

  const copyToClipboard = (text: string): void => {
    void navigator.clipboard.writeText(text);
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputJson(e.target.value);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <div className="flex items-center gap-2">
          <FileJson className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>JSON Editor & Validator</CardTitle>
            <CardDescription>Format, validate, and fix your JSON data</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
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

          <Button onClick={handleParse} className="min-w-[120px]">
            Validate JSON
          </Button>
        </div>

        <div className="relative">
          <Textarea
            placeholder='Paste your JSON here e.g. {"ids": [1, 2, 3]}'
            className="font-mono text-sm min-h-[300px] resize-y p-4 leading-relaxed bg-slate-50 focus:bg-white transition-colors"
            value={inputJson}
            onChange={handleTextareaChange}
            spellCheck={false}
          />
        </div>

        {result && (
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
      </CardContent>
    </Card>
  );
}
