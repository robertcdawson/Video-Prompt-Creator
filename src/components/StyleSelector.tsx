import { Clapperboard, Package, Smartphone, Plus, Palette, Trash2 } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: string | null;
  onSelect: (style: string | null) => void;
  customStyles?: Array<{ id: string; label: string; description: string }>;
  onAddCustom?: () => void;
  onDeleteCustom?: (id: string, e: React.MouseEvent) => void;
}

export function StyleSelector({
  selectedStyle,
  onSelect,
  customStyles = [],
  onAddCustom,
  onDeleteCustom
}: StyleSelectorProps) {
  const styles = [
    { id: 'CINEMATIC', label: 'Cinematic', icon: Clapperboard },
    { id: 'PRODUCT', label: 'Product', icon: Package },
    { id: 'SOCIAL', label: 'Social', icon: Smartphone },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        Style Flavor
      </label>
      <div className="flex flex-wrap gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(selectedStyle === style.id ? null : style.id)}
            className={`
              group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200
              ${selectedStyle === style.id
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'
              }
            `}
          >
            <style.icon className={`w-4 h-4 ${selectedStyle === style.id ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="font-medium">{style.label}</span>
          </button>
        ))}

        {/* Custom Styles */}
        {customStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(selectedStyle === style.id ? null : style.id)}
            className={`
              group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 pr-2
              ${selectedStyle === style.id
                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'
              }
            `}
          >
            <Palette className={`w-4 h-4 ${selectedStyle === style.id ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'}`} />
            <span className="font-medium">{style.label}</span>

            {onDeleteCustom && (
              <div
                onClick={(e) => onDeleteCustom(style.id, e)}
                className="ml-1 p-1.5 rounded-full hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors"
                title="Delete Style"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        ))}

        {/* Add Custom Button */}
        {onAddCustom && (
          <button
            onClick={onAddCustom}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/20 text-gray-500 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add Style</span>
          </button>
        )}
      </div>
    </div>
  );
}
