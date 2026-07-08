import React, { useState, useEffect } from "react";

export default function Checkout({ cartItems, user, onOrderSuccess, onNavigate, addToast }) {
  const [name, setName] = useState(user ? user.name : "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email] = useState(user ? user.email : "");
  
  // Simplified Address Form Fields
  const [address, setAddress] = useState(user?.address || "Cairo, Maadi");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  useEffect(() => {
    if (!waitingForPayment || !pendingOrderId) return;
    
    let intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/orders/${pendingOrderId}`);
        if (res.ok) {
          const order = await res.json();
          if (order.status === "Pending Pickup" || order.status === "Completed") {
            clearInterval(intervalId);
            setWaitingForPayment(false);
            if (addToast) {
              addToast({
                type: "success",
                title: "Payment Successful",
                message: "Your payment has been received and verified!"
              });
            }
            onOrderSuccess(order);
          } else if (order.status === "Payment Failed") {
            clearInterval(intervalId);
            setWaitingForPayment(false);
            setError("The payment transaction failed. Please try again.");
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error polling order status:", err);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [waitingForPayment, pendingOrderId, onOrderSuccess, addToast]);

  const originalTotal = cartItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const rescueTotal = cartItems.reduce((acc, item) => acc + (item.rescuePrice * item.quantity), 0);
  const totalSavings = originalTotal - rescueTotal;
  const co2Saved = (cartItems.reduce((acc, item) => acc + item.quantity, 0) * 2.5).toFixed(1);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      if (addToast) addToast({ type: "error", title: "Unsupported", message: "Geolocation is not supported by your browser." });
      return;
    }
    
    if (addToast) addToast({ type: "info", title: "Locating", message: "Finding your current coordinates..." });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddress(`Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        if (addToast) {
          addToast({
            type: "success",
            title: "Location Detected",
            message: `Position pinned: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          });
        }
      },
      (err) => {
        if (addToast) addToast({ type: "error", title: "Permission Denied", message: "Could not auto-detect location. Please type manually." });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const fullAddress = `${address}, Bldg: ${building}, Floor: ${floor}, Apt: ${apartment} ${notes ? `(${notes})` : ""}`;
      
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
        deliveryInfo: { 
          name, 
          phone, 
          email, 
          address: fullAddress 
        }
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/paymob/initiate-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      localStorage.setItem("loma_pending_order_id", data.orderId);
      setPendingOrderId(data.orderId);
      
      // Open Paymob URL in a new tab instead of current site redirection
      window.open(data.paymentUrl, "_blank");
      
      // Put the page in waiting state to start order polling
      setWaitingForPayment(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      if (addToast) {
        addToast({
          type: "error",
          title: "Payment Error",
          message: err.message
        });
      }
    }
  };

  return (
    <main className="flex-grow pt-24 pb-32 px-4 md:px-8 max-w-screen-xl mx-auto w-full font-body text-left animate-page-in">
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
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Delivery/Pickup Info */}
            <section className="bg-surface-container-low rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(176,46,0,0.02)] border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <h2 className="text-2xl font-bold text-on-background font-headline">Delivery Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="fullName">Recipient Name</label>
                  <input 
                    className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold" 
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
                    className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold" 
                    id="phone" 
                    placeholder="+20 100 000 0000" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    type="tel"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center ml-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block" htmlFor="address">Delivery Address</label>
                    <button
                      type="button"
                      onClick={detectLocation}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">my_location</span>
                      <span>Pin GPS Location</span>
                    </button>
                  </div>
                  <input 
                    className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold" 
                    id="address" 
                    placeholder="Street, District, Cairo" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="building">Building / Villa</label>
                  <input 
                    className="w-full bg-surface-bright border-none rounded-xl px-5 py-3 text-on-background focus:ring-2 focus:ring-primary text-sm font-semibold" 
                    id="building" 
                    placeholder="Bldg 4" 
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    required
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="floor">Floor / Apartment</label>
                  <div className="flex gap-2">
                    <input 
                      className="w-1/2 bg-surface-bright border-none rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-primary text-sm font-semibold" 
                      placeholder="Floor 3" 
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      required
                      type="text"
                    />
                    <input 
                      className="w-1/2 bg-surface-bright border-none rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-primary text-sm font-semibold" 
                      placeholder="Apt 12" 
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="notes">Additional Delivery Instructions</label>
                  <input 
                    className="w-full bg-surface-bright border-none rounded-xl px-5 py-3.5 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary text-sm font-semibold" 
                    id="notes" 
                    placeholder="E.g., Leave with doorman, Ring bell on arrival..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    type="text"
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
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-[1.5rem] font-headline font-bold text-lg shadow-warm hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  <span>Redirecting to Paymob...</span>
                </>
              ) : (
                `Confirm and Pay • $${rescueTotal.toFixed(2)}`
              )}
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

      {waitingForPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in text-center">
          <div className="bg-surface-container-low max-w-md w-full rounded-[2.5rem] p-8 border border-outline-variant/15 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto animate-pulse">
              <span className="material-symbols-outlined text-3xl">credit_card</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline font-extrabold text-2xl text-on-background">Waiting for Payment</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We opened the secure Paymob payment window in a new tab. Please fill in your card details to complete the rescue!
              </p>
            </div>
            <div className="p-4 bg-primary-container/10 rounded-2xl border border-primary/10 text-xs text-on-primary-container leading-relaxed">
              <strong>💡 Do not close this page:</strong> As soon as you finish paying in the other tab, this window will automatically update with your receipt.
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setWaitingForPayment(false);
                  setLoading(false);
                }}
                className="w-full bg-surface-container-highest text-on-surface py-3.5 rounded-xl font-bold text-sm hover:bg-outline-variant/30 transition-colors"
              >
                Cancel & Change Details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
