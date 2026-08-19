import { Address, Category, Coupon, Order, Product, Review, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 't-shirts',
    name: 'T-Shirts',
    itemCount: 0,
    description: 'Heavyweight French Terry & 280 GSM oversized drops.',
    badge: 'Category',
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    itemCount: 0,
    description: '450 GSM double-layered custom fleece silhouettes.',
  },
  {
    id: 'jackets',
    name: 'Jackets',
    itemCount: 0,
    description: 'Tactical bombers, washed canvas & utility windbreakers.',
  },
  {
    id: 'jeans',
    name: 'Jeans',
    itemCount: 0,
    description: '14oz Japanese raw denim & vintage washed wide-leg cuts.',
  },
  {
    id: 'sweatshirts',
    name: 'Sweatshirts',
    itemCount: 0,
    description: 'Relaxed crewnecks with drop-shoulder aesthetics.',
  },
  {
    id: 'shirts',
    name: 'Shirts',
    itemCount: 0,
    description: 'Cuban collar overshirts & textured jacquard buttons.',
  },
  {
    id: 'trousers',
    name: 'Trousers',
    itemCount: 0,
    description: 'Parachute cargo pants & pleated tailoring.',
  },
  {
    id: 'shorts',
    name: 'Shorts',
    itemCount: 0,
    description: 'Double-mesh athletic and heavyweight fleece shorts.',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    itemCount: 0,
    description: 'Distressed caps, structured canvas totes, socks & hardware.',
  },
];

// Zero clothes/products by default — empty slots ready for admin to upload photos and products
export const INITIAL_PRODUCTS: Product[] = [];

// Zero offers/coupons by default
export const INITIAL_COUPONS: Coupon[] = [];

export const INITIAL_USER: User = {
  id: 'user-001',
  name: 'Sangita Patel',
  email: 'patelsangita28480@gmail.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  membershipTier: 'BRAND FOUNDER',
  points: 0,
  loyaltyPoints: 0,
  storeCredits: 0,
  memberSince: '2026',
  joinedDate: 'August 2026',
};

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    fullName: 'Sangita Patel',
    phone: '+91 98765 43210',
    addressLine1: 'Studio 101, Fashion Tech Hub',
    addressLine2: 'Road No. 12, Indiranagar',
    landmark: 'Near 100 Feet Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    type: 'HOME',
    isDefault: true,
  },
];

export const INITIAL_REVIEWS: Review[] = [];

export const INITIAL_ORDERS: Order[] = [];
