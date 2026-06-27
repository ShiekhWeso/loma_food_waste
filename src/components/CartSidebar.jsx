import React from "react";

export default function CartSidebar({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onCheckout 
}) {
  if (!isOpen) return null;

  const originalTotal = cartItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const rescueTotal = cartItems.reduce((acc, item) => acc + (item.rescuePrice * item.quantity), 0);
  const totalSavings = originalTotal - rescueTotal;
  const co2Saved = (cartItems.reduce((acc, item) => acc + item.quantity, 0) * 2.5).toFixed(1); // 2.5kg CO2 per meal saved

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-inverse-surface/30 z-[100] transition-opacity duration-300 backdrop-blur-sm"
      />

      {/* Cart Drawer */}
      <aside 
        className="bg-background text-on-background fixed top-0 right-0 h-full w-full sm:w-[420px] z-[110] rounded-l-[2rem] shadow-[-20px_0_40px_rgba(0,0,0,0.15)] flex flex-col transition-transform duration-500 ease-in-out font-body"
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-[#f0f6e8]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">shopping_cart</span>
            <h2 className="text-2xl font-headline font-extrabold text-[#ac2d00] tracking-tight">Your Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-outline-variant/60">shopping_basket</span>
              <p className="text-on-surface-variant font-medium">Your cart is empty.</p>
              <p className="text-xs text-stone-400 max-w-[240px]">Browse Cairo, Maadi's gourmet surplus deals to fill it and prevent food waste!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-[0_4px_16px_rgba(176,46,0,0.02)] border border-outline-variant/10 relative overflow-hidden group"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-dim shrink-0">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface leading-tight truncate max-w-[180px]">{item.name}</h4>
                    <p className="text-xs text-stone-400 mt-0.5">{item.restaurant}</p>
                  </div>
                  
                  {/* Prices & Qty Controls */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">${item.rescuePrice.toFixed(2)}</span>
                      <span className="text-xs text-on-surface-variant line-through font-medium">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-2 py-1">
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg hover:bg-outline-variant/30 flex items-center justify-center font-bold text-sm text-on-surface"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg hover:bg-outline-variant/30 flex items-center justify-center font-bold text-sm text-on-surface"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Sums */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-outline-variant/20 bg-[#f0f6e8]/50 space-y-4">
            <div className="bg-secondary-container/20 p-3 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary fill">eco</span>
              <div className="text-xs font-semibold text-on-secondary-container">
                This rescue prevents <span className="font-bold">{co2Saved} kg of CO2</span> emission!
              </div>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Original Subtotal</span>
                <span>${originalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-secondary font-semibold">
                <span>Rescue Discount</span>
                <span>-${totalSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-headline font-bold text-on-surface pt-2 border-t border-outline-variant/20">
                <span>Final Total</span>
                <span className="text-primary">${rescueTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-2xl font-headline font-bold text-base shadow-warm hover:opacity-95 active:scale-95 transition-all duration-150 mt-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
