// lib/safeJsonParse.ts

export interface ErrorContext {
  line: number;
  column: number;
  snippet: string;
}

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorContext?: ErrorContext;
}

/**
 * Helper to calculate line, column, and create a snippet around the error index.
 */
function getErrorContext(jsonString: string, position: number): ErrorContext {
  const lines = jsonString.slice(0, position).split('\n');
  const line = lines.length;
  
  // The column is the length of the last line plus 1
  const column = lines[lines.length - 1].length + 1;

  // Extract a snippet (e.g., 20 chars before and 20 chars after)
  const start = Math.max(0, position - 20);
  const end = Math.min(jsonString.length, position + 20);
  const rawSnippet = jsonString.slice(start, end);

  // Add a visual pointer
  // We calculate where the pointer should be relative to our snippet slice
  const pointerOffset = position - start;
  const pointerLine = ' '.repeat(pointerOffset) + '^';
  
  // Combine snippet and pointer
  const snippet = `${rawSnippet}\n${pointerLine}`;

  return { line, column, snippet };
}

export function safeJsonParse<T>(jsonString: string): ParseResult<T> {
  if (typeof jsonString !== 'string') {
    return { success: false, error: 'Input must be a string.' };
  }

  try {
    const data = JSON.parse(jsonString);
    return { success: true, data: data as T };
  } catch (e: any) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown JSON parsing error.';
    
    // Attempt to extract position from error message (works in V8/Chrome/Node)
    // Example msg: "Unexpected token } in JSON at position 45"
    const match = errorMessage.match(/at position (\d+)/);
    
    let errorContext: ErrorContext | undefined;

    if (match && match[1]) {
      const position = parseInt(match[1], 10);
      errorContext = getErrorContext(jsonString, position);
    }

    return {
      success: false,
      error: errorMessage,
      errorContext,
    };
  }
}