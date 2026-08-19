import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Coupon } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartMRP,
    cartDiscount,
    cartTotal,
    cartCount,
    freeShippingThreshold,
    remainingForFreeShipping,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    setIsCheckoutOpen,
    openProductDetail,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showCouponsList, setShowCouponsList] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (code: string) => {
    setCouponError(null);
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setShowCouponsList(false);
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const percentToFreeShip = Math.min(
    100,
    Math.round(((freeShippingThreshold - remainingForFreeShipping) / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-md h-full bg-zinc-900 border-l border-zinc-800 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="text-base font-black font-brand text-white uppercase tracking-wider">
              SHOPPING BAG ({cartCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-zinc-950/90 border-b border-zinc-800 p-3.5">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <div className="flex items-center gap-1.5 text-zinc-200">
              <Truck className="w-4 h-4 text-cyan-400" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-bold">You unlocked FREE Express Delivery!</span>
              ) : (
                <span>
                  Add <strong className="text-white">₹{remainingForFreeShipping.toLocaleString()}</strong> more for FREE Shipping!
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-zinc-400">{percentToFreeShip}%</span>
          </div>

          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                remainingForFreeShipping === 0 ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-white'
              }`}
              style={{ width: `${percentToFreeShip}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 flex flex-col items-center justify-center">
              <ShoppingBag className="w-12 h-12 stroke-[1] mb-3 text-zinc-600" />
              <p className="text-sm font-mono text-zinc-300 font-bold mb-1">YOUR BAG IS EMPTY</p>
              <p className="text-xs font-sans text-zinc-500 max-w-xs mb-6">
                Discover our latest heavyweight oversized drops and limited archival pieces.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-white text-zinc-950 font-black font-mono text-xs rounded-full hover:bg-zinc-200 transition"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-3"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => {
                    openProductDetail(item.product);
                    setIsCartOpen(false);
                  }}
                  className="w-20 aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 shrink-0 cursor-pointer"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          openProductDetail(item.product);
                          setIsCartOpen(false);
                        }}
                        className="text-xs font-bold text-white hover:underline cursor-pointer line-clamp-1"
                      >
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mt-1">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                      <span>•</span>
                      <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-white font-bold">
                        {item.selectedSize}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-850">
                    <div className="flex items-center border border-zinc-800 bg-zinc-900 rounded-xl">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-black font-mono text-white">
                        ₹{(item.priceAtAddition * item.quantity).toLocaleString()}
                      </span>
                      {item.product.originalPrice > item.priceAtAddition && (
                        <span className="block text-[10px] font-mono text-zinc-500 line-through">
                          ₹{(item.product.originalPrice * item.quantity).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Coupon & Discount Section */}
          {cart.length > 0 && (
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-3 text-xs font-mono mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  APPLY PROMO / COUPON
                </span>
                <button
                  type="button"
                  onClick={() => setShowCouponsList(!showCouponsList)}
                  className="text-cyan-400 hover:underline text-[11px]"
                >
                  {showCouponsList ? 'Hide Coupons' : 'View All'}
                </button>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-white font-bold">{appliedCoupon.code} APPLIED</div>
                      <div className="text-[10px] text-emerald-300">{appliedCoupon.title}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-red-400 text-xs font-bold px-2 py-1 bg-zinc-900 rounded-lg"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. STREET20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white uppercase placeholder-zinc-600 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(couponInput)}
                    className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl transition"
                  >
                    APPLY
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-400 mt-1.5">{couponError}</p>
              )}

              {/* Expandable available coupons */}
              {showCouponsList && !appliedCoupon && (
                <div className="mt-3 space-y-2 pt-2 border-t border-zinc-800">
                  {coupons.map((c) => (
                    <div
                      key={c.code}
                      className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800"
                    >
                      <div>
                        <div className="text-amber-400 font-bold">{c.code}</div>
                        <div className="text-[10px] text-zinc-400">{c.description}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-white hover:text-zinc-950 text-white rounded-lg text-[10px] font-bold transition"
                      >
                        APPLY
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Price Breakdown */}
          {cart.length > 0 && (
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-3.5 space-y-2 text-xs font-mono">
              <div className="text-zinc-400 font-bold uppercase tracking-wider mb-2">
                ORDER SUMMARY
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total MRP</span>
                <span>₹{cartMRP.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Bag Discount</span>
                  <span>-₹{cartDiscount.toLocaleString()}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-amber-400">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>
                    -₹
                    {(
                      cartMRP -
                      cartDiscount -
                      (cartTotal - (remainingForFreeShipping === 0 ? 0 : 149))
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Estimated Delivery</span>
                <span>{remainingForFreeShipping === 0 ? 'FREE' : '₹149'}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-black text-white">
                <span>Total Payable</span>
                <span className="text-base font-mono">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900 sticky bottom-0 z-10">
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full flex items-center justify-between py-3.5 px-5 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs tracking-wider rounded-2xl transition active:scale-98 shadow-xl"
            >
              <div className="text-left">
                <span className="block text-[10px] text-zinc-600 font-bold">TOTAL AMOUNT</span>
                <span className="text-sm font-black">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span>CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
