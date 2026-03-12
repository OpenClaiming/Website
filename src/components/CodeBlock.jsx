import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ code, language = "json", className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting using regex patterns
  const highlightCode = (code, lang) => {
    if (!code) return '';
    
    let highlighted = code;
    
    // Keywords for different languages
    const keywords = {
      javascript: /\b(import|export|class|function|const|let|var|if|else|return|try|catch|static|from|new|typeof|for|in|of)\b/g,
      python: /\b(import|class|def|if|else|return|try|except|from|as|with|for|in|self)\b/g,
      go: /\b(package|import|type|func|return|if|else|for|range|var|case|switch|struct)\b/g,
      rust: /\b(use|pub|struct|impl|fn|let|mut|match|if|else|return|for|in|mod)\b/g,
      php: /\b(class|function|public|private|static|return|if|else|try|catch|foreach|as|new)\b/g,
      swift: /\b(import|class|func|let|var|if|else|return|try|catch|for|in|static|guard)\b/g,
      java: /\b(class|public|private|static|void|return|if|else|try|catch|for|new|import)\b/g,
      kotlin: /\b(class|fun|val|var|if|else|return|try|catch|for|in|object|import)\b/g,
    };
    
    const langKeywords = keywords[lang] || keywords.javascript;
    
    // Escape HTML
    highlighted = highlighted.replace(/[<>&]/g, (c) => ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;'
    }[c]));
    
    // Highlight strings
    highlighted = highlighted.replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color: #a5d6a7;">$1</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm, '<span style="color: #757575; font-style: italic;">$1</span>');
    
    // Highlight keywords
    highlighted = highlighted.replace(langKeywords, '<span style="color: #ce93d8;">$1</span>');
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #90caf9;">$1</span>');
    
    // Highlight function names
    highlighted = highlighted.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span style="color: #81d4fa;">$1</span>(');
    
    return highlighted;
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
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
      </pre>
    </div>
  );
}