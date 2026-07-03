import { useState, useRef } from "react";
import { CaseSensitive, Trash2, ArrowLeftRight, Copy, Check, Sparkles } from "lucide-react";

interface TextTransformerProps {
  onAddLog: (action: string, details: string) => void;
}

export default function TextTransformer({ onAddLog }: TextTransformerProps) {
  const [text, setText] = useState<string>("Hello, React 19!");
  const [copied, setCopied] = useState<boolean>(false);
  const textRenderCount = useRef<number>(0);
  textRenderCount.current += 1;

  const charCount = text.length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const handleTextChange = (val: string) => {
    setText(val);
  };

  const applyTransformation = (type: string, fn: (t: string) => string) => {
    const transformed = fn(text);
    setText(transformed);
    onAddLog("Text Transformed", `${type} conversion applied`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onAddLog("Text Copied", "Copied text content to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs" id="text-transformer-card">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h2 className="font-sans text-base font-semibold text-gray-900">
          Keystroke & Text Transformer
        </h2>
        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 font-mono">
          Renders: {textRenderCount.current}
        </span>
      </div>

      {/* Editor Area */}
      <div className="relative mb-3">
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type here to test reactivity..."
          className="w-full min-h-[100px] max-h-[160px] rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-xs font-mono text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-purple-500 transition-all"
          id="test-textarea"
        />

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute right-2.5 bottom-2.5 rounded-md p-1.5 border border-gray-200 bg-white text-gray-500 hover:text-gray-900 shadow-2xs hover:bg-gray-50 transition-all"
          title="Copy text"
          id="copy-text-btn"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500 animate-bounce" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Real-time stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 text-center">
          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Characters</span>
          <span className="text-sm font-bold font-mono text-gray-700">{charCount}</span>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 text-center">
          <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Words</span>
          <span className="text-sm font-bold font-mono text-gray-700">{wordCount}</span>
        </div>
      </div>

      {/* Tool Actions */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => applyTransformation("Uppercase", (t) => t.toUpperCase())}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            id="text-upper-btn"
          >
            <CaseSensitive className="h-3.5 w-3.5" />
            UPPER
          </button>
          <button
            onClick={() => applyTransformation("Lowercase", (t) => t.toLowerCase())}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            id="text-lower-btn"
          >
            <CaseSensitive className="h-3.5 w-3.5 text-gray-400" />
            lower
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => applyTransformation("Reverse", (t) => t.split("").reverse().join(""))}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            id="text-reverse-btn"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Reverse
          </button>
          <button
            onClick={() =>
              applyTransformation("Base64 Encode", (t) => {
                try {
                  return btoa(unescape(encodeURIComponent(t)));
                } catch (e) {
                  return "Encoding Error";
                }
              })
            }
            className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            id="text-b64-btn"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            Base64
          </button>
        </div>

        <button
          onClick={() => {
            setText("");
            onAddLog("Text Cleared", "Cleared textarea");
          }}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 bg-white py-2 text-xs font-semibold text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
          id="text-clear-btn"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Workspace
        </button>
      </div>
    </div>
  );
}
