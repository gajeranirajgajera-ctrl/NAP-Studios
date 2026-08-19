import React from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Download,
  HelpCircle,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { selectedOrderForTracking, closeOrderTracking, showToast } = useShop();

  if (!selectedOrderForTracking) return null;

  const order = selectedOrderForTracking;

  const statusOrder: OrderStatus[] = [
    'ORDER_PLACED',
    'CONFIRMED',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  const currentStatusIndex = statusOrder.indexOf(order.currentStatus);

  const stepsMeta: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'ORDER_PLACED', label: 'Order Placed', icon: Clock },
    { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'PACKED', label: 'Packed', icon: Package },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
    { status: 'DELIVERED', label: 'Delivered', icon: ShieldCheck },
  ];

  const handleDownloadInvoice = () => {
    showToast(`Invoice for ${order.orderNumber} downloaded (PDF)`);
  };

  return (
    <div
      id="order-tracking-modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in select-none overflow-y-auto"
    >
      <div className="w-full max-w-xl min-h-screen sm:min-h-0 bg-zinc-900 border-0 sm:border border-zinc-800 rounded-none sm:rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl my-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-black font-brand text-white uppercase tracking-wider">
                LIVE ORDER TRACKING
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              ORDER ID: <strong className="text-white">{order.orderNumber}</strong> • AWB:{' '}
              <span className="text-cyan-400">{order.trackingId}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={closeOrderTracking}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto max-h-[75vh] text-xs font-mono">
          {/* Status Highlight Banner */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
                CURRENT SHIPMENT STATUS
              </div>
              <div className="text-base font-black text-white capitalize">
                {order.currentStatus.replace(/_/g, ' ').toLowerCase()}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Expected arrival: <strong className="text-zinc-200">{order.estimatedDelivery}</strong>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
              ON SCHEDULE
            </div>
          </div>

          {/* 6-Stage Visual Timeline */}
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 sm:p-5">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">
              STAGE TIMELINE
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
              {stepsMeta.map((s, idx) => {
                const isPassed = currentStatusIndex >= idx;
                const isCurrent = currentStatusIndex === idx;
                const Icon = s.icon;
                const historyItem = order.statusHistory.find((h) => h.status === s.status);

                return (
                  <div key={s.status} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'bg-cyan-400 border-cyan-300 text-zinc-950 ring-4 ring-cyan-400/20 scale-110'
                          : isPassed
                          ? 'bg-emerald-500 border-emerald-400 text-zinc-950'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-600'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />}
                    </div>

                    {/* Step Content */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs ${
                            isCurrent
                              ? 'text-cyan-400 text-sm'
                              : isPassed
                              ? 'text-white'
                              : 'text-zinc-600'
                          }`}
                        >
                          {s.label}
                        </span>
                        {historyItem && (
                          <span className="text-[10px] text-zinc-500">{historyItem.timestamp}</span>
                        )}
                      </div>

                      {historyItem ? (
                        <p className="text-zinc-400 font-sans text-xs mt-0.5 leading-relaxed">
                          {historyItem.description}
                        </p>
                      ) : (
                        <p className="text-zinc-600 font-sans text-[11px] mt-0.5">
                          Pending confirmation
                        </p>
                      )}

                      {historyItem?.location && (
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1">
                          <MapPin className="w-3 h-3 text-zinc-600" />
                          <span>{historyItem.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Rider / Partner Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cyan-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-bold">{order.courierPartner}</div>
                <div className="text-[11px] text-zinc-400">Courier Executive: Rajesh K. (+91 91234 56789)</div>
              </div>
            </div>

            <a
              href="tel:+919123456789"
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white"
              title="Call Delivery Executive"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

          {/* Items in this Order */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="text-zinc-300 font-bold uppercase tracking-wider">
              ITEMS IN SHIPMENT ({order.items.length})
            </div>

            <div className="divide-y divide-zinc-850">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-xl bg-zinc-900"
                    />
                    <div>
                      <div className="text-white font-bold text-xs">{item.product.name}</div>
                      <div className="text-[10px] text-zinc-400">
                        {item.selectedColor.name} • {item.selectedSize} • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-white">
                    ₹{(item.priceAtAddition * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Payment summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 block mb-1">SHIPPING ADDRESS</span>
              <div className="text-white font-bold">{order.shippingAddress.fullName}</div>
              <div className="text-zinc-400">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city} -{' '}
                {order.shippingAddress.pincode}
              </div>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 block mb-1">PAYMENT DETAILS</span>
              <div className="text-white font-bold">
                ₹{order.finalTotal.toLocaleString()} • {order.paymentMethod}
              </div>
              <div className="text-emerald-400 font-bold">STATUS: {order.paymentStatus}</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900 flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 font-mono text-xs font-bold rounded-2xl transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD INVOICE</span>
          </button>

          <button
            type="button"
            onClick={closeOrderTracking}
            className="flex-1 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-black rounded-2xl transition shadow-md"
          >
            CLOSE TRACKER
          </button>
        </div>
      </div>
    </div>
  );
};
