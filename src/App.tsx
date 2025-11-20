import React, { useState, useEffect } from 'react';
import { Settings, Video, Sparkles } from 'lucide-react';
import { PromptInput } from './components/PromptInput';
import { PromptTemplate } from './components/PromptTemplate';
import { SettingsModal } from './components/SettingsModal';
import { StyleSelector } from './components/StyleSelector';
import { generateVideoPrompt } from './services/gemini';
import { PROMPT_FLAVORS } from './utils/promptTemplates';

/**
 * Main Application Component
 * 
 * Manages the global state for the application, including:
 * - API Key management (persistence via localStorage)
 * - User input and selected style
 * - Interaction with the Gemini service
 * - Displaying results and errors
 */
function App() {
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof PROMPT_FLAVORS | null>(null);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleOptimize = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const optimizedPrompt = await generateVideoPrompt(prompt, apiKey, selectedStyle);
      setResult(optimizedPrompt);
    } catch (err) {
      console.error(err);
      setError('Failed to generate prompt. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-[#0a0a0a] text-white p-8 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Aurora Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-2000" />
      </div>

      <div className="max-w-[1800px] mx-auto space-y-8 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">
                Video Prompt Creator
              </h1>
              <p className="text-sm text-white/40 font-medium">Optimize prompts for Veo 3 & Sora 2</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white/60 hover:text-white transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Input & Controls */}
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-white/60">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Select Style (Optional)</span>
                </div>
              </div>
              <StyleSelector selectedStyle={selectedStyle} onSelect={setSelectedStyle} />

              <PromptInput
                value={prompt}
                onChange={setPrompt}
                onOptimize={handleOptimize}
                isGenerating={isGenerating}
              />
            </section>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="lg:sticky lg:top-8 min-h-[200px]">
            {result ? (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PromptTemplate content={result} />
              </section>
            ) : (
              <div className="hidden lg:flex h-full min-h-[400px] items-center justify-center border border-white/5 rounded-xl bg-white/5 border-dashed text-white/20">
                <div className="text-center space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto opacity-50" />
                  <p className="text-sm font-medium">Optimized prompt will appear here</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSave={handleSaveKey}
      />
    </div>
  );
}

export default App;
