import React, { useState } from "react";
import Logo from "./Logo";


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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCustomer   = user && user.role === "customer";
  const isPublic     = !user;

  // Nav link helper
  const NavBtn = ({ page, children, onClick }) => {
    const active = activePage === page;
    return (
      <button
        onClick={() => { if (onClick) onClick(); else onNavigate(page); setMobileOpen(false); }}
        className={`font-body text-sm font-semibold transition-colors duration-200 ${
          active
            ? "text-primary border-b-2 border-primary pb-0.5"
            : "text-on-surface hover:text-primary-container"
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/10 shadow-[0_2px_15px_rgba(176,46,0,0.02)]">
      <div className="flex justify-between items-center px-6 py-3.5 max-w-7xl mx-auto">

        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate(isCustomer ? "customer-home" : "landing")}
            className="hover:opacity-90 transition-opacity"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {isPublic && (
              <>
                <NavBtn page="browse-deals">Browse</NavBtn>
                <NavBtn
                  onClick={() => {
                    onNavigate("landing");
                    setTimeout(() => {
                      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  How it Works
                </NavBtn>
                <NavBtn
                  onClick={() => {
                    onNavigate("landing");
                    setTimeout(() => {
                      document.getElementById("impact")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Impact
                </NavBtn>
              </>
            )}

            {isCustomer && (
              <>
                <NavBtn page="customer-home">Home</NavBtn>
                <NavBtn page="marketplace">Marketplace</NavBtn>
                <NavBtn page="about">About Us</NavBtn>
                <NavBtn page="contact">Contact</NavBtn>
              </>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">

          {/* Location Picker (public + customer) */}
          {(isPublic || isCustomer) && (
            <button
              onClick={onOpenLocationPicker}
              className="p-2 text-on-surface hover:text-primary flex items-center justify-center gap-1 bg-surface-container-low px-3.5 py-2 rounded-xl border border-outline-variant/15 hover:border-primary/20 hover:scale-[0.98] transition-all"
              title="Change Delivery Location"
            >
              <span className="material-symbols-outlined text-base text-primary">location_on</span>
              <span className="text-xs font-bold text-on-surface max-w-[120px] truncate hidden sm:inline">
                {locationAddress}
              </span>
            </button>
          )}

          {/* PUBLIC: Login + Sign Up */}
          {isPublic && (
            <div className="hidden md:flex items-center gap-3">
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

          {/* CUSTOMER: Cart + Avatar */}
          {isCustomer && (
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={onToggleCart}
                className="relative bg-surface-container-low hover:bg-surface-container-highest text-primary px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center -ml-1 cart-badge-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Avatar */}
              <button
                onClick={() => onNavigate("profile")}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-headline font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-warm"
                title={`${user.name} — Profile`}
                aria-label="Open Profile"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
            </div>
          )}

          {/* PUBLIC: Cart (always visible) */}
          {isPublic && (
            <button
              onClick={onToggleCart}
              className="bg-surface-container-low hover:bg-surface-container-highest text-primary px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">shopping_cart</span>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center -ml-1">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-4 flex flex-col items-start gap-4 animate-page-in">
          {isPublic && (
            <>
              <NavBtn page="browse-deals">Browse</NavBtn>
              <NavBtn page="landing">Impact</NavBtn>
              <NavBtn page="login">Login</NavBtn>
              <NavBtn page="signup-choose">Sign Up</NavBtn>
            </>
          )}
          {isCustomer && (
            <>
              <NavBtn page="customer-home">Home</NavBtn>
              <NavBtn page="marketplace">Marketplace</NavBtn>
              <NavBtn page="about">About Us</NavBtn>
              <NavBtn page="contact">Contact</NavBtn>
              <NavBtn page="profile">Profile</NavBtn>
              <button
                onClick={onLogout}
                className="block w-full text-left text-primary font-bold text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
