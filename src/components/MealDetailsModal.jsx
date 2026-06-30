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
      <div className="relative bg-background max-w-4xl w-full rounded-[2.5rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row border border-outline-variant/15 font-body text-left">
        
        {/* Left: Image & Badge */}
        <div className="md:w-1/2 relative h-64 md:h-auto min-h-[360px] bg-surface-dim">
          <img 
            src={meal.img} 
            alt={meal.name} 
            className="w-full h-full object-cover"
          />
          {/* Floating Urgency / Impact Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
            <div className="bg-primary text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg">
              -{discountVal}% Off
            </div>
            <div className="bg-secondary-container text-on-secondary-container px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs shadow-lg">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Freshly Prepared</span>
            </div>
          </div>
        </div>

        {/* Right: Meal details & Checkout actions */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            {/* Header / Category & Close */}
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary-container/20 px-3 py-1 rounded-full">
                {meal.category || "Gourmet"}
              </span>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center -mt-2 -mr-2"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Meal Name (Bold & Prominent) */}
            <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-3">
              {meal.name}
            </h2>

            {/* Vertical Information Hierarchy Stack */}
            <div className="space-y-2 mb-6 text-sm font-semibold">
              {/* Restaurant Name */}
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-lg">storefront</span>
                <span>{meal.restaurant}</span>
              </div>

              {/* Reason for Return */}
              <div className="flex items-center gap-2 text-stone-600">
                <span className="material-symbols-outlined text-lg text-primary/70">info</span>
                <span>Reason for Return: <strong className="text-on-surface">{meal.returnReason || "Cancellation"}</strong></span>
              </div>

              {/* Expiration Time */}
              <div className="flex items-center gap-2 text-stone-600">
                <span className="material-symbols-outlined text-lg text-tertiary">schedule</span>
                <span>Expiration Time: <strong className="text-on-surface">{meal.expiresIn || "2 hrs"}</strong></span>
              </div>

              {/* Availability & Distance */}
              <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  <span>{meal.qty} available</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">near_me</span>
                  <span>{meal.distance || "0.8 mi away"}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-on-surface-variant text-xs leading-relaxed mb-6 bg-surface-container-low/50 p-3.5 rounded-xl border border-outline-variant/10">
              {meal.description || "Indulge in a premium surplus culinary creation. Prepared with high-end artisan ingredients and saved from going to waste."}
            </p>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="border-t border-outline-variant/20 pt-5">
            <div className="flex justify-between items-end mb-5">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Rescue Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline font-extrabold text-primary">${meal.rescuePrice.toFixed(2)}</span>
                  <span className="text-sm text-stone-400 line-through font-medium">${meal.originalPrice.toFixed(2)}</span>
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
                className="w-full bg-primary text-white py-4 rounded-2xl font-headline font-bold text-base shadow-warm hover:bg-primary-container active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
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
