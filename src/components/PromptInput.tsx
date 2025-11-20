import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onOptimize: () => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onOptimize, isGenerating }) => {
  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your video idea in detail... (e.g., A cyberpunk detective walking in rain, neon lights reflecting on wet pavement, moody atmosphere)"
          className="w-full h-40 bg-[#1e1e1e] border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
        <div className="absolute bottom-4 right-4">
          <button
            onClick={onOptimize}
            disabled={isGenerating || !value.trim()}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
              ${isGenerating || !value.trim()
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20'}
            `}
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Optimizing...' : 'Optimize Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
};
