import React from 'react';
import { History, Clock, Trash2, ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  style: string;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear, isOpen, onToggle }) => {
  return (
    <>
      {/* Toggle Button (Visible when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-gray-900/80 backdrop-blur-md p-2 rounded-r-xl border border-white/10 hover:bg-gray-800 transition-all z-40 group"
        >
          <History className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-gray-950/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400">
              <History className="w-5 h-5" />
              <h2 className="font-semibold">History</h2>
            </div>
            <button onClick={onToggle} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No history yet</p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">{item.style || 'General'}</span>
                    <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-white transition-colors">
                    {item.prompt}
                  </p>
                </button>
              ))
            )}
          </div>

          {history.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <button
                onClick={onClear}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};
