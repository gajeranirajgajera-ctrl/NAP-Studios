import React, { useState } from 'react';
import {
  HelpCircle,
  Ruler,
  Sparkles,
  X,
} from 'lucide-react';
import { Product } from '../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, product }) => {
  const [unit, setUnit] = useState<'INCHES' | 'CM'>('INCHES');
  const [userHeight, setUserHeight] = useState('175');
  const [userWeight, setUserWeight] = useState('72');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTops = !product || ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets', 'Shirts'].includes(product.category);

  const topSizesInches = [
    { size: 'XS', chest: '40"', length: '27"', shoulder: '20.5"' },
    { size: 'S', chest: '42"', length: '28"', shoulder: '21.5"' },
    { size: 'M', chest: '44"', length: '29"', shoulder: '22.5"' },
    { size: 'L', chest: '46"', length: '30"', shoulder: '23.5"' },
    { size: 'XL', chest: '48"', length: '31"', shoulder: '24.5"' },
    { size: 'XXL', chest: '50"', length: '32"', shoulder: '25.5"' },
  ];

  const topSizesCm = [
    { size: 'XS', chest: '101 cm', length: '68 cm', shoulder: '52 cm' },
    { size: 'S', chest: '106 cm', length: '71 cm', shoulder: '54 cm' },
    { size: 'M', chest: '112 cm', length: '74 cm', shoulder: '57 cm' },
    { size: 'L', chest: '117 cm', length: '76 cm', shoulder: '60 cm' },
    { size: 'XL', chest: '122 cm', length: '79 cm', shoulder: '62 cm' },
    { size: 'XXL', chest: '127 cm', length: '81 cm', shoulder: '65 cm' },
  ];

  const bottomSizesInches = [
    { size: 'S (30)', waist: '30-31"', length: '40"', thigh: '26"' },
    { size: 'M (32)', waist: '32-33"', length: '41"', thigh: '27.5"' },
    { size: 'L (34)', waist: '34-35"', length: '42"', thigh: '29"' },
    { size: 'XL (36)', waist: '36-37"', length: '42.5"', thigh: '30.5"' },
  ];

  const calculateFit = () => {
    const w = parseFloat(userWeight);
    if (w < 60) setRecommendedSize('XS (Oversized) or S (Regular)');
    else if (w < 70) setRecommendedSize('S (Oversized) or M (True Fit)');
    else if (w < 82) setRecommendedSize('M (Standard Streetwear Fit)');
    else if (w < 95) setRecommendedSize('L (Boxy Oversized)');
    else setRecommendedSize('XL or XXL');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-in fade-in select-none overflow-y-auto">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-base font-black font-brand text-white uppercase tracking-wider">
                SIZE & FIT GUIDE
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Fit profile: <strong className="text-white">{product?.fit || 'Boxy Heavyweight'}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-mono text-zinc-300 font-bold">GARMENT DIMENSIONS</span>
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setUnit('INCHES')}
              className={`px-3 py-1 rounded-lg transition ${
                unit === 'INCHES' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-zinc-400'
              }`}
            >
              INCHES
            </button>
            <button
              type="button"
              onClick={() => setUnit('CM')}
              className={`px-3 py-1 rounded-lg transition ${
                unit === 'CM' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-zinc-400'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 mb-6 bg-zinc-950/60">
          {isTops ? (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase">
                <tr>
                  <th className="p-3">SIZE</th>
                  <th className="p-3">CHEST</th>
                  <th className="p-3">LENGTH</th>
                  <th className="p-3">SHOULDER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-200">
                {(unit === 'INCHES' ? topSizesInches : topSizesCm).map((row) => (
                  <tr key={row.size} className="hover:bg-zinc-900/50">
                    <td className="p-3 font-bold text-white">{row.size}</td>
                    <td className="p-3">{row.chest}</td>
                    <td className="p-3">{row.length}</td>
                    <td className="p-3">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase">
                <tr>
                  <th className="p-3">SIZE</th>
                  <th className="p-3">WAIST</th>
                  <th className="p-3">LENGTH</th>
                  <th className="p-3">THIGH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-200">
                {bottomSizesInches.map((row) => (
                  <tr key={row.size} className="hover:bg-zinc-900/50">
                    <td className="p-3 font-bold text-white">{row.size}</td>
                    <td className="p-3">{row.waist}</td>
                    <td className="p-3">{row.length}</td>
                    <td className="p-3">{row.thigh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* AI Fit Estimator Tool */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl mb-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>FIND YOUR PERFECT FIT</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3 text-xs font-mono">
            <div>
              <label className="block text-zinc-400 mb-1">HEIGHT (CM)</label>
              <input
                type="number"
                value={userHeight}
                onChange={(e) => setUserHeight(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">WEIGHT (KG)</label>
              <input
                type="number"
                value={userWeight}
                onChange={(e) => setUserWeight(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={calculateFit}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold rounded-xl transition"
          >
            CALCULATE RECOMMENDED SIZE
          </button>

          {recommendedSize && (
            <div className="mt-3 p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center animate-in fade-in">
              <span className="text-[11px] font-mono text-emerald-300">
                Recommended: <strong>{recommendedSize}</strong>
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-white text-zinc-950 font-black font-mono text-xs rounded-2xl tracking-wider hover:bg-zinc-200 transition"
        >
          DONE
        </button>
      </div>
    </div>
  );
};
