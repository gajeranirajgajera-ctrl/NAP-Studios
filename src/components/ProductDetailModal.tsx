import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Info,
  MapPin,
  Package,
  RefreshCw,
  Ruler,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, ProductColor } from '../types';
import { ProductCard } from './ProductCard';
import { ReviewModal } from './ReviewModal';
import { SizeGuideModal } from './SizeGuideModal';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductDetail,
    addToCart,
    toggleWishlist,
    isWishlisted,
    products,
    reviews,
    setIsCartOpen,
    setIsCheckoutOpen,
    showToast,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    selectedProduct?.colors[0] || { name: 'Default', hex: '#000', inStock: true }
  );
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [pincode, setPincode] = useState('560038');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>('Express Delivery in 24-48 Hours • Cash on Delivery Available');

  if (!selectedProduct) return null;

  const wishlisted = isWishlisted(selectedProduct.id);
  const productReviews = reviews.filter((r) => r.productId === selectedProduct.id);
  const relatedProducts = products
    .filter((p) => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.isTrending))
    .slice(0, 3);

  // Selected size stock check
  const selectedSizeObj = selectedProduct.sizes.find((s) => s.size === selectedSize);
  const isOutOfStock = selectedSizeObj ? selectedSizeObj.stock === 0 : false;
  const isLowStock = selectedSizeObj ? selectedSizeObj.stock > 0 && selectedSizeObj.stock <= 4 : false;

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus('Available for Express Dispatch! Estimated Delivery by Tomorrow 6:00 PM.');
      showToast('Pincode verified for Express Delivery');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian Postal Code.');
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, selectedColor, selectedSize, 1);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, selectedColor, selectedSize, 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedProduct.name} - NAP Clothing`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  return (
    <div
      id="pdp-root"
      className="fixed inset-0 z-50 bg-zinc-950 flex flex-col justify-between overflow-y-auto animate-in fade-in select-none"
    >
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900">
        <button
          type="button"
          onClick={closeProductDetail}
          className="flex items-center gap-2 text-zinc-300 hover:text-white font-mono text-xs font-bold p-1.5 rounded-full hover:bg-zinc-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">BACK TO CATALOG</span>
        </button>

        <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase truncate max-w-[200px]">
          {selectedProduct.category}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            aria-label="Share product"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => toggleWishlist(selectedProduct.id)}
            className={`p-2 rounded-full transition ${
              wishlisted ? 'text-pink-500 bg-zinc-900' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main PDP Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
          {/* LEFT: Image Gallery with Swiper & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {selectedProduct.isLimitedDrop && (
                  <span className="px-3 py-1 rounded-full bg-red-950/90 border border-red-500/50 text-red-300 font-mono text-xs font-bold tracking-widest uppercase backdrop-blur-md flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" /> LIMITED DROP
                  </span>
                )}
                {selectedProduct.discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full bg-white text-zinc-950 font-mono text-xs font-black tracking-wider uppercase shadow-md">
                    {selectedProduct.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Navigation Arrows for Images */}
              {selectedProduct.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/70 hover:bg-zinc-950 text-white backdrop-blur-md border border-zinc-800 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        (prev + 1) % selectedProduct.images.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/70 hover:bg-zinc-950 text-white backdrop-blur-md border border-zinc-800 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-white ring-2 ring-white/20'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Specs & Options */}
          <div className="space-y-6">
            {/* Title & Price Header */}
            <div className="border-b border-zinc-850 pb-5">
              {selectedProduct.tagline && (
                <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedProduct.tagline}</span>
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-black font-brand text-white uppercase tracking-tight leading-snug mb-2">
                {selectedProduct.name}
              </h1>

              {/* Rating & Review counter */}
              <div className="flex items-center gap-3 text-xs font-mono mb-4">
                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedProduct.rating}</span>
                </div>
                <span className="text-zinc-400">
                  Based on <strong>{selectedProduct.reviewCount}</strong> verified reviews
                </span>
              </div>

              {/* Price Display in Indian Rupees */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black font-mono text-white">
                  ₹{selectedProduct.price.toLocaleString()}
                </span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-base font-mono text-zinc-500 line-through">
                    ₹{selectedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  SAVE ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()} ({selectedProduct.discountPercent}%)
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-500 mt-1">Inclusive of all duties & taxes. Free shipping on this piece.</p>
            </div>

            {/* Color Swatch Selector */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="text-zinc-400">
                  COLOR: <strong className="text-white">{selectedColor.name}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {selectedProduct.colors.map((color) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
                        isSelected
                          ? 'border-white bg-zinc-900 shadow-sm'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className={`text-xs font-mono ${isSelected ? 'font-bold text-white' : 'text-zinc-400'}`}>
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector with Stock Warnings */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">SIZE: <strong className="text-white">{selectedSize}</strong></span>
                  {isLowStock && (
                    <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded font-bold animate-pulse">
                      Only {selectedSizeObj?.stock} left!
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="text-[10px] text-red-400 bg-red-950/80 px-2 py-0.5 rounded font-bold">
                      Sold out in this size
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>SIZE GUIDE</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {selectedProduct.sizes.map((s) => {
                  const isSelected = selectedSize === s.size;
                  const noStock = s.stock === 0;

                  return (
                    <button
                      key={s.size}
                      type="button"
                      disabled={noStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`py-3 rounded-2xl text-xs font-mono font-bold transition relative ${
                        noStock
                          ? 'bg-zinc-950 border border-zinc-850 text-zinc-600 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-white text-zinc-950 shadow-md ring-2 ring-white/30'
                          : 'bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pincode & Delivery Checker */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white mb-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>DELIVERY ESTIMATE & COD</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2 mb-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold rounded-xl transition"
                >
                  CHECK
                </button>
              </form>

              {pincodeStatus && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{pincodeStatus}</span>
                </div>
              )}
            </div>

            {/* Product Overview & Fabric Specs */}
            <div className="space-y-4 pt-2 border-t border-zinc-850 text-xs font-mono">
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-400" />
                  FABRIC COMPOSITION & CRAFTSMANSHIP
                </h3>
                <p className="text-zinc-300 font-sans text-xs leading-relaxed mb-3">
                  {selectedProduct.description}
                </p>

                <div className="grid grid-cols-2 gap-2 bg-zinc-950/70 p-3 rounded-2xl border border-zinc-800 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">COMPOSITION</span>
                    <span className="text-zinc-200 font-bold">{selectedProduct.composition}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">FIT SILHOUETTE</span>
                    <span className="text-zinc-200 font-bold">{selectedProduct.fit}</span>
                  </div>
                  {selectedProduct.gsm && (
                    <div>
                      <span className="text-zinc-500 block">FABRIC WEIGHT</span>
                      <span className="text-zinc-200 font-bold">{selectedProduct.gsm} GSM</span>
                    </div>
                  )}
                  <div>
                    <span className="text-zinc-500 block">ORIGIN</span>
                    <span className="text-zinc-200 font-bold">Custom Studio Weave</span>
                  </div>
                </div>
              </div>

              {/* Guarantees & Returns */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-400 pt-2">
                <div className="bg-zinc-900/40 p-2 rounded-xl border border-zinc-850 flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>7-Day Easy Returns & Exchanges</span>
                </div>
                <div className="bg-zinc-900/40 p-2 rounded-xl border border-zinc-850 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Authentic Guaranteed</span>
                </div>
                <div className="bg-zinc-900/40 p-2 rounded-xl border border-zinc-850 flex flex-col items-center gap-1">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Signature Dust Bag Included</span>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="pt-6 border-t border-zinc-850">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black font-brand text-white uppercase tracking-wider">
                    VERIFIED BUYER REVIEWS
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-white font-bold">{selectedProduct.rating} / 5</span>
                    <span className="text-zinc-500">({productReviews.length + 12} reviews)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs font-bold rounded-xl transition"
                >
                  WRITE REVIEW
                </button>
              </div>

              {/* Review Cards List */}
              <div className="space-y-3">
                {productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1">
                            {rev.userName}
                            {rev.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-500">{rev.sizePurchased}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400 mb-1.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>

                    <h4 className="font-bold text-zinc-100 mb-1">{rev.title}</h4>
                    <p className="text-zinc-400 font-sans leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related / Complete The Look */}
            {relatedProducts.length > 0 && (
              <div className="pt-6 border-t border-zinc-850">
                <h3 className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase mb-3">
                  COMPLETE THE LOOK / YOU MAY ALSO LIKE
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedProducts.map((rp) => (
                    <ProductCard key={rp.id} product={rp} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-900 p-3 max-w-lg mx-auto sm:rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          {/* Wishlist */}
          <button
            type="button"
            onClick={() => toggleWishlist(selectedProduct.id)}
            className={`p-3 rounded-2xl border transition ${
              wishlisted
                ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Add to Cart */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black font-mono text-xs tracking-wider transition active:scale-98 ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}</span>
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black font-mono text-xs tracking-wider transition active:scale-98 shadow-lg ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-white hover:bg-zinc-200 text-zinc-950'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        product={selectedProduct}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};
