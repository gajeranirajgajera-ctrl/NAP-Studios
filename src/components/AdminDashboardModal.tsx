import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Edit,
  Eye,
  Flame,
  FlipHorizontal,
  FolderUp,
  Image as ImageIcon,
  KeyRound,
  Layers,
  Link2,
  Lock,
  LogOut,
  Maximize2,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  UploadCloud,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Coupon, OrderStatus, Product } from '../types';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    orders,
    coupons,
    addProduct,
    editProduct,
    deleteProduct,
    clearAllProducts,
    updateOrderStatus,
    createCoupon,
    categories,
    openOrderTracking,
    logoutAdmin,
    changeAdminPasscode,
    showToast,
  } = useShop();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeAdminTab, setActiveAdminTab] = useState<'OVERVIEW' | 'PRODUCTS' | 'CAMERA' | 'ORDERS' | 'COUPONS' | 'CUSTOMERS' | 'SECURITY'>('OVERVIEW');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Camera Studio State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhotoPreview, setCapturedPhotoPreview] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);

  // Security Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New / Edit Product Form State
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState<Product['category']>('T-Shirts');
  const [pPrice, setPPrice] = useState('1499');
  const [pOriginalPrice, setPOriginalPrice] = useState('2499');
  const [pGsm, setPGsm] = useState('280');
  const [pFit, setPFit] = useState<Product['fit']>('Boxy Heavyweight');
  const [pDesc, setPDesc] = useState('');
  const [pImages, setPImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [pIsDrop, setPIsDrop] = useState(false);

  // New Coupon Form State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cType, setCType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [cValue, setCValue] = useState('15');
  const [cMinOrder, setCMinOrder] = useState('999');

  // Overview metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.finalTotal, 0);
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) => o.currentStatus !== 'DELIVERED' && o.currentStatus !== 'CANCELLED').length;
  const lowStockProducts = products.filter((p) => p.sizes.some((s) => s.stock > 0 && s.stock <= 4));

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setPName('');
    setPCategory('T-Shirts');
    setPPrice('1499');
    setPOriginalPrice('2499');
    setPGsm('280');
    setPFit('Boxy Heavyweight');
    setPDesc('Crafted from luxury combed cotton with custom reactive dye finish.');
    setPImages([]);
    setNewImageUrl('');
    setPIsDrop(false);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setPName(prod.name);
    setPCategory(prod.category);
    setPPrice(prod.price.toString());
    setPOriginalPrice(prod.originalPrice.toString());
    setPGsm(prod.gsm ? prod.gsm.toString() : '280');
    setPFit(prod.fit);
    setPDesc(prod.description);
    setPImages(prod.images && prod.images.length > 0 ? [...prod.images] : []);
    setNewImageUrl('');
    setPIsDrop(!!prod.isLimitedDrop);
    setIsProductModalOpen(true);
  };

  // --- LIVE CAMERA CONTROLS ---
  const startCameraStream = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    setIsCameraLoading(true);
    setCameraError(null);
    setCapturedPhotoPreview(null);

    // Stop any existing active track
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not supported on this browser/device.');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch (e) {
        // Fallback constraint if ideal facing mode fails
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setCameraStream(stream);
      setCameraFacingMode(facing);
      setIsCameraModalOpen(true);

      // Connect to video element once state/DOM updates
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (err: any) {
      console.error('Camera streaming failed:', err);
      setCameraError(
        err.message ||
          'Camera access permission was denied or not available. Please allow camera permissions in your browser or use device file upload.'
      );
      setIsCameraModalOpen(true);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraModalOpen(false);
    setCapturedPhotoPreview(null);
    setCameraError(null);
  };

  const handleToggleFacingMode = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCameraStream(nextFacing);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Trigger flash visual effect
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    // If front user camera, mirror horizontal for natural reflection
    if (cameraFacingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPhotoPreview(dataUrl);
  };

  const handleAcceptCapturedPhoto = (closeAfter = true) => {
    if (!capturedPhotoPreview) return;
    setPImages((prev) => [...prev, capturedPhotoPreview]);
    showToast('Photo captured & attached to product!');
    setCapturedPhotoPreview(null);
    if (closeAfter) {
      stopCameraStream();
    }
  };

  // Stop camera when admin modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Photo handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are supported');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setPImages((prev) => [...prev, result]);
          showToast(`Photo added: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddUrl = () => {
    if (!newImageUrl.trim()) return;
    setPImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    showToast('Photo URL added');
  };

  const handleRemoveImage = (index: number) => {
    setPImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakeCover = (index: number) => {
    setPImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
    showToast('Set as main cover photo');
  };

  const curatedPresets = [
    { label: 'Heavy Acid Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Charcoal Fleece Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Tactical Bomber', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Vintage Denim', url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Off-White Tee', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Parachute Pants', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85' },
  ];

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(pPrice) || 1499;
    const origNum = parseFloat(pOriginalPrice) || 2499;
    const discount = Math.round(((origNum - priceNum) / origNum) * 100);

    const finalImages = pImages.length > 0 
      ? pImages 
      : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'];

    if (editingProductId) {
      editProduct(editingProductId, {
        name: pName,
        category: pCategory,
        price: priceNum,
        originalPrice: origNum,
        discountPercent: discount,
        gsm: parseInt(pGsm, 10) || undefined,
        fit: pFit,
        description: pDesc,
        images: finalImages,
        isLimitedDrop: pIsDrop,
      });
    } else {
      addProduct({
        name: pName,
        slug: pName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: pCategory,
        price: priceNum,
        originalPrice: origNum,
        discountPercent: discount,
        rating: 5.0,
        reviewCount: 1,
        images: finalImages,
        colors: [
          { name: 'Onyx Black', hex: '#0a0a0a', inStock: true },
          { name: 'Vintage Washed Slate', hex: '#3f3f46', inStock: true },
        ],
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 18 },
          { size: 'L', stock: 15 },
          { size: 'XL', stock: 8 },
        ],
        description: pDesc,
        composition: '100% Combed Heavy Cotton',
        gsm: parseInt(pGsm, 10) || 280,
        fit: pFit,
        careInstructions: ['Wash inside out in cold water', 'Lay flat to dry'],
        isLimitedDrop: pIsDrop,
        isNewArrival: true,
        tags: ['Studio Piece', 'Heavyweight'],
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode) return;

    createCoupon({
      code: cCode.toUpperCase().trim(),
      title: cTitle || 'STUDIO DISCOUNT',
      description: cDesc || 'Exclusive limited coupon code.',
      discountType: cType,
      discountValue: parseFloat(cValue) || 10,
      minOrderValue: parseFloat(cMinOrder) || 999,
      expiresAt: '2026-12-31',
    });

    setIsCouponModalOpen(false);
    setCCode('');
    setCTitle('');
    setCDesc('');
  };

  if (!isAdminOpen) return null;

  return (
    <div
      id="admin-dashboard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-zinc-950/95 backdrop-blur-md animate-in fade-in select-none overflow-y-auto"
    >
      <div className="w-full max-w-5xl min-h-screen sm:min-h-[85vh] bg-zinc-900 border-0 sm:border border-zinc-800 rounded-none sm:rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl my-auto">
        {/* Admin Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-black font-brand">
              NAP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-brand text-white uppercase tracking-wider">
                  BRAND OWNER PORTAL
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  ADMIN LIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                Studio Management, Inventory Control & Order Fulfillment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Camera Button in Header */}
            <button
              type="button"
              onClick={() => {
                handleOpenNewProduct();
                startCameraStream('environment');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-zinc-950 font-mono text-[11px] font-black rounded-xl shadow-lg transition active:scale-95"
              title="Open Live Camera Studio to Snap Clothing Photos"
            >
              <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>CAMERA SNAP</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-mono text-[11px] font-bold transition"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LOCK SESSION</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 sm:px-6 py-2.5 bg-zinc-950/80 border-b border-zinc-800 text-xs font-mono">
          {[
            { id: 'OVERVIEW', label: 'OVERVIEW', icon: BarChart3 },
            { id: 'CAMERA', label: '📸 STUDIO CAMERA', icon: Camera },
            { id: 'PRODUCTS', label: `PRODUCTS (${products.length})`, icon: Package },
            { id: 'ORDERS', label: `ORDERS (${orders.length})`, icon: ShoppingBag },
            { id: 'COUPONS', label: `COUPONS (${coupons.length})`, icon: Tag },
            { id: 'CUSTOMERS', label: 'CUSTOMERS (1,480)', icon: Users },
            { id: 'SECURITY', label: 'SECURITY & KEY', icon: KeyRound },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeAdminTab === t.id;
            const isCam = t.id === 'CAMERA';
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveAdminTab(t.id as any);
                  if (isCam && !cameraStream) {
                    startCameraStream('environment');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition shrink-0 ${
                  active
                    ? isCam
                      ? 'bg-cyan-400 text-zinc-950 font-black shadow-lg'
                      : 'bg-white text-zinc-950 font-bold shadow-md'
                    : isCam
                    ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 hover:bg-cyan-900/60 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[70vh] text-xs font-mono">
          {/* ================= 1. OVERVIEW ================= */}
          {activeAdminTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Studio Camera Quick Action Card */}
              <div className="bg-gradient-to-r from-cyan-950/70 via-zinc-900 to-zinc-950 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-bold tracking-wider animate-pulse">
                        LIVE STUDIO STUDIO ACTIVE
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black font-brand text-white uppercase tracking-wider">
                      SNAP & UPLOAD CLOTHING PHOTOS
                    </h3>
                    <p className="text-xs font-sans text-zinc-300 max-w-xl leading-relaxed">
                      Use your device camera or mobile camera to snap live product pictures, set prices, and immediately drop new streetwear apparel into your store.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAdminTab('CAMERA');
                        startCameraStream('environment');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-mono text-xs font-black rounded-2xl shadow-xl transition active:scale-95"
                    >
                      <Camera className="w-4 h-4 stroke-[2.5]" />
                      <span>OPEN STUDIO CAMERA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => nativeCameraInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold rounded-2xl transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>MOBILE CAM</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 font-mono text-xs font-bold rounded-2xl transition"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>GALLERY</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat Cards 4-Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[10px] uppercase font-bold">TOTAL REVENUE</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-bold">+28.4% this month</div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[10px] uppercase font-bold">TOTAL ORDERS</span>
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{totalOrdersCount}</div>
                  <div className="text-[10px] text-cyan-400 mt-1">{activeOrdersCount} in transit</div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[10px] uppercase font-bold">ACTIVE PRODUCTS</span>
                    <Package className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{products.length}</div>
                  <div className="text-[10px] text-zinc-400 mt-1">{categories.length} Categories</div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[10px] uppercase font-bold">LOW STOCK ALERTS</span>
                    <Flame className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">
                    {lowStockProducts.length}
                  </div>
                  <div className="text-[10px] text-amber-400/80 mt-1">Re-order queued</div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white uppercase tracking-wider">
                    RECENT DISPATCHES & ORDERS
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('ORDERS')}
                    className="text-cyan-400 hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-zinc-850">
                  {orders.slice(0, 4).map((o) => (
                    <div key={o.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-white font-bold">{o.orderNumber}</div>
                        <div className="text-zinc-400 text-[11px]">
                          {o.shippingAddress.fullName} • {o.items.length} items • ₹{o.finalTotal.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                          {o.currentStatus.replace(/_/g, ' ')}
                        </span>
                        <button
                          type="button"
                          onClick={() => openOrderTracking(o)}
                          className="px-2.5 py-1 bg-zinc-850 hover:bg-white hover:text-zinc-950 text-zinc-200 rounded-lg transition"
                        >
                          Track
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. STUDIO CAMERA WORKSTATION TAB ================= */}
          {activeAdminTab === 'CAMERA' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 p-4 sm:p-5 rounded-3xl border border-cyan-500/40">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <h3 className="text-base sm:text-lg font-black font-brand text-white uppercase tracking-wider">
                      LIVE STUDIO CAMERA WORKSTATION
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-sans">
                    Capture real garment shots directly with your device camera or mobile camera, curate photos, and publish new drops into the storefront.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startCameraStream(cameraFacingMode === 'environment' ? 'user' : 'environment')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-mono"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>FLIP CAM ({cameraFacingMode.toUpperCase()})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-850 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MOBILE CAM</span>
                  </button>
                </div>
              </div>

              {/* Grid: Camera Viewfinder on Left, Live Photo Tray & Quick Publish Form on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Viewfinder */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="relative aspect-[3/4] max-h-[500px] w-full bg-black rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl flex items-center justify-center">
                    {/* Flash effect overlay */}
                    {isFlashActive && (
                      <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-300" />
                    )}

                    {/* Viewfinder Video Stream */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />

                    {/* Framing Guidelines */}
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-white" />
                      <div className="border-r border-white" />
                      <div />
                    </div>

                    {/* Fallback if camera stream is inactive or error */}
                    {(!cameraStream || isCameraLoading || cameraError) && (
                      <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                        <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cyan-400">
                          <Camera className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold uppercase text-sm">
                            {cameraError ? 'Camera Access Required' : 'Live Camera Standby'}
                          </h4>
                          <p className="text-xs text-zinc-400 max-w-xs mt-1 font-sans">
                            {cameraError || 'Activate camera feed to snap high-resolution apparel photos.'}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => startCameraStream(cameraFacingMode)}
                            className="px-5 py-2.5 bg-cyan-400 text-zinc-950 font-black rounded-2xl text-xs hover:bg-cyan-300 shadow-xl"
                          >
                            START LIVE CAMERA
                          </button>
                          <button
                            type="button"
                            onClick={() => nativeCameraInputRef.current?.click()}
                            className="px-4 py-2.5 bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold rounded-2xl text-xs hover:bg-zinc-700"
                          >
                            OPEN MOBILE CAMERA
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Controls Bar on top of Viewfinder */}
                    {cameraStream && (
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md p-3 rounded-2xl border border-zinc-800 z-20">
                        <button
                          type="button"
                          onClick={() => startCameraStream(cameraFacingMode === 'environment' ? 'user' : 'environment')}
                          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                          title="Switch Camera"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        {/* Large Shutter Button */}
                        <button
                          type="button"
                          onClick={() => capturePhotoFromVideo(false)}
                          className="relative p-1 rounded-full border-4 border-cyan-400 hover:scale-105 active:scale-95 transition"
                          title="Snap Photo"
                        >
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-zinc-950 shadow-lg">
                            <Camera className="w-6 h-6 stroke-[2.5]" />
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                          title="Upload from Device"
                        >
                          <UploadCloud className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Captured Photos & Instant Listing Builder */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                      <span className="font-bold text-white uppercase text-xs">
                        CAPTURED PHOTOS ({pImages.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        + Upload More
                      </button>
                    </div>

                    {/* Photos Grid */}
                    {pImages.length === 0 ? (
                      <div className="py-8 text-center text-zinc-500 space-y-2 border border-dashed border-zinc-800 rounded-2xl">
                        <Camera className="w-8 h-8 mx-auto stroke-[1.5]" />
                        <p className="text-xs">No photos snapped yet. Click the shutter button on the camera to capture.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {pImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
                            <img src={img} alt={`Capture ${idx}`} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <span className="absolute top-1 left-1 bg-cyan-400 text-zinc-950 font-black px-1.5 py-0.5 rounded text-[8px]">
                                COVER
                              </span>
                            )}
                            <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMakeCover(idx)}
                                  className="p-1 rounded bg-zinc-800 text-white text-[9px] hover:bg-cyan-500 hover:text-zinc-950"
                                  title="Make Cover"
                                >
                                  Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1 rounded bg-red-950 text-red-400 hover:bg-red-900"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Publish Form */}
                    <div className="border-t border-zinc-850 pt-4 space-y-3">
                      <span className="font-bold text-white uppercase text-[11px] block">
                        FAST PRODUCT PUBLISH
                      </span>

                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                          placeholder="e.g. Heavy Acid Wash Boxy Tee"
                          className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                            Category
                          </label>
                          <select
                            value={pCategory}
                            onChange={(e) => setPCategory(e.target.value as any)}
                            className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-2 py-2 text-white text-xs"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            value={pPrice}
                            onChange={(e) => setPPrice(e.target.value)}
                            placeholder="1499"
                            className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-white text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          handleSaveProduct(e as any);
                          setActiveAdminTab('PRODUCTS');
                        }}
                        disabled={pImages.length === 0}
                        className={`w-full py-3 rounded-2xl font-black text-xs font-mono uppercase tracking-wider transition shadow-xl ${
                          pImages.length > 0
                            ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-zinc-950 hover:from-cyan-300 hover:to-teal-300'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        PUBLISH NEW DROP WITH PHOTOS →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. PRODUCTS MANAGER ================= */}
          {activeAdminTab === 'PRODUCTS' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white uppercase tracking-wider block">
                    STUDIO INVENTORY & DROPS
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {products.length} active pieces in storefront
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Camera Action in Products Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenNewProduct();
                      startCameraStream('environment');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-zinc-950 font-bold rounded-xl shadow-md transition text-xs"
                  >
                    <Camera className="w-4 h-4 stroke-[2.5]" />
                    <span>📸 SNAP PHOTO (CAMERA)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-zinc-850 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 font-bold rounded-xl transition text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MOBILE CAM</span>
                  </button>

                  {products.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to remove all clothes from the store? This will reset all slots to empty.')) {
                          clearAllProducts();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold rounded-xl transition text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>EMPTY ALL SLOTS</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleOpenNewProduct}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl shadow-md transition text-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>MANUAL ADD</span>
                  </button>
                </div>
              </div>

              {/* Product Cards Table or Empty Slots */}
              {products.length === 0 ? (
                <div className="p-8 sm:p-12 text-center rounded-3xl border border-dashed border-cyan-500/40 bg-zinc-950/80 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center mx-auto text-cyan-300 shadow-inner">
                    <Camera className="w-8 h-8 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">
                      STOREFRONT IS CURRENTLY EMPTY
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 font-sans">
                      All previous clothes have been cleared. You can now use your camera to take real photos and drop new apparel items.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto py-2">
                    {[1, 2, 3, 4].map((slot) => (
                      <div
                        key={slot}
                        onClick={() => {
                          handleOpenNewProduct();
                          startCameraStream('environment');
                        }}
                        className="h-32 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/40 hover:border-cyan-500 hover:bg-cyan-950/20 flex flex-col items-center justify-center cursor-pointer transition group p-2 text-center"
                      >
                        <Camera className="w-6 h-6 text-cyan-400 group-hover:scale-110 mb-1.5 transition" />
                        <span className="text-[10px] font-bold text-zinc-300 group-hover:text-cyan-300 uppercase">
                          Empty Slot #{slot}
                        </span>
                        <span className="text-[9px] text-zinc-500">Tap to Snap Photo</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenNewProduct();
                        startCameraStream('environment');
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-zinc-950 font-black rounded-2xl text-xs hover:from-cyan-300 hover:to-teal-300 transition shadow-xl"
                    >
                      <Camera className="w-4 h-4 stroke-[2.5]" />
                      <span>SNAP CLOTHING PHOTO WITH CAMERA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => nativeCameraInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-900 text-cyan-300 border border-cyan-500/40 font-bold rounded-2xl text-xs hover:bg-zinc-850"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>MOBILE CAM</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-14 h-18 object-cover rounded-xl bg-zinc-900 shrink-0 border border-zinc-800"
                          />
                          {prod.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-zinc-950/90 text-zinc-300 px-1 rounded text-[9px] font-mono border border-zinc-700">
                              +{prod.images.length - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-bold text-xs flex items-center gap-2">
                            {prod.name}
                            {prod.isLimitedDrop && (
                              <span className="bg-red-950 text-red-400 border border-red-500/40 px-1.5 py-0.2 rounded text-[9px]">
                                VAULT DROP
                              </span>
                            )}
                          </div>
                          <div className="text-zinc-400 text-[11px]">
                            {prod.category} • {prod.fit} • {prod.gsm ? `${prod.gsm} GSM` : ''} • {prod.images.length} photo{prod.images.length > 1 ? 's' : ''}
                          </div>
                          <div className="text-zinc-200 font-bold mt-0.5">
                            ₹{prod.price.toLocaleString()}{' '}
                            <span className="text-zinc-500 line-through text-[10px]">
                              ₹{prod.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick Camera Trigger on Product Row */}
                        <button
                          type="button"
                          onClick={() => {
                            handleOpenEditProduct(prod);
                            startCameraStream('environment');
                          }}
                          className="p-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white"
                          title="Snap & Add Photos with Camera"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750"
                          title="Edit Product & Photos"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(prod.id)}
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 border border-zinc-750"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= 3. ORDERS MANAGER ================= */}
          {activeAdminTab === 'ORDERS' && (
            <div className="space-y-4">
              <span className="font-bold text-white uppercase tracking-wider block">
                ORDER FULFILLMENT & STATUS UPDATES
              </span>

              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-2.5">
                      <div>
                        <div className="text-white font-bold text-sm">{ord.orderNumber}</div>
                        <div className="text-zinc-400 text-[11px]">
                          Placed by {ord.shippingAddress.fullName} ({ord.shippingAddress.city}) • {ord.deliveryMethod}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">
                          ₹{ord.finalTotal.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-850 text-zinc-300 text-[10px]">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </div>
                    </div>

                    {/* Status Changer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-[11px]">CHANGE STATUS:</span>
                        <select
                          value={ord.currentStatus}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                        >
                          <option value="ORDER_PLACED">Order Placed</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PACKED">Packed</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => openOrderTracking(ord)}
                        className="px-3 py-1.5 bg-zinc-850 hover:bg-white hover:text-zinc-950 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>OPEN LIVE TIMELINE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. COUPONS MANAGER ================= */}
          {activeAdminTab === 'COUPONS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider">
                  DISCOUNT CODES & PROMOTIONS
                </span>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>CREATE COUPON</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coupons.map((cp) => (
                  <div
                    key={cp.code}
                    className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-amber-400 font-mono">
                        {cp.code}
                      </span>
                      <span className="text-[10px] bg-zinc-850 text-zinc-300 px-2 py-0.5 rounded">
                        {cp.discountType === 'PERCENTAGE' ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} FLAT`}
                      </span>
                    </div>
                    <div className="text-white font-bold">{cp.title}</div>
                    <p className="text-zinc-400 font-sans text-[11px]">{cp.description}</p>
                    <div className="text-[10px] text-zinc-500 pt-1">
                      Min Order: ₹{cp.minOrderValue.toLocaleString()} • Expires: {cp.expiresAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. CUSTOMERS ================= */}
          {activeAdminTab === 'CUSTOMERS' && (
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider block">
                VIP CUSTOMER ROSTER
              </span>

              <div className="space-y-2">
                {[
                  { name: 'Aryan Sharma', email: 'aryan.sharma@napclothing.com', spent: '₹14,290', orders: 5, tier: 'VIP BLACK' },
                  { name: 'Karan Patel', email: 'karan.patel@gmail.com', spent: '₹9,499', orders: 3, tier: 'VIP BLACK' },
                  { name: 'Rhea Sen', email: 'rhea.sen@outlook.com', spent: '₹7,298', orders: 2, tier: 'MEMBER' },
                  { name: 'Vikramaditya Roy', email: 'vikram.roy@me.com', spent: '₹18,990', orders: 6, tier: 'INNER CIRCLE' },
                ].map((c) => (
                  <div
                    key={c.email}
                    className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white font-bold text-xs">{c.name}</div>
                      <div className="text-zinc-400 text-[11px]">{c.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{c.spent} spent</div>
                      <div className="text-cyan-400 text-[10px]">{c.tier} • {c.orders} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. SECURITY & PASSCODE ================= */}
          {activeAdminTab === 'SECURITY' && (
            <div className="max-w-xl mx-auto space-y-6 py-2">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-brand text-white uppercase tracking-wider">
                      STUDIO MASTER PASSCODE
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Change the secret key required to enter this admin portal
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newPass !== confirmPass) {
                      setSecurityMsg({ type: 'error', text: 'New passcode and confirmation do not match.' });
                      return;
                    }
                    const res = changeAdminPasscode(currentPass, newPass);
                    if (res.success) {
                      setSecurityMsg({ type: 'success', text: res.message });
                      setCurrentPass('');
                      setNewPass('');
                      setConfirmPass('');
                    } else {
                      setSecurityMsg({ type: 'error', text: res.message });
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-zinc-400 uppercase text-[10px] font-bold mb-1">
                      CURRENT PASSCODE / KEY
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter current passcode"
                      value={currentPass}
                      onChange={(e) => {
                        setCurrentPass(e.target.value);
                        if (securityMsg) setSecurityMsg(null);
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-3 text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 uppercase text-[10px] font-bold mb-1">
                        NEW MASTER KEY
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="At least 4 characters"
                        value={newPass}
                        onChange={(e) => {
                          setNewPass(e.target.value);
                          if (securityMsg) setSecurityMsg(null);
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-3 text-white focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 uppercase text-[10px] font-bold mb-1">
                        CONFIRM NEW KEY
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter new key"
                        value={confirmPass}
                        onChange={(e) => {
                          setConfirmPass(e.target.value);
                          if (securityMsg) setSecurityMsg(null);
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-3 text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  {securityMsg && (
                    <div
                      className={`p-3 rounded-2xl border text-[11px] flex items-center gap-2 ${
                        securityMsg.type === 'success'
                          ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950/70 border-red-500/40 text-red-300'
                      }`}
                    >
                      {securityMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{securityMsg.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs uppercase tracking-wider rounded-2xl transition shadow-md"
                  >
                    UPDATE STUDIO PASSCODE
                  </button>
                </form>
              </div>

              {/* Session Termination Card */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-xs">Lock & Terminate Admin Session</div>
                  <div className="text-[11px] text-zinc-400">
                    Immediately locks the portal. Passcode will be required on next access.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-xl font-bold transition text-xs"
                >
                  LOCK NOW
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 text-center">
          <button
            type="button"
            onClick={() => setIsAdminOpen(false)}
            className="w-full py-3 bg-white text-zinc-950 font-black font-mono text-xs rounded-2xl tracking-wider hover:bg-zinc-200 transition shadow-lg"
          >
            EXIT ADMIN DASHBOARD
          </button>
        </div>
      </div>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto text-xs font-mono">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>{editingProductId ? 'EDIT PRODUCT & PHOTOS' : 'ADD NEW CLOTHING PIECE'}</span>
                </h3>
                <span className="text-[10px] text-zinc-400">
                  Upload images, set pricing, and configure studio specs
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Basic Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">PRODUCT NAME</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Acid-Washed Boxy Tee"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white placeholder:text-zinc-600 focus:border-cyan-400 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">CATEGORY</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white focus:border-cyan-400 outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">FIT PROFILE</label>
                    <select
                      value={pFit}
                      onChange={(e) => setPFit(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white focus:border-cyan-400 outline-none"
                    >
                      <option value="Boxy Heavyweight">Boxy Heavyweight</option>
                      <option value="Oversized">Oversized</option>
                      <option value="Relaxed">Relaxed</option>
                      <option value="Wide Leg">Wide Leg</option>
                      <option value="Regular">Regular</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">SELLING (₹)</label>
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">MRP (₹)</label>
                    <input
                      type="number"
                      required
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">FABRIC GSM</label>
                    <input
                      type="number"
                      value={pGsm}
                      onChange={(e) => setPGsm(e.target.value)}
                      placeholder="280"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">FABRIC & DESIGN DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Crafted from heavyweight combed cotton..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white font-sans text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* ================= PHOTO UPLOAD STUDIO ================= */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white uppercase tracking-wider">
                      CLOTHING PHOTOS ({pImages.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {pImages.length === 0 ? 'No photos added yet' : `${pImages.length} photo${pImages.length > 1 ? 's' : ''} ready`}
                  </span>
                </div>

                {/* ================= PHOTO UPLOAD OPTIONS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Live Camera Viewfinder Studio */}
                  <button
                    type="button"
                    onClick={() => startCameraStream('environment')}
                    className="p-3.5 bg-gradient-to-br from-cyan-950/60 to-zinc-900 border border-cyan-500/40 hover:border-cyan-400 rounded-2xl flex items-center gap-3 transition group text-left shadow-lg hover:shadow-cyan-950/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>TAKE LIVE PHOTO</span>
                        <span className="px-1.5 py-0.2 bg-cyan-400 text-zinc-950 rounded text-[9px] font-black">
                          STUDIO
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-sans mt-0.5">
                        Open in-app camera with live framing & shutter
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Direct Mobile Camera Trigger */}
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="p-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 hover:border-zinc-500 rounded-2xl flex items-center gap-3 transition group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">MOBILE CAMERA SNAP</div>
                      <div className="text-[10px] text-zinc-400 font-sans mt-0.5">
                        Launch phone's default camera directly
                      </div>
                    </div>
                  </button>
                </div>

                {/* Hidden File Inputs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={nativeCameraInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />

                {/* Option 3: Browse Device Files / Gallery */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 border-2 border-dashed border-zinc-700 hover:border-cyan-400/80 bg-zinc-900/50 hover:bg-zinc-900 rounded-2xl text-center cursor-pointer transition group"
                >
                  <UploadCloud className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 mx-auto mb-1 transition" />
                  <span className="font-bold text-zinc-200 block text-xs group-hover:text-white">
                    Click to Browse Files / Gallery from Device
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans mt-0.5 block">
                    Supports JPG, PNG, WEBP • Multi-selection supported
                  </span>
                </div>

                {/* Option 4: Image URL input */}
                <div>
                  <label className="block text-zinc-400 mb-1 text-[11px]">OR PASTE IMAGE URL:</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white text-[11px] outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition shrink-0 text-xs"
                    >
                      + ADD URL
                    </button>
                  </div>
                </div>

                {/* Upload Action 3: Preset Photos for quick testing */}
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1.5 font-bold uppercase">
                    OR 1-CLICK CURATED FASHION PRESETS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {curatedPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setPImages((prev) => [...prev, preset.url]);
                          showToast(`Added ${preset.label} photo`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white text-[10px] transition"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Image Grid of Attached Photos */}
                {pImages.length > 0 && (
                  <div className="pt-2 border-t border-zinc-850 space-y-2">
                    <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block">
                      ATTACHED PHOTOS (First photo is Cover):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {pImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative group rounded-xl overflow-hidden border bg-zinc-900 ${
                            idx === 0 ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-zinc-750'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Product Photo ${idx + 1}`}
                            className="w-full h-24 sm:h-28 object-cover"
                          />

                          {/* Cover Badge */}
                          {idx === 0 && (
                            <div className="absolute top-1 left-1 bg-cyan-400 text-zinc-950 text-[9px] font-black px-1.5 py-0.5 rounded font-mono shadow">
                              ★ COVER
                            </div>
                          )}

                          {/* Index Badge */}
                          <div className="absolute bottom-1 left-1 bg-zinc-950/80 text-zinc-300 text-[9px] px-1 rounded">
                            #{idx + 1}
                          </div>

                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleMakeCover(idx)}
                                className="p-1.5 rounded-lg bg-cyan-500 text-zinc-950 hover:bg-cyan-400 text-[10px] font-bold"
                                title="Make Cover Photo"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Limited Vault Drop Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="drop-check"
                  checked={pIsDrop}
                  onChange={(e) => setPIsDrop(e.target.checked)}
                  className="w-4 h-4 rounded accent-red-500"
                />
                <label htmlFor="drop-check" className="text-white font-bold cursor-pointer">
                  Mark as Limited Vault Drop (Featured countdown banner)
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs uppercase tracking-wider rounded-2xl transition shadow-xl"
                >
                  {editingProductId ? 'UPDATE PRODUCT' : 'PUBLISH CLOTHING ITEM'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-2xl transition"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE COUPON MODAL --- */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <h3 className="text-base font-black text-white uppercase">CREATE DISCOUNT COUPON</h3>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">COUPON CODE (e.g. FLASH30)</label>
                <input
                  type="text"
                  required
                  value={cCode}
                  onChange={(e) => setCCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">DISCOUNT TYPE</label>
                  <select
                    value={cType}
                    onChange={(e) => setCType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">VALUE ({cType === 'PERCENTAGE' ? '%' : '₹'})</label>
                  <input
                    type="number"
                    required
                    value={cValue}
                    onChange={(e) => setCValue(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">MIN ORDER VALUE (₹)</label>
                <input
                  type="number"
                  value={cMinOrder}
                  onChange={(e) => setCMinOrder(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white text-zinc-950 font-bold rounded-xl"
                >
                  ACTIVATE COUPON
                </button>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-3 bg-zinc-800 text-zinc-400 rounded-xl"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- LIVE CAMERA VIEWFINDER STUDIO MODAL --- */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/95 backdrop-blur-lg animate-in fade-in select-none">
          {/* Hidden Canvas for High-Resolution Snapshot Capture */}
          <canvas ref={canvasRef} className="hidden" />

          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] font-mono">
            {/* Camera Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <span>STUDIO CAMERA VIEWFINDER</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-zinc-400 font-sans">
                    {cameraFacingMode === 'environment' ? 'Rear / Product Camera' : 'Front / Selfie Camera'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch Camera Facing Button */}
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                  title="Switch Front / Rear Camera"
                >
                  <FlipHorizontal className="w-4 h-4 text-cyan-400" />
                </button>

                {/* Close Camera Button */}
                <button
                  type="button"
                  onClick={stopCameraStream}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
                  title="Close Camera"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Camera Viewport / Captured Preview */}
            <div className="relative bg-black flex-1 min-h-[320px] sm:min-h-[420px] flex items-center justify-center overflow-hidden">
              {/* Flash animation effect */}
              {isFlashActive && (
                <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200 pointer-events-none" />
              )}

              {/* Error Message Display */}
              {cameraError ? (
                <div className="p-6 text-center max-w-md space-y-3 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">CAMERA ACCESS RESTRICTED</h4>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">{cameraError}</p>
                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => startCameraStream(cameraFacingMode)}
                      className="px-4 py-2 bg-white text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>TRY AGAIN</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        stopCameraStream();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                    >
                      CHOOSE FROM FILES
                    </button>
                  </div>
                </div>
              ) : capturedPhotoPreview ? (
                /* Captured Photo Freeze-Frame Review */
                <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
                  <img
                    src={capturedPhotoPreview}
                    alt="Captured Clothing Snapshot"
                    className="max-h-[420px] w-full object-contain"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-black tracking-wider uppercase shadow">
                    ✓ SNAPSHOT READY
                  </div>
                </div>
              ) : (
                /* Live Streaming Video */
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full max-h-[440px] object-cover ${
                      cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''
                    }`}
                  />

                  {/* Framing Grid Overlay for Clothes */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10">
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    {/* Center Focus Box */}
                    <div className="border-r border-b border-cyan-400/40 relative">
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                    </div>
                    <div className="border-b border-white/10" />
                    <div className="border-r border-white/10" />
                    <div className="border-r border-white/10" />
                    <div className="" />
                  </div>

                  {/* Camera Status Overlay Tag */}
                  <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] text-zinc-300 border border-zinc-800 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400 fill-current" />
                    <span>Framing Guide Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Bottom Controls */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
              {capturedPhotoPreview ? (
                /* Post-Capture Review Actions */
                <div className="space-y-2.5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAcceptCapturedPhoto(true)}
                      className="flex-1 py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase text-xs rounded-2xl transition shadow-xl flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>ATTACH PHOTO & FINISH</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptCapturedPhoto(false)}
                      className="px-4 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-1.5"
                      title="Keep this photo and immediately take another"
                    >
                      <span>+ SNAP ANOTHER</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCapturedPhotoPreview(null)}
                    className="w-full py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold uppercase text-[11px] rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RETAKE PHOTO</span>
                  </button>
                </div>
              ) : (
                /* Live Shutter Trigger */
                <div className="flex items-center justify-between gap-4">
                  <div className="text-[11px] text-zinc-400 hidden sm:block">
                    {pImages.length} photo{pImages.length === 1 ? '' : 's'} currently attached
                  </div>

                  {/* Big Circular Camera Shutter */}
                  <div className="flex-1 flex justify-center">
                    <button
                      type="button"
                      disabled={!!cameraError || isCameraLoading}
                      onClick={handleCaptureSnapshot}
                      className="group relative flex items-center justify-center"
                      title="Snap High Resolution Photo"
                    >
                      <div className="w-16 h-16 rounded-full border-4 border-white/40 group-hover:border-cyan-400 group-active:scale-95 transition flex items-center justify-center p-1 shadow-2xl">
                        <div className="w-full h-full rounded-full bg-white group-hover:bg-cyan-400 transition" />
                      </div>
                    </button>
                  </div>

                  {/* Quick Flip / Upload Alternate */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleFacingMode}
                      className="px-3 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs rounded-xl font-bold transition flex items-center gap-1.5"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">FLIP</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
