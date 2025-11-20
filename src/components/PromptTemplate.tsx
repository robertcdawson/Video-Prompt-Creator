import React from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface PromptTemplateProps {
  content: string;
}

export const PromptTemplate: React.FC<PromptTemplateProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  // Parse content to highlight keys
  const formattedContent = content.split('\n').map((line, i) => {
    const match = line.match(/^(\s*)([^:]+):(.+)$/);
    if (match) {
      const [, indent, key, value] = match;
      return (
        <div key={i} className="leading-relaxed hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
          <span className="text-white/40">{indent}</span>
          <span className="text-blue-400 font-semibold">{key}:</span>
          <span className="text-white/90">{value}</span>
        </div>
      );
    }
    return <div key={i} className="text-white/80 px-2 -mx-2">{line}</div>;
  });

  return (
    <div className="w-full bg-[#1e1e1e]/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 ring-1 ring-white/5">
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white/90 tracking-wide uppercase">Optimized Output</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-6 overflow-x-auto font-mono text-sm">
        {formattedContent}
      </div>
    </div>
  );
};
