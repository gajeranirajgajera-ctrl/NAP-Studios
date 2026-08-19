import React from 'react';
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Globe,
  Heart,
  HelpCircle,
  Instagram,
  Lock,
  Package,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Twitter,
  Youtube,
  Zap,
} from 'lucide-react';
import { AccountView } from './components/AccountView';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { CatalogView } from './components/CatalogView';
import { CategoryPills } from './components/CategoryPills';
import { CheckoutModal } from './components/CheckoutModal';
import { HeroBannerCarousel } from './components/HeroBannerCarousel';
import { LimitedDropSection } from './components/LimitedDropSection';
import { Navbar } from './components/Navbar';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistView } from './components/WishlistView';
import { ShopProvider, useShop } from './context/ShopContext';

const ShopAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    products,
    setSelectedCategory,
    toastMessage,
    openProductDetail,
    requestAdminAccess,
    isAdminAuthenticated,
  } = useShop();

  const newArrivals = products.filter((p) => p.isNewArrival);
  const trendingNow = products.filter((p) => p.isTrending);
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-white selection:text-zinc-950 font-sans antialiased">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-60 bg-white text-zinc-950 px-4 py-2.5 rounded-full font-mono text-xs font-bold shadow-2xl flex items-center gap-2 border border-zinc-200 animate-in slide-in-from-top-4 fade-in duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {/* TAB 1: HOME SCREEN */}
        {activeTab === 'HOME' && (
          <div className="space-y-8 sm:space-y-12 pb-24">
            {/* 1. Hero Promotional Carousel */}
            <HeroBannerCarousel />

            {/* 2. Brand Trust Guarantee Bar */}
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 bg-zinc-900/60 border border-zinc-800/90 rounded-3xl p-4 sm:p-5 text-xs font-mono">
                <div className="flex items-center gap-3 p-1">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Free Express Air</span>
                    <span className="text-[10px] text-zinc-400">On all prepaid orders over ₹1,999</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-1">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Heavyweight Cotton</span>
                    <span className="text-[10px] text-zinc-400">280–450 GSM Custom Weaves</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-1">
                  <div className="w-10 h-10 rounded-2xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">7-Day Free Exchange</span>
                    <span className="text-[10px] text-zinc-400">Doorstep reverse pickup in 24h</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-1">
                  <div className="w-10 h-10 rounded-2xl bg-pink-950/70 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">COD Available</span>
                    <span className="text-[10px] text-zinc-400">Pay cash or UPI at delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Category Carousel */}
            <CategoryPills />

            {/* 4. Limited Drop Vault Section (Live Countdown) */}
            <LimitedDropSection />

            {/* 5. NEW ARRIVALS */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <h2 className="text-lg sm:text-2xl font-black font-brand text-white uppercase tracking-tight">
                      NEW ARRIVALS
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">
                    Fresh studio releases crafted in heavyweight silhouettes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setActiveTab('CATALOG');
                  }}
                  className="flex items-center gap-1 font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                >
                  <span>SEE ALL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                {newArrivals.length === 0 ? (
                  [1, 2, 3, 4].map((slot) => (
                    <div
                      key={slot}
                      className="aspect-[3/4] rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 flex flex-col items-center justify-center p-4 text-center"
                    >
                      <span className="font-mono text-xs font-bold text-zinc-500 uppercase">
                        EMPTY SLOT #{slot}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-sans mt-1">
                        Awaiting new drop
                      </span>
                    </div>
                  ))
                ) : (
                  newArrivals.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </section>

            {/* 6. EDITORIAL LOOKBOOK BANNER */}
            <div className="max-w-7xl mx-auto px-4">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85"
                  alt="NAP Autumn Winter Editorial"
                  className="w-full h-72 sm:h-96 object-cover object-center opacity-55 hover:scale-102 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent flex flex-col justify-end p-6 sm:p-10">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
                    AUTUMN / WINTER 2026 ARCHIVE
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black font-brand text-white uppercase tracking-tight max-w-xl leading-tight mb-3">
                    DESIGNED FOR THE CONCRETE AVANT-GARDE
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-zinc-300 max-w-lg mb-4">
                    High-density loopback french terry, dropped shoulder blockings, and custom reactive dye finishes engineered for timeless durability.
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('CATALOG')}
                      className="px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs uppercase tracking-wider rounded-2xl transition active:scale-98 shadow-xl"
                    >
                      EXPLORE LOOKBOOK COLLECTION
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. TRENDING NOW SECTION */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <h2 className="text-lg sm:text-2xl font-black font-brand text-white uppercase tracking-tight">
                      TRENDING NOW
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">
                    Most viewed pieces across the streetwear community
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setActiveTab('CATALOG');
                  }}
                  className="flex items-center gap-1 font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                {trendingNow.length === 0 ? (
                  [1, 2, 3, 4].map((slot) => (
                    <div
                      key={slot}
                      className="aspect-[3/4] rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 flex flex-col items-center justify-center p-4 text-center"
                    >
                      <span className="font-mono text-xs font-bold text-zinc-500 uppercase">
                        EMPTY SLOT #{slot}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-sans mt-1">
                        Awaiting trending drops
                      </span>
                    </div>
                  ))
                ) : (
                  trendingNow.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </section>

            {/* 8. BEST SELLERS SECTION */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <h2 className="text-lg sm:text-2xl font-black font-brand text-white uppercase tracking-tight">
                      BEST SELLERS
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">
                    Consistently top-rated for fit, weight, and longevity
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setActiveTab('CATALOG');
                  }}
                  className="flex items-center gap-1 font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                >
                  <span>SEE ALL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                {bestSellers.length === 0 ? (
                  [1, 2, 3, 4].map((slot) => (
                    <div
                      key={slot}
                      className="aspect-[3/4] rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 flex flex-col items-center justify-center p-4 text-center"
                    >
                      <span className="font-mono text-xs font-bold text-zinc-500 uppercase">
                        EMPTY SLOT #{slot}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-sans mt-1">
                        Awaiting best sellers
                      </span>
                    </div>
                  ))
                ) : (
                  bestSellers.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </section>

            {/* 9. Brand Manifesto & Footer */}
            <footer className="border-t border-zinc-900 bg-zinc-950/80 pt-12 pb-16 font-mono text-xs">
              <div className="max-w-7xl mx-auto px-4 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Col 1: Brand */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black font-brand text-white uppercase tracking-widest">
                        NAP
                      </span>
                      <span className="text-[10px] text-zinc-500">CLOTHING STUDIO</span>
                    </div>
                    <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                      Independent contemporary fashion house engineering heavyweight minimalist streetwear, boxy silhouettes, and artisanal finishes.
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-zinc-400">
                      <Instagram className="w-4 h-4 hover:text-white cursor-pointer" />
                      <Twitter className="w-4 h-4 hover:text-white cursor-pointer" />
                      <Youtube className="w-4 h-4 hover:text-white cursor-pointer" />
                    </div>
                  </div>

                  {/* Col 2: Collections */}
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-white uppercase tracking-wider">
                      COLLECTIONS
                    </h4>
                    <ul className="space-y-1.5 text-zinc-400">
                      <li
                        onClick={() => {
                          setSelectedCategory('T-Shirts');
                          setActiveTab('CATALOG');
                        }}
                        className="hover:text-white cursor-pointer"
                      >
                        Heavyweight Oversized Tees
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory('Hoodies');
                          setActiveTab('CATALOG');
                        }}
                        className="hover:text-white cursor-pointer"
                      >
                        450 GSM Boxy Hoodies
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory('Trousers');
                          setActiveTab('CATALOG');
                        }}
                        className="hover:text-white cursor-pointer"
                      >
                        Parachute & Cargo Trousers
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory('Jackets');
                          setActiveTab('CATALOG');
                        }}
                        className="hover:text-white cursor-pointer"
                      >
                        Structured Outerwear
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory('Accessories');
                          setActiveTab('CATALOG');
                        }}
                        className="hover:text-white cursor-pointer"
                      >
                        Studio Caps & Tote Bags
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Customer Care */}
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-white uppercase tracking-wider">
                      CUSTOMER ASSISTANCE
                    </h4>
                    <ul className="space-y-1.5 text-zinc-400">
                      <li className="hover:text-white cursor-pointer">Live Order Tracking</li>
                      <li className="hover:text-white cursor-pointer">Size & Silhouette Guide</li>
                      <li className="hover:text-white cursor-pointer">7-Day Exchange Protocol</li>
                      <li className="hover:text-white cursor-pointer">Fabric & Wash Care Manual</li>
                      <li className="hover:text-white cursor-pointer">support@napclothing.com</li>
                    </ul>
                  </div>

                  {/* Col 4: VIP & Admin */}
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-white uppercase tracking-wider">
                      STUDIO ACCESS
                    </h4>
                    <p className="text-zinc-400 font-sans text-xs">
                      Join the VIP Black inner circle for exclusive 2-hour early drop notifications.
                    </p>
                    <button
                      type="button"
                      onClick={requestAdminAccess}
                      className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl font-bold transition text-xs flex items-center justify-center gap-2 text-zinc-300"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAdminAuthenticated ? 'ADMIN STUDIO (UNLOCKED)' : 'BRAND OWNER ACCESS'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-[11px] gap-2">
                  <span>© 2026 NAP CLOTHING CO. ALL RIGHTS RESERVED.</span>
                  <div className="flex items-center gap-4">
                    <span>Privacy Policy</span>
                    <span>•</span>
                    <span>Terms of Service</span>
                    <span>•</span>
                    <span>Security Standards</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        )}

        {/* TAB 2: CATALOG / SHOP */}
        {activeTab === 'CATALOG' && <CatalogView />}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'WISHLIST' && <WishlistView />}

        {/* TAB 4: ACCOUNT / PROFILE / ORDERS */}
        {activeTab === 'ACCOUNT' && <AccountView />}
      </main>

      {/* Floating Bottom Navigation Dock */}
      <BottomNav />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal />

      {/* Shopping Bag Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal />

      {/* Order Tracking Modal */}
      <OrderTrackingModal />

      {/* Passcode Security Gate for Admin */}
      <AdminAuthModal />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <ShopAppContent />
    </ShopProvider>
  );
}
