import React from 'react';
import {
  Flame,
  Gem,
  Layers,
  Scissors,
  Shield,
  Shirt,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CategoryPills: React.FC = () => {
  const { categories, setSelectedCategoryFilter, setActiveTab, selectedCategoryFilter } = useShop();

  const handleSelectCategory = (catName: string) => {
    if (selectedCategoryFilter === catName) {
      setSelectedCategoryFilter(null);
    } else {
      setSelectedCategoryFilter(catName);
    }
    setActiveTab('CATEGORIES');
  };

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 't-shirts':
        return <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'hoodies':
        return <Layers className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'jackets':
        return <Shield className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'jeans':
        return <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'sweatshirts':
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'shirts':
        return <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'trousers':
        return <Tag className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'shorts':
        return <Flame className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'accessories':
        return <Gem className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Tag className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="py-4 border-b border-zinc-900 bg-zinc-950/60 select-none">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
          CURATED CATEGORIES
        </h2>
        <button
          type="button"
          onClick={() => {
            setSelectedCategoryFilter(null);
            setActiveTab('CATEGORIES');
          }}
          className="text-[11px] font-mono text-zinc-400 hover:text-white transition"
        >
          VIEW ALL →
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategoryFilter === cat.name;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.name)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none"
            >
              <div
                className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-white text-zinc-950 shadow-lg shadow-white/10 scale-105 ring-2 ring-white'
                    : 'bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-850 hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.name)}
                {cat.badge && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 ring-2 ring-zinc-950" />
                )}
              </div>
              <span
                className={`text-[11px] font-mono font-medium tracking-tight truncate max-w-[72px] ${
                  isSelected ? 'text-white font-bold' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
