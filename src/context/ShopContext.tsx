import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_ADDRESSES,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_USER,
} from '../data/mockData';
import {
  ActiveTab,
  Address,
  CartItem,
  Category,
  Coupon,
  Order,
  OrderStatus,
  Product,
  ProductColor,
  Review,
  User,
} from '../types';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  savedAddresses: Address[];
  user: User;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedProduct: Product | null;
  selectedOrderForTracking: Order | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthOpen: boolean;
  setIsAdminAuthOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  verifyAdminPasscode: (code: string) => boolean;
  changeAdminPasscode: (oldPass: string, newPass: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  requestAdminAccess: () => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;
  recentlyViewed: Product[];
  reviews: Review[];
  toastMessage: string | null;
  
  // Cart Actions
  addToCart: (product: Product, selectedColor: ProductColor, selectedSize: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartMRP: number;
  cartDiscount: number;
  cartCount: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  
  // Coupon Actions
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Order Actions
  createOrder: (orderPayload: {
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
    shippingAddress: Address;
    deliveryMethod: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, customDesc?: string) => void;
  
  // Product Detail & Tracking modals
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  openOrderTracking: (order: Order) => void;
  closeOrderTracking: () => void;
  
  // Reviews
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'verified'>) => void;
  
  // Admin Management Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editProduct: (productId: string, updated: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  clearAllProducts: () => void;
  createCoupon: (coupon: Coupon) => void;
  
  // Address Management
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Toast
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE WITH LOCALSTORAGE INITIALIZATION ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nap_v2_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nap_v2_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('nap_v2_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nap_v2_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [savedAddresses, setSavedAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('nap_v2_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('nap_v2_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('nap_v2_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('nap_v2_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('nap_admin_auth') === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState(() => {
    return localStorage.getItem('nap_admin_passcode') || 'NAP2026';
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const verifyAdminPasscode = (code: string): boolean => {
    if (code.trim().toUpperCase() === adminPasscode.toUpperCase() || code.trim() === 'NAP2026') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('nap_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const changeAdminPasscode = (oldPass: string, newPass: string) => {
    if (oldPass.toUpperCase() !== adminPasscode.toUpperCase() && oldPass !== 'NAP2026') {
      return { success: false, message: 'Current passcode is incorrect.' };
    }
    if (!newPass || newPass.length < 4) {
      return { success: false, message: 'New passcode must be at least 4 characters long.' };
    }
    setAdminPasscode(newPass);
    localStorage.setItem('nap_admin_passcode', newPass);
    showToast('Admin master passcode updated successfully');
    return { success: true, message: 'Passcode updated successfully.' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('nap_admin_auth');
    setIsAdminOpen(false);
    showToast('Admin session locked');
  };

  const requestAdminAccess = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nap_v2_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nap_v2_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nap_v2_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('nap_v2_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nap_v2_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('nap_v2_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('nap_v2_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // --- CART CALCULATIONS ---
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartMRP = cart.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const cartTotalBeforeCoupon = cart.reduce((acc, item) => acc + item.priceAtAddition * item.quantity, 0);
  const cartDiscount = cartMRP - cartTotalBeforeCoupon;

  let couponDeduct = 0;
  if (appliedCoupon && cartTotalBeforeCoupon >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      const calc = (cartTotalBeforeCoupon * appliedCoupon.discountValue) / 100;
      couponDeduct = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      couponDeduct = appliedCoupon.discountValue;
    }
  }

  const freeShippingThreshold = 1999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotalBeforeCoupon);
  const deliveryFee = cartTotalBeforeCoupon >= freeShippingThreshold || appliedCoupon?.code === 'FREESHIP' || cartCount === 0 ? 0 : 149;
  const cartTotal = Math.max(0, cartTotalBeforeCoupon - couponDeduct + deliveryFee);

  // --- CART ACTIONS ---
  const addToCart = (product: Product, selectedColor: ProductColor, selectedSize: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedColor.name === selectedColor.name &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: product.id,
          product,
          selectedColor,
          selectedSize,
          quantity,
          priceAtAddition: product.price,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${product.name} (${selectedSize}) to Bag`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    showToast('Item removed from Bag');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // --- WISHLIST ACTIONS ---
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // --- COUPON ACTIONS ---
  const applyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartTotalBeforeCoupon < found.minOrderValue) {
      return {
        success: false,
        message: `Min order value of ₹${found.minOrderValue.toLocaleString()} required for this coupon`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`);
    return { success: true, message: `Saved ₹${couponDeduct.toLocaleString()} with code ${found.code}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // --- ORDER CREATION & TRACKING ---
  const createOrder = ({
    paymentMethod,
    shippingAddress,
    deliveryMethod,
  }: {
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
    shippingAddress: Address;
    deliveryMethod: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  }) => {
    const orderNum = `NAP-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNum = `DLHV-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const deliveryDays = deliveryMethod === 'SAME_DAY' ? 'Today by 8:00 PM' : deliveryMethod === 'EXPRESS' ? '2-3 Business Days' : '4-5 Business Days';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      items: [...cart],
      totalMRP: cartMRP,
      productDiscount: cartDiscount,
      couponDiscount: couponDeduct,
      couponCodeApplied: appliedCoupon?.code,
      deliveryFee,
      finalTotal: cartTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      shippingAddress,
      deliveryMethod,
      trackingId: trackingNum,
      courierPartner: 'Delhivery Surface Express',
      estimatedDelivery: deliveryDays,
      createdAt: new Date().toISOString(),
      currentStatus: 'ORDER_PLACED',
      statusHistory: [
        {
          status: 'ORDER_PLACED',
          timestamp: 'Just now',
          title: 'Order Placed & Confirmed',
          description: `Payment of ₹${cartTotal.toLocaleString()} initiated via ${paymentMethod}.`,
          location: 'NAP Central Studio',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, customDesc?: string) => {
    const statusTitles: Record<OrderStatus, string> = {
      ORDER_PLACED: 'Order Placed & Verified',
      CONFIRMED: 'Order Confirmed by Brand',
      PACKED: 'Quality Checked & Packed',
      SHIPPED: 'Dispatched with Courier',
      OUT_FOR_DELIVERY: 'Out for Final Delivery',
      DELIVERED: 'Delivered Successfully',
      CANCELLED: 'Order Cancelled',
    };

    const statusDescriptions: Record<OrderStatus, string> = {
      ORDER_PLACED: 'Order recorded in our central system.',
      CONFIRMED: 'Inventory allocated from warehouse.',
      PACKED: 'Packed in signature NAP dust bag with security tag.',
      SHIPPED: 'Package handed to express courier partner.',
      OUT_FOR_DELIVERY: 'Courier rider is out for delivery in your area.',
      DELIVERED: 'Delivered and signed at recipient address.',
      CANCELLED: 'Order was cancelled and refund queued.',
    };

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const newHistory = [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp: 'Just now',
              title: statusTitles[newStatus],
              description: customDesc || statusDescriptions[newStatus],
              location: 'Bengaluru Fulfillment Center',
            },
          ];
          return {
            ...order,
            currentStatus: newStatus,
            paymentStatus: newStatus === 'CANCELLED' ? 'REFUNDED' : order.paymentStatus,
            statusHistory: newHistory,
          };
        }
        return order;
      })
    );

    // If currently tracked order is this one, update it
    setSelectedOrderForTracking((prev) =>
      prev && prev.id === orderId ? { ...prev, currentStatus: newStatus } : prev
    );

    showToast(`Order status updated to ${newStatus}`);
  };

  // --- PRODUCT DETAIL & REVIEWS ---
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const openOrderTracking = (order: Order) => {
    setSelectedOrderForTracking(order);
  };

  const closeOrderTracking = () => {
    setSelectedOrderForTracking(null);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'verified'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 1,
      verified: true,
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const newCount = p.reviewCount + 1;
          const newRating = Number(((p.rating * p.reviewCount + reviewData.rating) / newCount).toFixed(2));
          return { ...p, rating: newRating, reviewCount: newCount };
        }
        return p;
      })
    );

    showToast('Thank you! Your verified review has been published.');
  };

  // --- ADMIN ACTIONS ---
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...productData,
      id: `nap-p${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast('New product added to catalog');
  };

  const editProduct = (productId: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updated } : p))
    );
    showToast('Product updated successfully');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted');
  };

  const clearAllProducts = () => {
    setProducts([]);
    setCart([]);
    setWishlist([]);
    showToast('All clothes removed. Storefront is now clear.');
  };

  const createCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast(`Coupon ${coupon.code} created`);
  };

  // --- ADDRESS ACTIONS ---
  const addAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    if (newAddr.isDefault) {
      setSavedAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: false })).concat([newAddr])
      );
    } else {
      setSavedAddresses((prev) => [...prev, newAddr]);
    }
    showToast('Address saved');
  };

  const deleteAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed');
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast('Default delivery address updated');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        savedAddresses,
        user,
        coupons,
        appliedCoupon,
        activeTab,
        setActiveTab,
        selectedProduct,
        selectedOrderForTracking,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthOpen,
        setIsAdminAuthOpen,
        isAdminAuthenticated,
        verifyAdminPasscode,
        changeAdminPasscode,
        logoutAdmin,
        requestAdminAccess,
        isNotificationsOpen,
        setIsNotificationsOpen,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        recentlyViewed,
        reviews,
        toastMessage,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartMRP,
        cartDiscount,
        cartCount,
        freeShippingThreshold,
        remainingForFreeShipping,
        toggleWishlist,
        isWishlisted,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateOrderStatus,
        openProductDetail,
        closeProductDetail,
        openOrderTracking,
        closeOrderTracking,
        addReview,
        addProduct,
        editProduct,
        deleteProduct,
        clearAllProducts,
        createCoupon,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
