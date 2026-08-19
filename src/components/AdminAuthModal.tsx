import React, { useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthOpen,
    setIsAdminAuthOpen,
    verifyAdminPasscode,
    setIsAdminOpen,
    showToast,
  } = useShop();

  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  if (!isAdminAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the Studio Master Passcode.');
      return;
    }

    const isValid = verifyAdminPasscode(passcode);
    if (isValid) {
      setError(null);
      setPasscode('');
      setIsAdminAuthOpen(false);
      setIsAdminOpen(true);
      showToast('Admin access granted • Studio Mode Active');
    } else {
      setAttempts((prev) => prev + 1);
      setError('Incorrect passcode. Access restricted to brand owner.');
    }
  };

  return (
    <div
      id="admin-auth-modal"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in select-none"
    >
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black font-brand text-white uppercase tracking-wider">
                BRAND OWNER VERIFICATION
              </h3>
              <p className="text-[10px] font-mono text-zinc-400">Restricted Admin Access</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAdminAuthOpen(false);
              setError(null);
              setPasscode('');
            }}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-3 text-xs font-mono text-zinc-400 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Storefront Owner Protocol</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
            Enter the studio master secret key to manage live inventory, price drops, coupons, and orders.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-zinc-400 uppercase text-[10px] font-bold mb-1.5">
              STUDIO PASSCODE / KEY
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Enter master passcode (Default: NAP2026)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full bg-zinc-950 border rounded-2xl pl-4 pr-10 py-3 text-white placeholder-zinc-600 focus:outline-none transition ${
                  error ? 'border-red-500/60 ring-2 ring-red-500/20' : 'border-zinc-700 focus:border-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-[11px] text-red-400 mt-2 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Quick Info / Hint */}
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span>Default Master Key: <strong className="text-zinc-400 font-mono">NAP2026</strong></span>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs uppercase tracking-wider rounded-2xl transition shadow-lg active:scale-98"
            >
              AUTHENTICATE AS OWNER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
