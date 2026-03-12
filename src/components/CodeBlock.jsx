import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ code, language = "json", className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (code, lang) => {
    if (!code) return code;
    return code;
  };

  return (
    <div className={`relative group rounded-xl overflow-hidden ${className}`}>
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      {language && (
        <div className="absolute top-3 left-4 text-xs font-mono text-gray-500 uppercase tracking-wider">
          {language}
        </div>
      )}
      <pre className="bg-gray-950 text-gray-300 p-6 pt-10 overflow-x-auto text-sm leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}