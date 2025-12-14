import React, { ChangeEvent, useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Copy, Check, FileText } from "lucide-react";

// Define the shape of your API response
interface SummariseResponse {
  summary?: string;
  message?: string;
  error?: string;
}

const MAX_CHARS = 2500;

export default function SmartSummarizer() {
  const [topics, setTopics] = useState<number>(4);
  const [originalText, setOriginalText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setOriginalText(e.target.value);
  };

  const handleTopicChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setTopics(val);
    } else if (e.target.value === "") {
      setTopics(0);
    }
  };

  const handleCopy = async (): Promise<void> => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleSummarize = useCallback(async (): Promise<void> => {
    const trimmedText = originalText.trim();
    if (!trimmedText) {
      toast.error("Please enter some text first");
      return;
    }

    setIsLoading(true);
    setSummary("");

    try {
      const safeTopics = topics > 0 ? topics : 3;
      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmedText,
          topic: safeTopics,
        }),
      });

      const data: SummariseResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to fetch summary"
        );
      }

      // Handle both string return or object return
      const resultText = typeof data === "string" ? data : data.summary;

      if (!resultText) throw new Error("No summary was returned");

      setSummary(resultText);
      toast.success("Analysis complete!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [originalText, topics]);

  // Derived calculations
  const wordCount: number =
    originalText.trim() === "" ? 0 : originalText.trim().split(/\s+/).length;
  const charCount: number = originalText.length;
  const isOverLimit: boolean = charCount > MAX_CHARS;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input */}
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Input Content
            </h2>
            <p className="text-slate-500">
              Paste the text you want to analyze below.
            </p>
          </div>

          <Card className="p-6 shadow-md border-slate-200/60 bg-white/50 backdrop-blur-sm">
            <div className="flex flex-col gap-6">
              <div className="grid w-full gap-2">
                <Label htmlFor="topics">Target Topics</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="topics"
                    type="number"
                    min="1"
                    max="20"
                    value={topics || ""}
                    onChange={handleTopicChange}
                    className="max-w-[100px] font-medium"
                  />
                  <span className="text-xs text-slate-500 italic">
                    Decreasing the number topics, will result in a shorter
                    summary
                  </span>
                </div>
              </div>

              <div className="grid w-full gap-2">
                <Label htmlFor="original">Source Text</Label>
                <Textarea
                  id="original"
                  placeholder="Paste your text here..."
                  value={originalText}
                  onChange={handleTextChange}
                  className={`h-[350px] text-base leading-relaxed transition-colors focus-visible:ring-blue-400 ${
                    isOverLimit
                      ? "border-red-400 focus-visible:ring-red-400"
                      : ""
                  }`}
                />
              </div>

              <div className="flex justify-between items-center text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Words: {wordCount}
                </span>
                <span className={isOverLimit ? "text-red-500 font-bold" : ""}>
                  Characters: {charCount} / {MAX_CHARS}
                </span>
              </div>

              <Button
                onClick={handleSummarize}
                disabled={!originalText.trim() || isLoading || isOverLimit}
                className="w-full text-base py-6 shadow-lg transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  "Generate Summary"
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-8 h-full">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Summary Result
            </h2>
            <p className="text-slate-500">
              This summary is <strong className="text-lg">not</strong> Ai
              generated
            </p>
          </div>
          <h3 className="">
              Summary details
            </h3>
          <div className="flex justify-between items-center text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
            
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Words: {summary.split(" ").length}
            </span>
            <span className={isOverLimit ? "text-red-500 font-bold" : ""}>
              Characters: {summary.length} 
            </span>
          </div>
          <Card
            className={`relative p-6 h-full min-h-[500px] shadow-md transition-all duration-500 ${
              summary
                ? "bg-white border-blue-200 ring-4 ring-blue-50"
                : "bg-slate-50 border-dashed border-slate-300"
            }`}
          >
            {summary ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Key Takeaways
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className={`transition-all ${
                        copied
                          ? "text-green-600 bg-green-50"
                          : "text-slate-500 hover:text-blue-600"
                      }`}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                    {summary}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 py-20">
                <div className="p-4 bg-slate-100 rounded-full">
                  <FileText className="h-10 w-10 opacity-40 text-slate-500" />
                </div>
                <p className="text-sm font-medium">
                  {isLoading ? "Processing..." : "Ready to analyze your text"}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
