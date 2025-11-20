import { useState, useEffect } from 'react';
import { Settings, Video, Sparkles } from 'lucide-react';
import { PromptInput } from './components/PromptInput';
import { PromptTemplate } from './components/PromptTemplate';
import { SettingsModal } from './components/SettingsModal';
import { StyleSelector } from './components/StyleSelector';
import { HistorySidebar } from './components/HistorySidebar';
import { CustomStyleModal } from './components/CustomStyleModal';
import { generateVideoPrompt } from './services/gemini';

/**
 * Main Application Component
 * 
 * Manages the global state for the application, including:
 * - API Key management (persistence via localStorage)
 * - User input and selected style
 * - Interaction with the Gemini service
 * - Displaying results and errors
 * - Prompt History
 */
function App() {
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userIdea, setUserIdea] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Style State - Relaxed type to allow custom strings
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [customStyles, setCustomStyles] = useState<Array<{ id: string; label: string; description: string }>>([]);
  const [isCustomStyleModalOpen, setIsCustomStyleModalOpen] = useState(false);

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);

    const storedHistory = localStorage.getItem('prompt_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const storedCustomStyles = localStorage.getItem('custom_styles');
    if (storedCustomStyles) {
      try {
        setCustomStyles(JSON.parse(storedCustomStyles));
      } catch (e) {
        console.error("Failed to parse custom styles", e);
      }
    }
  }, []);

  const handleSaveCustomStyle = (name: string, description: string) => {
    const newStyle = {
      id: `CUSTOM_${Date.now()}`,
      label: name,
      description: description
    };
    const updatedStyles = [...customStyles, newStyle];
    setCustomStyles(updatedStyles);
    localStorage.setItem('custom_styles', JSON.stringify(updatedStyles));
    setSelectedStyle(newStyle.id); // Auto-select new style
  };

  const saveToHistory = (prompt: string, style: string) => {
    const newItem = {
      id: Date.now().toString(),
      prompt, // We save the RESULT prompt, or maybe the input? Let's save the result for now as that's what users want to recall.
      // Actually, saving the INPUT might be better for "Remixing", but saving the OUTPUT is better for "Copying again".
      // Let's save the output prompt for now as the primary value.
      timestamp: Date.now(),
      style: style || 'Auto'
    };

    const newHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem('prompt_history', JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('prompt_history');
  };

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleOptimize = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if selected style is a custom one
      const customStyle = customStyles.find(s => s.id === selectedStyle);

      // If it's a custom style, we might need to pass the description to Gemini
      // The current generateVideoPrompt expects a keyof PROMPT_FLAVORS or null.
      // We need to update generateVideoPrompt to accept custom instructions too.
      // For now, let's pass the ID, and we'll update gemini.ts next.

      const result = await generateVideoPrompt(userIdea, apiKey, selectedStyle, customStyle?.description);
      setGeneratedPrompt(result);
      saveToHistory(result, customStyle ? customStyle.label : (selectedStyle || 'Auto'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the prompt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10">
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                VideoPrompt<span className="font-light">Creator</span>
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </nav>

        <HistorySidebar
          history={history}
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
          onSelect={(item) => {
            setGeneratedPrompt(item.prompt);
            // Optionally set the style too if we saved it?
            // setSelectedStyle(item.style as any); 
            setIsHistoryOpen(false);
          }}
          onClear={handleClearHistory}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* Left Column: Input & Controls */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Cinematic</span> Video Prompts
                </h1>
                <p className="text-lg text-gray-400 max-w-xl">
                  Transform your ideas into professional, detailed prompts for Veo 3, Sora 2, and other AI video models.
                </p>
              </div>

              <StyleSelector
                selectedStyle={selectedStyle}
                onSelect={setSelectedStyle}
                customStyles={customStyles}
                onAddCustom={() => setIsCustomStyleModalOpen(true)}
              />

              <div className="bg-gray-900/50 backdrop-blur-sm p-1 rounded-2xl border border-white/10 shadow-xl">
                <PromptInput
                  value={userIdea}
                  onChange={setUserIdea}
                  onOptimize={handleOptimize}
                  isGenerating={isLoading}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column: Output (Sticky on Desktop) */}
            <div className="lg:sticky lg:top-24 space-y-6">
              {generatedPrompt ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Optimized Result</span>
                  </div>
                  <PromptTemplate
                    content={generatedPrompt}
                    onRemix={(instruction) => {
                      // For remixing, we append the instruction to the user idea and re-optimize
                      // Ideally, we'd send the *previous output* + instruction, but the current API structure
                      // is simpler if we just append to the input. 
                      // BETTER APPROACH: Let's append to the userIdea state so the user sees it, 
                      // then trigger optimization? Or just trigger it internally?
                      // Let's trigger internally for a smoother flow.
                      const newIdea = `${userIdea} (Make it ${instruction})`;
                      setUserIdea(newIdea);
                      // We can't easily auto-trigger optimize here because state updates are async.
                      // Let's just update the input and let the user click optimize, OR
                      // we can call the API directly.
                      // Let's call API directly for "Magic" feel.
                      setIsLoading(true);

                      // Check for custom style
                      const customStyle = customStyles.find(s => s.id === selectedStyle);

                      generateVideoPrompt(newIdea, apiKey, selectedStyle, customStyle?.description)
                        .then(result => {
                          setGeneratedPrompt(result);
                          saveToHistory(result, customStyle ? customStyle.label : (selectedStyle || 'Auto'));
                        })
                        .catch(err => setError(err.message))
                        .finally(() => setIsLoading(false));
                    }}
                  />
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                  <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">Your optimized prompt will appear here</p>
                </div>
              )}
            </div>

          </div>
        </main>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          apiKey={apiKey}
          onSave={handleSaveKey}
        />

        <CustomStyleModal
          isOpen={isCustomStyleModalOpen}
          onClose={() => setIsCustomStyleModalOpen(false)}
          onSave={handleSaveCustomStyle}
        />
      </div>
    </div>
  );
}

export default App;
