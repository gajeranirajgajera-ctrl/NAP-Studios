import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  ctaText: string;
  targetCategory?: string;
  hasTimer?: boolean;
}

export const HeroBannerCarousel: React.FC = () => {
  const { setActiveTab, setSelectedCategoryFilter } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners: BannerSlide[] = [
    {
      id: 'drop-01',
      badge: 'OFFICIAL STUDIO ARCHIVE',
      title: 'NAP CLOTHING STUDIO',
      subtitle: 'Minimalist Streetwear & Heavyweight Drops',
      tagline: 'Engineered for the contemporary avant-garde. Premium streetwear.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      ctaText: 'EXPLORE STORE',
      targetCategory: 'T-Shirts',
      hasTimer: true,
    },
    {
      id: 'drop-02',
      badge: 'STUDIO CRAFT // 2026',
      title: 'AVANT-GARDE SILHOUETTES',
      subtitle: 'High-Density Boxy Cuts & Tailored Textures',
      tagline: 'Engineered with precision craftsmanship and raw durability.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
      ctaText: 'VIEW CATEGORIES',
      targetCategory: 'Hoodies',
      hasTimer: false,
    },
    {
      id: 'drop-03',
      badge: 'VAULT ACCESS // ACTIVE',
      title: 'LIMITED VAULT ALLOCATION',
      subtitle: 'Exclusive Batches & Timed Capsule Releases',
      tagline: 'Upload apparel photos and schedule release drops in Admin Studio.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
      ctaText: 'DISCOVER VAULT',
      targetCategory: 'Jackets',
      hasTimer: false,
    },
  ];

  // Auto slide every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const currentBanner = banners[currentIndex];

  const handleCta = (category?: string) => {
    if (category) {
      setSelectedCategoryFilter(category);
      setActiveTab('CATEGORIES');
    } else {
      setActiveTab('CATEGORIES');
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-zinc-900 select-none">
      {/* Banner Slide */}
      <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] w-full">
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className="w-full h-full object-cover object-center brightness-75 transition-all duration-700 scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono tracking-widest uppercase mb-2.5 w-max">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{currentBanner.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-brand tracking-tighter text-white uppercase leading-none mb-2">
            {currentBanner.title}
          </h1>

          {/* Subtitle & Tagline */}
          <p className="text-sm sm:text-base font-semibold text-zinc-200 mb-1">
            {currentBanner.subtitle}
          </p>
          <p className="text-xs text-zinc-400 mb-4 hidden sm:block max-w-lg">
            {currentBanner.tagline}
          </p>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCta(currentBanner.targetCategory)}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs tracking-wider rounded-full transition active:scale-95 shadow-lg"
            >
              <span>{currentBanner.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {currentBanner.hasTimer && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-950/80 border border-zinc-700 text-amber-400 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[11px] font-bold">ENDS IN 18:42:10</span>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/60 hover:bg-zinc-950 text-white backdrop-blur-sm border border-zinc-800 hidden sm:flex items-center justify-center transition"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/60 hover:bg-zinc-950 text-white backdrop-blur-sm border border-zinc-800 hidden sm:flex items-center justify-center transition"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
          {banners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
