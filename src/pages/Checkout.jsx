import React, { useState } from "react";

export default function Checkout({ cartItems, user, onOrderSuccess, onNavigate }) {
  const [name, setName] = useState(user ? user.name : "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user ? user.email : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const originalTotal = cartItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const rescueTotal = cartItems.reduce((acc, item) => acc + (item.rescuePrice * item.quantity), 0);
  const totalSavings = originalTotal - rescueTotal;
  const co2Saved = (cartItems.reduce((acc, item) => acc + item.quantity, 0) * 2.5).toFixed(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const orderBody = {
        customerId: user ? user.id : "guest",
        customerName: name,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          restaurant: item.restaurant,
          originalPrice: item.originalPrice,
          rescuePrice: item.rescuePrice,
          quantity: item.quantity
        })),
        totalAmount: rescueTotal,
        deliveryInfo: { name, phone, email, address: "Cairo, Maadi" }
      };

      const response = await fetch("http://localhost:5000/api/paymob/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      // Save order ID so we can fetch it when returning from redirect
      localStorage.setItem("loma_pending_order_id", data.orderId);

      // Redirect browser to Paymob portal (or mock sandbox simulator page)
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow pt-24 pb-32 px-4 md:px-8 max-w-screen-xl mx-auto w-full font-body text-left">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-on-background tracking-tight mb-2 font-headline">Secure Checkout</h1>
        <p className="text-on-surface-variant font-body text-base">Complete your order to rescue these delicious meals.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Delivery/Pickup Info */}
            <section className="bg-surface-container-low rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(176,46,0,0.02)] border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <h2 className="text-2xl font-bold text-on-background font-headline">Delivery Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="fullName">Full Name</label>
                  <input 
                    className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-sm font-semibold" 
                    id="fullName" 
                    placeholder="Jane Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="phone">Phone Number</label>
                  <input 
                    className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-sm font-semibold" 
                    id="phone" 
                    placeholder="+20 100 000 0000" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="email">Email Address</label>
                  <input 
                    className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-sm font-semibold" 
                    id="email" 
                    placeholder="jane@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                  />
                </div>
              </div>
            </section>

            {/* Payment Info */}
            <section className="bg-surface-container-low rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(176,46,0,0.02)] border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <h2 className="text-2xl font-bold text-on-background font-headline">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="w-5 h-5 rounded-full border-4 border-primary flex items-center justify-center shrink-0" />
                  <div className="flex-grow text-left">
                    <p className="text-sm font-bold text-on-background">Paymob Secure Checkout</p>
                    <p className="text-xs text-on-surface-variant">Pay securely using Credit Cards, Debit Cards, or Digital Wallets</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                </div>

                <p className="text-xs text-on-surface-variant px-2 text-left leading-relaxed">
                  🔒 By clicking below, you will be redirected to Paymob's secure payment portal. Your card details are fully encrypted and never stored on our servers.
                </p>
              </div>
            </section>

            <button 
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-[1.5rem] font-headline font-bold text-lg shadow-warm hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {loading ? "Redirecting to Paymob..." : `Pay securely with Paymob • $${rescueTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <aside className="bg-surface-container-low rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(176,46,0,0.02)] sticky top-24 border border-outline-variant/10">
            <h3 className="text-2xl font-bold mb-6 text-on-background font-headline">Order Summary</h3>
            
            {/* List of items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4 text-sm font-medium text-on-surface">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      {item.quantity}x
                    </span>
                    <span className="truncate max-w-[160px] font-semibold">{item.name}</span>
                  </div>
                  <span className="font-bold">${(item.rescuePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Impact indicator */}
            <div className="bg-secondary-container/20 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-secondary/10">
              <span className="material-symbols-outlined text-secondary fill">eco</span>
              <div className="text-xs font-bold text-on-secondary-container">
                This rescue prevents <span className="font-extrabold">{co2Saved} kg of CO2</span> emission!
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-6 border-t border-outline-variant/20 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Original Subtotal</span>
                <span>${originalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-secondary font-semibold">
                <span>Rescue Savings</span>
                <span>-${totalSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-headline font-bold text-on-surface pt-4 border-t border-outline-variant/20">
                <span>Final Total</span>
                <span className="text-primary">${rescueTotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
