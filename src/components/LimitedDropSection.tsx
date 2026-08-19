import React, { useEffect, useState } from 'react';
import {
  Clock,
  Flame,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const LimitedDropSection: React.FC = () => {
  const { products, openProductDetail } = useShop();

  const dropProducts = products.filter((p) => p.isLimitedDrop || p.discountPercent >= 35).slice(0, 2);

  // Live Countdown (HH:MM:SS)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 36, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="px-4 py-6 border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/30 to-zinc-950 select-none">
      {/* Drop Header Banner */}
      <div className="bg-gradient-to-r from-red-950/60 via-zinc-900 to-amber-950/60 border border-red-500/30 rounded-3xl p-4 sm:p-6 mb-5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-red-400 bg-red-950/90 border border-red-500/40 px-2.5 py-0.5 rounded-full uppercase">
                <Flame className="w-3 h-3 fill-red-400 animate-pulse" />
                LIMITED VAULT DROP
              </span>
              <span className="text-[10px] font-mono text-zinc-400">BATCH #04</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-brand text-white uppercase tracking-tight">
              HEAVYWEIGHT ARCHIVE VAULT
            </h2>
            <p className="text-xs text-zinc-300 font-sans mt-0.5">
              Strictly limited allocation. Once sold out, will not be restocked.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-zinc-950/90 border border-zinc-800 p-2.5 rounded-2xl shrink-0 w-max">
            <div className="text-center px-2">
              <div className="text-base sm:text-lg font-black font-mono text-white">
                {format2(timeLeft.hours)}
              </div>
              <div className="text-[8px] font-mono text-zinc-500 uppercase">HRS</div>
            </div>
            <span className="text-zinc-600 font-black">:</span>
            <div className="text-center px-2">
              <div className="text-base sm:text-lg font-black font-mono text-white">
                {format2(timeLeft.minutes)}
              </div>
              <div className="text-[8px] font-mono text-zinc-500 uppercase">MIN</div>
            </div>
            <span className="text-zinc-600 font-black">:</span>
            <div className="text-center px-2">
              <div className="text-base sm:text-lg font-black font-mono text-amber-400">
                {format2(timeLeft.seconds)}
              </div>
              <div className="text-[8px] font-mono text-zinc-500 uppercase">SEC</div>
            </div>
          </div>
        </div>

        {/* Stock Meter */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Vault Inventory: <strong>82% Claimed</strong></span>
          </div>
          <div className="w-full sm:w-48 h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 w-[82%] rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Drop Grid */}
      {dropProducts.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[1, 2].map((slot) => (
            <div
              key={slot}
              className="h-44 sm:h-56 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center p-4"
            >
              <Lock className="w-6 h-6 text-zinc-600 mb-2" />
              <span className="font-mono text-xs font-bold text-zinc-400 uppercase">
                VAULT DROP SLOT #{slot}
              </span>
              <span className="text-[10px] text-zinc-500 font-sans mt-1">
                Awaiting next exclusive collection release
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {dropProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </section>
  );
};
