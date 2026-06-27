import React, { useState } from "react";

export default function MealDetailsModal({ meal, isOpen, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  if (!isOpen || !meal) return null;

  const handleAdd = () => {
    onAddToCart(meal, qty);
    setQty(1); // Reset quantity
    onClose();
  };

  const discountVal = meal.discount || Math.round(((meal.originalPrice - meal.rescuePrice) / meal.originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative bg-background max-w-4xl w-full rounded-[2.5rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row border border-outline-variant/15 font-body">
        
        {/* Left: Image & Badge */}
        <div className="md:w-1/2 relative h-64 md:h-auto min-h-[320px] bg-surface-dim">
          <img 
            src={meal.img} 
            alt={meal.name} 
            className="w-full h-full object-cover"
          />
          {/* Floating Urgency / Impact Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
            <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs shadow-lg">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Prepared freshly</span>
            </div>
            <div className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs shadow-lg">
              <span className="material-symbols-outlined text-[16px]">timer</span>
              <span>Expires in {meal.expiresIn || "45m"}</span>
            </div>
          </div>
        </div>

        {/* Right: Meal details & Checkout actions */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            {/* Close Button */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary-container/20 px-3 py-1 rounded-full">
                  {meal.category || "Gourmet"}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center -mt-2 -mr-2"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Title & Restaurant */}
            <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
              {meal.name}
            </h2>
            <p className="text-sm font-semibold text-primary mb-6 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">storefront</span>
              {meal.restaurant} • <span className="text-stone-400">{meal.distance || "0.4 mi"}</span>
            </p>

            {/* Description */}
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              {meal.description || "Indulge in a premium surplus culinary creation. Prepared with high-end artisan ingredients and saved from going to waste."}
            </p>

            {/* Sustainability Impact */}
            <div className="bg-surface-container-low p-4 rounded-2xl mb-8 flex items-center gap-3 border border-outline-variant/10">
              <span className="material-symbols-outlined text-secondary text-2xl fill">eco</span>
              <div>
                <h5 className="font-bold text-xs text-on-surface">Sustainable Choice</h5>
                <p className="text-[11px] text-stone-500">Rescuing this single meal prevents 2.5 kg of CO2 equivalent emissions!</p>
              </div>
            </div>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="border-t border-outline-variant/20 pt-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Rescue Price</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-headline font-extrabold text-primary">${meal.rescuePrice.toFixed(2)}</span>
                  <span className="text-sm text-on-surface-variant line-through font-medium">${meal.originalPrice.toFixed(2)}</span>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-md">
                    {discountVal}% Off
                  </span>
                </div>
              </div>

              {/* Quantity selector */}
              {meal.qty > 0 ? (
                <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-3 py-1.5 border border-outline-variant/10">
                  <button 
                    disabled={qty <= 1}
                    onClick={() => setQty(prev => prev - 1)}
                    className="w-8 h-8 rounded-lg hover:bg-outline-variant/35 disabled:opacity-30 flex items-center justify-center font-bold text-sm text-on-surface"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{qty}</span>
                  <button 
                    disabled={qty >= meal.qty}
                    onClick={() => setQty(prev => prev + 1)}
                    className="w-8 h-8 rounded-lg hover:bg-outline-variant/35 disabled:opacity-30 flex items-center justify-center font-bold text-sm text-on-surface"
                  >
                    +
                  </button>
                </div>
              ) : (
                <span className="text-error font-bold text-sm uppercase tracking-wide">Sold Out</span>
              )}
            </div>

            {meal.qty > 0 ? (
              <button 
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-2xl font-headline font-bold text-base shadow-warm hover:opacity-95 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                Add {qty} to Rescue Cart
              </button>
            ) : (
              <button 
                disabled
                className="w-full bg-stone-300 text-stone-500 py-4 rounded-2xl font-headline font-bold text-base cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
