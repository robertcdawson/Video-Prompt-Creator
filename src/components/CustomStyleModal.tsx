import React, { useState } from 'react';
import { X, Save, Palette, Sparkles, Loader2 } from 'lucide-react';
import { optimizeStyleDescription } from '../services/gemini';

interface CustomStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  apiKey: string;
}

export const CustomStyleModal: React.FC<CustomStyleModalProps> = ({ isOpen, onClose, onSave, apiKey }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description) {
      onSave(name, description);
      setName('');
      setDescription('');
      onClose();
    }
  };

  const handleOptimize = async () => {
    if (!name && !description) return;

    setIsOptimizing(true);
    try {
      const optimized = await optimizeStyleDescription(name, description, apiKey);
      setDescription(optimized);
    } catch (error) {
      console.error("Failed to optimize style:", error);
      // Ideally show an error toast here, but for now we'll just log it
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-purple-400">
            <Palette className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">Create Custom Style</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Style Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Noir Detective, 80s Anime"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Description / Instructions</label>
              <button
                type="button"
                onClick={handleOptimize}
                disabled={isOptimizing || (!name && !description) || !apiKey}
                className="flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={!apiKey ? "API Key required" : "Use AI to expand your description"}
              >
                {isOptimizing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {isOptimizing ? 'Optimizing...' : 'Optimize with AI'}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the visual style, mood, lighting, and camera techniques..."
              className="w-full h-32 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name || !description}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Style
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
