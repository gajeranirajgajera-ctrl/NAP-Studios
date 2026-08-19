import React, { useState } from 'react';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Crown,
  Download,
  Edit3,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  MapPin,
  Package,
  Plus,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address } from '../types';

export const AccountView: React.FC = () => {
  const {
    user,
    orders,
    savedAddresses,
    wishlist,
    products,
    openOrderTracking,
    requestAdminAccess,
    isAdminAuthenticated,
    setActiveTab,
    openProductDetail,
    updateUserProfile,
    showToast,
  } = useShop();

  const [activeAccountSubTab, setActiveAccountSubTab] = useState<'ORDERS' | 'ADDRESSES' | 'WALLET' | 'SETTINGS'>('ORDERS');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim() || 'Sangita Patel',
      email: editEmail.trim() || 'patelsangita28480@gmail.com',
      phone: editPhone.trim() || '+91 98765 43210',
      avatar: editAvatar.trim() || user.avatar,
    });
    setIsEditProfileOpen(false);
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 select-none">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-zinc-950 p-1 rounded-full border-2 border-zinc-900">
                <Crown className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-brand text-white uppercase tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-amber-300 font-mono text-[10px] font-bold tracking-wider">
                  {user.membershipTier}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditName(user.name);
                    setEditEmail(user.email);
                    setEditPhone(user.phone || '');
                    setEditAvatar(user.avatar);
                    setIsEditProfileOpen(true);
                  }}
                  className="p-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition ml-1"
                  title="Edit Account Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 mt-1.5">
                <span>Member since {user.memberSince}</span>
                <span>•</span>
                <span className="text-cyan-400">{user.loyaltyPoints.toLocaleString()} Studio Points</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditName(user.name);
                setEditEmail(user.email);
                setEditPhone(user.phone || '');
                setEditAvatar(user.avatar);
                setIsEditProfileOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-mono text-xs font-bold rounded-2xl transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>EDIT PROFILE</span>
            </button>

            {/* Admin Portal Quick Switch Button */}
            <button
              type="button"
              onClick={requestAdminAccess}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-white hover:text-zinc-950 text-zinc-200 border border-zinc-700 font-mono text-xs font-bold rounded-2xl transition shadow-md"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{isAdminAuthenticated ? 'STUDIO ADMIN' : 'OWNER ACCESS'}</span>
            </button>
          </div>
        </div>

        {/* 4-Stat Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-zinc-800/80 font-mono text-xs">
          <div
            onClick={() => setActiveAccountSubTab('ORDERS')}
            className="p-3 bg-zinc-950/60 hover:bg-zinc-950 rounded-2xl border border-zinc-850 cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[10px]">TOTAL ORDERS</span>
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-black text-white">{orders.length}</div>
          </div>

          <div
            onClick={() => setActiveTab('WISHLIST')}
            className="p-3 bg-zinc-950/60 hover:bg-zinc-950 rounded-2xl border border-zinc-850 cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[10px]">WISHLIST PIECES</span>
              <Heart className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <div className="text-lg font-black text-white">{wishlist.length}</div>
          </div>

          <div
            onClick={() => setActiveAccountSubTab('WALLET')}
            className="p-3 bg-zinc-950/60 hover:bg-zinc-950 rounded-2xl border border-zinc-850 cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[10px]">STUDIO CREDITS</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-400">₹{user.storeCredits.toLocaleString()}</div>
          </div>

          <div
            onClick={() => setActiveAccountSubTab('ADDRESSES')}
            className="p-3 bg-zinc-950/60 hover:bg-zinc-950 rounded-2xl border border-zinc-850 cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[10px]">SAVED ADDRESSES</span>
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-white">{savedAddresses.length}</div>
          </div>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
        {[
          { id: 'ORDERS', label: `ORDER HISTORY (${orders.length})`, icon: Package },
          { id: 'WALLET', label: 'POINTS & WALLET', icon: Sparkles },
          { id: 'ADDRESSES', label: `ADDRESSES (${savedAddresses.length})`, icon: MapPin },
          { id: 'SETTINGS', label: 'SETTINGS & PRIVACY', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAccountSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveAccountSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-white text-zinc-950 shadow-md'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= 1. ORDER HISTORY ================= */}
      {activeAccountSubTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-400 font-bold uppercase tracking-wider">
              YOUR PURCHASES & SHIPMENTS
            </span>
            <span className="text-zinc-500">{orders.length} Total</span>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 bg-zinc-900/60 rounded-3xl border border-zinc-800 text-center font-mono p-6">
              <Package className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <div className="text-white font-bold text-sm">NO ORDERS PLACED YET</div>
              <p className="text-zinc-400 font-sans text-xs max-w-sm mx-auto mt-1 mb-4">
                Explore our heavyweight oversized tees and limited drop outerwear.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('HOME')}
                className="px-6 py-2.5 bg-white text-zinc-950 font-bold rounded-full text-xs"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 font-mono text-xs space-y-4 shadow-lg hover:border-zinc-700 transition"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                        {ord.currentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">
                      Placed on {ord.createdAt} • Estimated Delivery: <strong className="text-zinc-200">{ord.estimatedDelivery}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-white">
                      ₹{ord.finalTotal.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-500">{ord.paymentMethod} • {ord.paymentStatus}</div>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="space-y-2">
                  {ord.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openProductDetail(item.product)}
                      className="flex items-center justify-between p-2 rounded-2xl bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-850 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover rounded-xl bg-zinc-900"
                        />
                        <div>
                          <h4 className="text-white font-bold text-xs">{item.product.name}</h4>
                          <div className="text-[10px] text-zinc-400">
                            {item.selectedColor.name} • Size {item.selectedSize} • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>

                      <span className="font-bold text-white">
                        ₹{(item.priceAtAddition * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Tracker & Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    <span>Courier: {ord.courierPartner} (AWB: {ord.trackingId})</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => showToast(`Invoice downloaded for ${ord.orderNumber}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-xl transition text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>INVOICE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openOrderTracking(ord)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl transition text-xs shadow-md"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>TRACK LIVE TIMELINE</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= 2. WALLET & POINTS ================= */}
      {activeAccountSubTab === 'WALLET' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Store Credits Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-bold uppercase">NAP STORE CREDITS</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                ₹{user.storeCredits.toLocaleString()}
              </div>
              <p className="text-zinc-400 font-sans text-xs">
                Automatically applicable at checkout for instant cash discounts on any drop.
              </p>
            </div>

            {/* Loyalty Points Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-bold uppercase">STUDIO LOYALTY POINTS</span>
                <Crown className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                {user.loyaltyPoints.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">PTS</span>
              </div>
              <p className="text-zinc-400 font-sans text-xs">
                Earn 100 points for every ₹1,000 spent. Redeemable for exclusive vault access.
              </p>
            </div>
          </div>

          {/* VIP Black Perks List */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>VIP BLACK TIER BENEFITS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="text-white font-bold mb-1">Free Express Air</div>
                <div className="text-zinc-400 text-[11px]">Unlimited zero-fee priority dispatch on all carts.</div>
              </div>
              <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="text-white font-bold mb-1">Vault Early Access</div>
                <div className="text-zinc-400 text-[11px]">Shop limited drops 2 hours before the public countdown.</div>
              </div>
              <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="text-white font-bold mb-1">Dedicated Concierge</div>
                <div className="text-zinc-400 text-[11px]">Direct WhatsApp styling and fit consultation hotline.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. SAVED ADDRESSES ================= */}
      {activeAccountSubTab === 'ADDRESSES' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-bold uppercase tracking-wider">
              YOUR SAVED DESTINATIONS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-2 relative group hover:border-zinc-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span>{addr.fullName}</span>
                    <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                      {addr.type}
                    </span>
                  </div>
                  {addr.isDefault && (
                    <span className="text-[10px] text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                      DEFAULT
                    </span>
                  )}
                </div>

                <p className="text-zinc-400 font-sans text-xs">
                  {addr.addressLine1}, {addr.addressLine2}
                </p>
                <p className="text-zinc-400 font-sans text-xs">
                  {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                </p>
                <p className="text-[11px] text-zinc-500">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. SETTINGS & PRIVACY ================= */}
      {activeAccountSubTab === 'SETTINGS' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 font-mono text-xs">
          <span className="font-bold text-white uppercase tracking-wider block border-b border-zinc-800 pb-3">
            PREFERENCES & SECURITY
          </span>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div>
                <div className="text-white font-bold">Drop Notifications (SMS / WhatsApp)</div>
                <div className="text-zinc-500 text-[11px]">Receive instant alert 15 mins before vault drop launches</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-cyan-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div>
                <div className="text-white font-bold">Order Tracking Status Alerts</div>
                <div className="text-zinc-500 text-[11px]">Live WhatsApp push updates for dispatch and delivery</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-cyan-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div>
                <div className="text-white font-bold">Measurement Sync</div>
                <div className="text-zinc-500 text-[11px]">Remember my size profile across devices</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-cyan-400" />
            </div>
          </div>

          {/* Brand Owner Studio Management Gateway */}
          <div className="pt-4 border-t border-zinc-800/80">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>BRAND OWNER PORTAL</span>
                  {isAdminAuthenticated && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                      UNLOCKED
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Protected with master studio key. Manage inventory, drops, coupons, and fulfillment.
                </p>
              </div>

              <button
                type="button"
                onClick={requestAdminAccess}
                className="w-full sm:w-auto px-4 py-2.5 bg-zinc-900 hover:bg-white hover:text-zinc-950 text-white border border-zinc-700 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAdminAuthenticated ? 'OPEN STUDIO PORTAL' : 'ENTER MASTER PASSCODE'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase">EDIT ACCOUNT PROFILE</h3>
                  <p className="text-[10px] text-zinc-400">Personalize your name and email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-zinc-400 mb-1 font-bold uppercase text-[10px]">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Sangita Patel"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold uppercase text-[10px]">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="patelsangita28480@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold uppercase text-[10px]">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-wider rounded-xl transition shadow-lg"
                >
                  SAVE PROFILE CHANGES
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-3 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
