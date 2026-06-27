import React from "react";

export default function TopNavBar({ 
  user, 
  onNavigate, 
  activePage, 
  onToggleCart, 
  cartCount,
  onLogout,
  locationAddress = "Cairo, Maadi",
  onOpenLocationPicker
}) {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/10 shadow-[0_2px_15px_rgba(176,46,0,0.02)]">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate("landing")} 
            className="text-2xl font-extrabold tracking-tight text-primary hover:opacity-90 transition-opacity font-headline"
          >
            Lo’ma
          </button>
          
          {/* Main Links */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate("browse-deals")}
              className={`font-body text-sm font-semibold transition-colors duration-200 ${
                activePage === "browse-deals" 
                  ? "text-primary border-b-2 border-primary pb-0.5" 
                  : "text-on-surface hover:text-primary-container"
              }`}
            >
              Browse
            </button>
            <button 
              onClick={() => {
                onNavigate("landing");
                setTimeout(() => {
                  const el = document.getElementById("how-it-works");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="text-on-surface font-semibold hover:text-primary-container transition-colors duration-200 font-body text-sm"
            >
              How it Works
            </button>
            <button 
              onClick={() => {
                onNavigate("landing");
                setTimeout(() => {
                  const el = document.getElementById("impact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="text-on-surface font-semibold hover:text-primary-container transition-colors duration-200 font-body text-sm"
            >
              Impact
            </button>
            {user && (
              <button 
                onClick={() => {
                  if (user.role === "restaurant") {
                    onNavigate("restaurant-dashboard");
                  } else {
                    onNavigate("browse-deals");
                  }
                }}
                className="text-on-surface font-semibold hover:text-primary-container transition-colors duration-200 font-body text-sm"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenLocationPicker}
            className="p-2 text-on-surface hover:text-primary flex items-center justify-center gap-1 bg-surface-container-low px-3.5 py-2 rounded-xl border border-outline-variant/15 hover:border-primary/20 hover:scale-[0.98] transition-all"
            title="Change Delivery Location"
          >
            <span className="material-symbols-outlined text-base text-primary">location_on</span>
            <span className="text-xs font-bold text-on-surface max-w-[120px] truncate hidden sm:inline">{locationAddress}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-on-surface-variant hidden md:inline">
                Hi, {user.name}
              </span>
              <button
                onClick={onLogout}
                className="text-primary font-bold text-sm hover:text-primary-container transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate("login")}
                className="text-on-surface font-semibold hover:text-primary transition-colors text-sm"
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate("signup-choose")}
                className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm shadow-warm hover:scale-95 transition-transform"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Cart Trigger */}
          <button 
            onClick={onToggleCart}
            className="bg-surface-container-low hover:bg-surface-container-highest text-primary px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">shopping_cart</span>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center -ml-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
