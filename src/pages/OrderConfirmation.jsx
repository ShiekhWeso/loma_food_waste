import React, { useState, useEffect } from "react";

export default function OrderConfirmation({ order, onNavigate }) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    if (!order) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  if (!order) {
    return (
      <div className="pt-24 pb-20 text-center font-body">
        <p className="text-on-surface-variant">No active order details. Go back to browse deals!</p>
        <button 
          onClick={() => onNavigate("browse-deals")}
          className="mt-4 bg-primary text-white px-6 py-2.5 rounded-xl font-bold"
        >
          Browse Deals
        </button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const co2Saved = (order.items.reduce((acc, item) => acc + item.quantity, 0) * 2.5).toFixed(1);

  return (
    <div className="bg-background text-on-background min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 sm:p-8 font-body">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8 pt-20">
        
        {/* Success Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mb-2 shadow-[0_8px_32px_rgba(27,109,36,0.15)]">
            <span className="material-symbols-outlined text-on-secondary-container text-4xl fill">check_circle</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-on-background">Order Rescued!</h1>
          <p className="text-on-surface-variant max-w-md text-sm font-medium">
            Thank you for saving food. Your conscious choices are making a direct impact on the planet!
          </p>
        </div>

        {/* Receipt Card */}
        <div className="w-full bg-surface-container-lowest rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_32px_rgba(176,46,0,0.04)] flex flex-col gap-8 relative overflow-hidden border border-outline-variant/10">
          
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-container" />

          {/* Order Info Header */}
          <div className="flex justify-between items-center pb-6 border-b-2 border-surface-container-low border-dashed text-left">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-headline font-bold text-on-background text-sm">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pickup Time Window</p>
              <p className="font-headline font-bold text-primary text-sm">Within 15 mins</p>
            </div>
          </div>

          {/* Pickup Countdown Timer */}
          <div className="bg-tertiary-fixed text-on-tertiary-fixed p-6 rounded-2xl flex flex-col items-center justify-center gap-1 border border-tertiary/10">
            <span className="material-symbols-outlined text-3xl mb-1 text-tertiary">alarm</span>
            <span className="text-4xl font-headline font-extrabold tracking-widest">{formatTime(timeLeft)}</span>
            <span className="text-xs font-bold uppercase tracking-wider">Remaining for pickup</span>
          </div>

          {/* Items Rescued list */}
          <div className="flex flex-col gap-4 text-left">
            <h2 className="font-headline text-lg font-bold text-on-surface">Items Rescued</h2>
            <div className="flex flex-col gap-3">
              {order.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex justify-between items-center p-4 rounded-xl ${
                    index % 2 === 0 ? "bg-surface-container-low" : "bg-background"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-on-background leading-snug">{item.name}</p>
                      <p className="text-[10px] text-stone-400 font-semibold">{item.restaurant}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-on-background">${(item.rescuePrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-secondary-container/20 p-5 rounded-2xl flex items-center gap-4 border border-secondary/15 text-left">
            <span className="material-symbols-outlined text-secondary text-3xl fill">eco</span>
            <div>
              <h4 className="font-headline font-bold text-xs text-on-secondary-container mb-0.5">Carbon Prevention Seal</h4>
              <p className="text-[10px] text-stone-500 leading-relaxed">
                By choosing Lo'ma surplus, you avoided <span className="font-bold text-secondary">{co2Saved} kg of CO2e</span> emissions!
              </p>
            </div>
          </div>

          {/* Total & Checkout info */}
          <div className="flex justify-between items-center pt-6 border-t border-outline-variant/20">
            <div className="text-left">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Paid via Card</p>
              <p className="text-xs font-semibold text-stone-400">Total Charged</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-headline font-extrabold text-primary">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={() => onNavigate("browse-deals")}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm shadow-warm hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto"
          >
            Go to Browse Deals
          </button>
          <button 
            onClick={() => onNavigate("landing")}
            className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold text-sm hover:bg-outline-variant/35 active:scale-95 transition-all w-full sm:w-auto"
          >
            Return Home
          </button>
        </div>

      </main>
    </div>
  );
}
