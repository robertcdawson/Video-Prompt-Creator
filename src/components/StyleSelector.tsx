import { Clapperboard, Package, Smartphone, Plus, Palette } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: string | null;
  onSelect: (style: string | null) => void;
  customStyles?: Array<{ id: string; label: string; description: string }>;
  onAddCustom?: () => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect, customStyles = [], onAddCustom }) => {
  const defaultStyles = [
    { id: 'CINEMATIC', label: 'Cinematic', icon: Clapperboard, color: 'from-blue-500 to-purple-600' },
    { id: 'PRODUCT', label: 'Product', icon: Package, color: 'from-emerald-500 to-teal-600' },
    { id: 'SOCIAL', label: 'Social', icon: Smartphone, color: 'from-orange-500 to-pink-600' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {defaultStyles.map((style) => {
        const isSelected = selectedStyle === style.id;
        const Icon = style.icon;

        return (
          <button
            key={style.id}
            onClick={() => onSelect(isSelected ? null : style.id)}
            className={`
              relative group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
              ${isSelected
                ? `bg-gradient-to-r ${style.color} border-transparent text-white shadow-lg`
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white'}
            `}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'animate-pulse' : ''}`} />
            <span className="font-medium text-sm">{style.label}</span>
            {isSelected && (
              <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" />
            )}
          </button>
        );
      })}

      {/* Custom Styles */}
      {customStyles.map((style) => {
        const isSelected = selectedStyle === style.id;
        return (
          <button
            key={style.id}
            onClick={() => onSelect(isSelected ? null : style.id)}
            className={`
              relative group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
              ${isSelected
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 border-transparent text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white'}
            `}
          >
            <Palette className={`w-4 h-4 ${isSelected ? 'animate-pulse' : ''}`} />
            <span className="font-medium text-sm">{style.label}</span>
          </button>
        );
      })}

      {/* Add New Button */}
      {onAddCustom && (
        <button
          onClick={onAddCustom}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm">Add Style</span>
        </button>
      )}
    </div>
  );
};
