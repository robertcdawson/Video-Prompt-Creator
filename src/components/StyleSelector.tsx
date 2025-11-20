import React from 'react';
import { Clapperboard, Package, Smartphone } from 'lucide-react';
import { PROMPT_FLAVORS } from '../utils/promptTemplates';

interface StyleSelectorProps {
  selectedStyle: keyof typeof PROMPT_FLAVORS | null;
  onSelect: (style: keyof typeof PROMPT_FLAVORS | null) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect }) => {
  const styles = [
    { id: 'CINEMATIC', label: 'Cinematic', icon: Clapperboard, color: 'from-blue-500 to-purple-600' },
    { id: 'PRODUCT', label: 'Product', icon: Package, color: 'from-emerald-500 to-teal-600' },
    { id: 'SOCIAL', label: 'Social', icon: Smartphone, color: 'from-orange-500 to-pink-600' },
  ] as const;

  return (
    <div className="flex flex-wrap gap-3">
      {styles.map((style) => {
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
    </div>
  );
};
