import React, { useState } from 'react';
import {
  Heart,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  layout?: 'GRID_2' | 'GRID_1' | 'CAROUSEL';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'GRID_2' }) => {
  const { toggleWishlist, isWishlisted, openProductDetail, addToCart } = useShop();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickSize, setShowQuickSize] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const currentColor = product.colors[selectedColorIndex] || product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart(product, currentColor, size, 1);
    setShowQuickSize(false);
  };

  return (
    <div
      onClick={() => openProductDetail(product)}
      className="group relative flex flex-col justify-between bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-750 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 select-none shadow-sm"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onMouseEnter={() => {
            if (product.images.length > 1) {
              setCurrentImageIndex(1);
            }
          }}
          onMouseLeave={() => setCurrentImageIndex(0)}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isLimitedDrop && (
            <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 font-mono text-[9px] font-bold tracking-wider backdrop-blur-md uppercase">
              DROP EXCLUSIVE
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white text-zinc-950 font-mono text-[9px] font-black tracking-wider uppercase shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.gsm && (
            <span className="px-1.5 py-0.5 rounded-md bg-zinc-950/80 text-zinc-300 font-mono text-[9px] font-bold border border-zinc-700 backdrop-blur-sm">
              {product.gsm} GSM
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-150 z-10 ${
            wishlisted
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-zinc-950/60 hover:bg-zinc-950 text-zinc-300 hover:text-white border border-zinc-800'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover / Trigger */}
        <div className="absolute inset-x-2 bottom-2 z-10">
          {showQuickSize ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950/95 border border-zinc-700 rounded-xl p-2 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5 px-1">
                <span>SELECT SIZE</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuickSize(false);
                  }}
                  className="text-zinc-500 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    disabled={s.stock === 0}
                    onClick={(e) => handleQuickAdd(e, s.size)}
                    className={`py-1 rounded text-[10px] font-mono font-bold transition ${
                      s.stock === 0
                        ? 'bg-zinc-900 text-zinc-600 line-through cursor-not-allowed'
                        : 'bg-zinc-800 hover:bg-white hover:text-zinc-950 text-zinc-200'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (product.sizes.length === 1 && product.sizes[0].size === 'ONE SIZE') {
                  addToCart(product, currentColor, 'ONE SIZE', 1);
                } else {
                  setShowQuickSize(true);
                }
              }}
              className="w-full py-2 bg-zinc-950/90 hover:bg-white text-zinc-200 hover:text-zinc-950 border border-zinc-700/80 rounded-xl font-mono text-[11px] font-bold tracking-wider flex items-center justify-center gap-1.5 backdrop-blur-md transition-all active:scale-98 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>QUICK ADD</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Tagline / Subcategory */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            <span className="truncate">{product.category}</span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-amber-400 shrink-0 font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-zinc-500 font-normal">({product.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold font-sans text-zinc-100 group-hover:text-white line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Fit description */}
          <p className="text-[10px] text-zinc-400 font-mono mb-2">
            Fit: <span className="text-zinc-300">{product.fit}</span>
          </p>
        </div>

        <div>
          {/* Color Swatches */}
          {product.colors.length > 1 && (
            <div
              className="flex items-center gap-1 mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              {product.colors.map((col, idx) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColorIndex(idx)}
                  title={col.name}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    selectedColorIndex === idx
                      ? 'scale-125 border-white ring-1 ring-zinc-700'
                      : 'border-zinc-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
              <span className="text-[9px] text-zinc-500 font-mono ml-1">
                +{product.colors.length}
              </span>
            </div>
          )}

          {/* Price Bar */}
          <div className="flex items-baseline gap-2 pt-1 border-t border-zinc-850">
            <span className="text-sm sm:text-base font-black font-mono text-white">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs font-mono text-zinc-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
