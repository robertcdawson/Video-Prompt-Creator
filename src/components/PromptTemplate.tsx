import React, { useState } from 'react';
import { Copy, Check, Terminal, Wand2 } from 'lucide-react';
import { Toast } from './Toast';

interface PromptTemplateProps {
  content: string;
  onRemix?: (instruction: string) => void;
}

export const PromptTemplate: React.FC<PromptTemplateProps> = ({ content, onRemix }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
  };

  const remixOptions = [
    "Darker", "Brighter", "More Cinematic", "Shorter", "More Detailed"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2 text-purple-400">
          <Terminal className="w-5 h-5" />
          <span className="font-mono text-sm font-medium tracking-wider">PROMPT_OUTPUT</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 border border-white/5 hover:border-white/20 group"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
          <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy Prompt'}</span>
        </button>
      </div>

      <div className="p-6 font-mono text-sm leading-relaxed text-gray-300 overflow-x-auto">
        <pre className="whitespace-pre-wrap">
          {content.split('\n').map((line, i) => {
            const [key, ...rest] = line.split(':');
            if (rest.length > 0 && !line.startsWith(' ')) {
              return (
                <div key={i} className="mb-1">
                  <span className="text-purple-400 font-bold">{key}:</span>
                  <span className="text-gray-100">{rest.join(':')}</span>
                </div>
              );
            }
            return <div key={i} className="text-gray-400">{line}</div>;
          })}
        </pre>
      </div>

      {/* Remix Bar */}
      {onRemix && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mr-2">
            <Wand2 className="w-3 h-3" />
            <span>Remix:</span>
          </div>
          {remixOptions.map((option) => (
            <button
              key={option}
              onClick={() => onRemix(option)}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 text-xs text-gray-300 hover:text-purple-300 transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <Toast
        message="Prompt copied to clipboard!"
        isVisible={copied}
        onClose={() => setCopied(false)}
      />
    </div>
  );
};
