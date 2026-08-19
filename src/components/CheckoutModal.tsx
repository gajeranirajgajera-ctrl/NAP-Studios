import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Home,
  Lock,
  MapPin,
  Package,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    savedAddresses,
    addAddress,
    cart,
    cartTotal,
    createOrder,
    openOrderTracking,
    setActiveTab,
    showToast,
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses.find((a) => a.isDefault)?.id || savedAddresses[0]?.id || ''
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address Form
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newLine2, setNewLine2] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newState, setNewState] = useState('Karnataka');
  const [newPincode, setNewPincode] = useState('560038');
  const [newType, setNewType] = useState<'HOME' | 'WORK'>('HOME');

  // Step 2 Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<'STANDARD' | 'EXPRESS' | 'SAME_DAY'>('EXPRESS');

  // Step 3 Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'VPA'>('GPAY');
  const [vpaId, setVpaId] = useState('aryan@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Placed Order Reference
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newLine1 || !newPincode) return;

    addAddress({
      fullName: newFullName,
      phone: newPhone,
      addressLine1: newLine1,
      addressLine2: newLine2,
      city: newCity,
      state: newState,
      pincode: newPincode,
      type: newType,
      isDefault: true,
    });

    setIsAddingNewAddress(false);
  };

  const handlePlaceOrder = () => {
    const chosenAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

    const order = createOrder({
      paymentMethod,
      shippingAddress: chosenAddress,
      deliveryMethod,
    });

    setConfirmedOrder(order);
    setStep(4);
    showToast('Order confirmed! Tracking initiated.');
  };

  const currentAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  return (
    <div
      id="checkout-modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in select-none overflow-y-auto"
    >
      <div className="w-full max-w-xl min-h-screen sm:min-h-0 bg-zinc-900 border-0 sm:border border-zinc-800 rounded-none sm:rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-base sm:text-lg font-black font-brand text-white uppercase tracking-wider">
                {step === 4 ? 'ORDER CONFIRMATION' : 'SECURE CHECKOUT'}
              </h2>
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-Bit Encrypted Studio Protocol</span>
              </div>
            </div>
          </div>

          {step < 4 && (
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 4-Step Progress Indicator (for steps 1-3) */}
        {step < 4 && (
          <div className="grid grid-cols-3 bg-zinc-950/90 border-b border-zinc-800 text-[11px] font-mono p-2.5 text-center">
            <div
              className={`flex items-center justify-center gap-1.5 font-bold ${
                step >= 1 ? 'text-white' : 'text-zinc-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-zinc-800 text-[9px] flex items-center justify-center">1</span>
              <span>ADDRESS</span>
            </div>
            <div
              className={`flex items-center justify-center gap-1.5 font-bold ${
                step >= 2 ? 'text-white' : 'text-zinc-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-zinc-800 text-[9px] flex items-center justify-center">2</span>
              <span>DELIVERY</span>
            </div>
            <div
              className={`flex items-center justify-center gap-1.5 font-bold ${
                step >= 3 ? 'text-white' : 'text-zinc-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-zinc-800 text-[9px] flex items-center justify-center">3</span>
              <span>PAYMENT</span>
            </div>
          </div>
        )}

        {/* Step Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[70vh]">
          {/* ================= STEP 1: ADDRESS ================= */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  SELECT DELIVERY DESTINATION
                </span>
                {!isAddingNewAddress && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD NEW</span>
                  </button>
                )}
              </div>

              {isAddingNewAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs font-mono">
                  <div className="text-white font-bold text-xs mb-2">NEW ADDRESS FORM</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (+91)"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="House / Flat No., Apartment, Street"
                    required
                    value={newLine1}
                    onChange={(e) => setNewLine1(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Landmark / Locality (Optional)"
                    value={newLine2}
                    onChange={(e) => setNewLine2(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      maxLength={6}
                      required
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-white text-zinc-950 font-bold rounded-xl"
                    >
                      SAVE & USE THIS ADDRESS
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-4 py-2.5 bg-zinc-800 text-zinc-400 rounded-xl"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition text-xs font-mono ${
                          isSelected
                            ? 'bg-zinc-950 border-white ring-1 ring-white/20'
                            : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 font-bold text-white">
                            <span>{addr.fullName}</span>
                            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-white bg-white text-zinc-950' : 'border-zinc-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-zinc-400 font-sans text-xs mb-1">
                          {addr.addressLine1}, {addr.addressLine2}
                        </p>
                        <p className="text-zinc-400 font-sans text-xs">
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1.5">Phone: {addr.phone}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: DELIVERY METHOD ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                SELECT SPEED & DISPATCH METHOD
              </span>

              <div className="space-y-3">
                {[
                  {
                    id: 'EXPRESS',
                    title: 'EXPRESS AIR DISPATCH',
                    desc: '2-3 Business Days • Tracked via Delhivery Express',
                    cost: 'FREE',
                    badge: 'RECOMMENDED',
                  },
                  {
                    id: 'SAME_DAY',
                    title: 'METRO SAME-DAY DISPATCH',
                    desc: 'Guaranteed delivery today by 8:00 PM (Bengaluru/Delhi/Mumbai)',
                    cost: '₹149',
                    badge: 'SUPERFAST',
                  },
                  {
                    id: 'STANDARD',
                    title: 'STANDARD SURFACE',
                    desc: '4-5 Business Days • Eco-conscious ground routing',
                    cost: 'FREE',
                  },
                ].map((m) => {
                  const isSelected = deliveryMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setDeliveryMethod(m.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer transition text-xs font-mono ${
                        isSelected
                          ? 'bg-zinc-950 border-white ring-1 ring-white/20'
                          : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{m.title}</span>
                          {m.badge && (
                            <span className="text-[9px] bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-emerald-400 font-bold">{m.cost}</span>
                      </div>
                      <p className="text-zinc-400 font-sans text-xs">{m.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Destination preview */}
              <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-400">
                Shipping to: <strong>{currentAddress?.fullName}</strong> ({currentAddress?.city} - {currentAddress?.pincode})
              </div>
            </div>
          )}

          {/* ================= STEP 3: PAYMENT ================= */}
          {step === 3 && (
            <div className="space-y-4 text-xs font-mono">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                PAYMENT METHOD
              </span>

              {/* Payment Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI' },
                  { id: 'CARD', label: 'CARDS' },
                  { id: 'NETBANKING', label: 'NETBANKING' },
                  { id: 'COD', label: 'COD' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`py-2.5 rounded-xl font-bold transition text-center ${
                      paymentMethod === p.id
                        ? 'bg-white text-zinc-950 shadow-md'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* UPI Options */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="text-zinc-300 font-bold mb-2 flex items-center justify-between">
                    <span>SELECT UPI APP OR VPA</span>
                    <span className="text-emerald-400 text-[10px]">Instant 1-Click Verification</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'GPAY', label: 'Google Pay' },
                      { id: 'PHONEPE', label: 'PhonePe' },
                      { id: 'PAYTM', label: 'Paytm UPI' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as any)}
                        className={`p-3 rounded-xl border text-center font-bold transition ${
                          upiApp === app.id
                            ? 'bg-zinc-900 border-cyan-400 text-cyan-300'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-zinc-400 mb-1">ENTER UPI ID / VPA</label>
                    <input
                      type="text"
                      value={vpaId}
                      onChange={(e) => setVpaId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              {/* CARD Options */}
              {paymentMethod === 'CARD' && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold mb-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>CREDIT / DEBIT CARD</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                    defaultValue="4532 8492 1029 8831"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08/29"
                      className="bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="CVV"
                      defaultValue="749"
                      className="bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              )}

              {/* NETBANKING Options */}
              {paymentMethod === 'NETBANKING' && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="text-zinc-300 font-bold mb-2">POPULAR INDIAN BANKS</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-2.5 rounded-xl border text-left font-bold transition ${
                          selectedBank === b
                            ? 'bg-zinc-900 border-white text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CASH ON DELIVERY */}
              {paymentMethod === 'COD' && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cash on Delivery Available</span>
                  </div>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                    Pay securely in cash or via UPI QR to the delivery agent upon receiving your order.
                  </p>
                </div>
              )}

              {/* Amount to Pay summary */}
              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Payable Amount:</span>
                <span className="text-base font-black text-white">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* ================= STEP 4: ORDER CONFIRMATION ================= */}
          {step === 4 && confirmedOrder && (
            <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
                  ORDER PLACED SUCCESSFULLY
                </div>
                <h3 className="text-2xl font-black font-brand text-white uppercase tracking-tight">
                  THANK YOU, {confirmedOrder.shippingAddress.fullName.toUpperCase()}!
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  ORDER ID: <strong className="text-white">{confirmedOrder.orderNumber}</strong>
                </p>
              </div>

              {/* Order Snapshot Box */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-left text-xs font-mono space-y-3">
                <div className="flex justify-between border-b border-zinc-850 pb-2">
                  <span className="text-zinc-400">Estimated Delivery:</span>
                  <span className="text-white font-bold">{confirmedOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-2">
                  <span className="text-zinc-400">Courier Partner:</span>
                  <span className="text-white font-bold">{confirmedOrder.courierPartner}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-2">
                  <span className="text-zinc-400">Tracking AWB:</span>
                  <span className="text-cyan-400 font-bold">{confirmedOrder.trackingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Paid:</span>
                  <span className="text-base font-black text-white">₹{confirmedOrder.finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    openOrderTracking(confirmedOrder);
                  }}
                  className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs rounded-2xl tracking-wider shadow-xl transition flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>TRACK ORDER LIVE TIMELINE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActiveTab('HOME');
                  }}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-mono text-xs font-bold rounded-2xl transition"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation (Steps 1-3) */}
        {step < 4 && (
          <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900 sticky bottom-0 z-10">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs tracking-wider rounded-2xl transition flex items-center justify-center gap-2 shadow-xl"
              >
                <span>PROCEED TO DELIVERY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black font-mono text-xs tracking-wider rounded-2xl transition flex items-center justify-center gap-2 shadow-xl"
              >
                <span>PROCEED TO PAYMENT (₹{cartTotal.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-white text-zinc-950 font-black font-mono text-xs tracking-wider rounded-2xl transition active:scale-98 shadow-xl flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 fill-current" />
                <span>PAY & PLACE ORDER (₹{cartTotal.toLocaleString()})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
