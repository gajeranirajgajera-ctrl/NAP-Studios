import React from 'react';
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setActiveTab, openProductDetail } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <h1 className="text-xl sm:text-2xl font-black font-brand text-white uppercase tracking-tight">
              YOUR WISHLIST
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            {wishlistedProducts.length} Saved Streetwear & Archival Drops
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('CATALOG')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Browse More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      {wishlistedProducts.length === 0 ? (
        <div className="py-20 bg-zinc-900/40 border border-zinc-800 rounded-3xl text-center font-mono p-6 space-y-3">
          <Heart className="w-12 h-12 stroke-[1] text-zinc-600 mx-auto" />
          <div className="text-base font-bold text-white">YOUR WISHLIST IS EMPTY</div>
          <p className="text-xs font-sans text-zinc-400 max-w-sm mx-auto">
            Tap the heart icon on any oversized hoodie, graphic tee, or cargo trousers to save it here.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('HOME')}
            className="px-6 py-3 bg-white text-zinc-950 font-bold rounded-full text-xs hover:bg-zinc-200 transition mt-2 shadow-lg"
          >
            EXPLORE NEW DROPS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {wishlistedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
