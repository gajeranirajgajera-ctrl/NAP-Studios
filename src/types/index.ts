export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
  inStock: boolean;
}

export interface ProductSizeStock {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'ONE SIZE' | string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  category: 'T-Shirts' | 'Shirts' | 'Hoodies' | 'Sweatshirts' | 'Jackets' | 'Jeans' | 'Trousers' | 'Shorts' | 'Accessories' | string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSizeStock[];
  description: string;
  composition: string;
  gsm?: number;
  fit: 'Oversized' | 'Boxy Heavyweight' | 'Relaxed' | 'Regular' | 'Slim' | 'Wide Leg' | string;
  careInstructions: string[];
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isLimitedDrop?: boolean;
  dropCountdownEnd?: string; // ISO String
  limitedDropStock?: number;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  itemCount: number;
  description: string;
  badge?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  priceAtAddition: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'HOME' | 'WORK' | 'OTHER' | string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
}

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalMRP: number;
  productDiscount: number;
  couponDiscount: number;
  couponCodeApplied?: string;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | string;
  shippingAddress: Address;
  deliveryMethod: 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | string;
  trackingId: string;
  courierPartner: string;
  estimatedDelivery: string;
  createdAt: string;
  currentStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  sizePurchased: string;
  helpfulCount: number;
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  membershipTier: 'NAP MEMBER' | 'NAP VIP BLACK' | 'NAP INNER CIRCLE' | string;
  points?: number;
  loyaltyPoints: number;
  storeCredits: number;
  memberSince: string;
  joinedDate?: string;
}

export type ActiveTab = 'HOME' | 'CATALOG' | 'WISHLIST' | 'ACCOUNT' | 'CATEGORIES' | 'SEARCH';
