import React, { useState, useEffect } from "react";

export default function ProfilePage({ user, meals, onLogout, onNavigate, addToast, onToggleFavorite, onAddToCart }) {
  const [activeTab, setActiveTab] = useState("info");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const favoriteMeals = (meals || []).filter(meal => user?.favorites?.includes(meal.id));

  // Editable Profile Info Form State
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phone, setPhone] = useState(user?.phone || "+20 100 123 4567");
  const [address, setAddress] = useState(user?.address || "Cairo, Maadi");
  const [isEditing, setIsEditing] = useState(false);

  // Notifications State
  const [notiSettings, setNotiSettings] = useState({
    orderStatus: true,
    deals: true,
    weeklyImpact: false
  });

  useEffect(() => {
    if (activeTab === "orders" && user) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/orders?customerId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Error loading profile orders:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSaveInfo = (e) => {
    e.preventDefault();
    setIsEditing(false);
    if (addToast) {
      addToast({
        type: "success",
        title: "Profile Updated",
        message: "Your personal details have been saved successfully."
      });
    }
  };

  const handleReorder = async (orderItems) => {
    for (const item of orderItems) {
      onNavigate("marketplace");
      if (addToast) {
        addToast({
          type: "info",
          title: "Meal Reordered",
          message: `Redirecting to Marketplace to rescue ${item.name} again!`
        });
      }
      break;
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return "";
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto font-body text-left animate-page-in">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Side: Avatar Panel */}
        <aside className="w-full md:w-80 bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-headline font-extrabold text-3xl mx-auto mb-4 shadow-warm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="text-xl font-headline font-bold text-on-surface">{user?.name || "Lo'ma Diner"}</h2>
          <p className="text-xs text-on-surface-variant mb-6">{user?.email || "customer@loma.com"}</p>

          <nav className="flex flex-col gap-1">
            {[
              { id: "info", label: "Personal Info", icon: "person" },
              { id: "orders", label: "My Orders", icon: "history" },
              { id: "favorites", label: "Favorite Meals", icon: "favorite" },
              { id: "preferences", label: "Preferences", icon: "settings" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white font-bold shadow-warm"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-error hover:bg-error-container/20 transition-all mt-4"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Right Side: Tab Panel Contents */}
        <main className="flex-1 w-full bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
          
          {/* TAB 1: Personal Information Form */}
          {activeTab === "info" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-headline font-extrabold text-on-surface">Personal Information</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/20 hover:bg-surface-container-low text-xs font-bold text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-sm">{isEditing ? "close" : "edit"}</span>
                  <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                </button>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-75 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-75 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-75 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Saved Address</label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-75 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-headline font-bold text-sm shadow-warm hover:opacity-90 transition-opacity"
                  >
                    Save Changes
                  </button>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: Embedded Order History */}
          {activeTab === "orders" && (
            <div>
              <h3 className="text-2xl font-headline font-extrabold text-on-surface mb-6">Order History</h3>
              
              {loadingOrders ? (
                <div className="flex items-center gap-3 py-10 justify-center">
                  <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                  <span className="text-sm font-medium text-on-surface-variant">Gathering your order records...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-outline-variant/30 rounded-2xl">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">history</span>
                  <p className="text-sm text-on-surface-variant font-semibold">You have no rescues yet.</p>
                  <button
                    onClick={() => onNavigate("marketplace")}
                    className="mt-3 text-primary font-bold text-xs hover:underline"
                  >
                    Start Saving Food Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    const co2Saved = (order.items.reduce((acc, item) => acc + item.quantity, 0) * 2.5).toFixed(1);
                    return (
                      <div key={order.id} className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-xs font-bold text-primary">{order.id}</span>
                            <p className="text-xs text-stone-400 font-semibold">{formatDate(order.timestamp)}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-primary">${order.totalAmount.toFixed(2)}</span>
                            <div className="flex items-center gap-1 mt-0.5 justify-end">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                              <span className="text-[10px] font-bold text-secondary uppercase">{order.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-medium text-on-surface">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="text-stone-400">({item.restaurant})</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
                          <span className="bg-secondary-container/20 text-on-secondary-container px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px] fill text-secondary">eco</span>
                            <span>{co2Saved} kg CO2 Saved</span>
                          </span>

                          <button
                            onClick={() => handleReorder(order.items)}
                            className="bg-primary/10 hover:bg-primary hover:text-white text-primary px-3 py-1 rounded-lg text-xs font-bold transition-all"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2.5: Favorite Meals */}
          {activeTab === "favorites" && (
            <div>
              <h3 className="text-2xl font-headline font-extrabold text-on-surface mb-6">Favorite Meals</h3>
              
              {favoriteMeals.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-outline-variant/30 rounded-2xl">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">favorite</span>
                  <p className="text-sm text-on-surface-variant font-semibold">You haven't favorited any meals yet.</p>
                  <button
                    onClick={() => onNavigate("marketplace")}
                    className="mt-3 text-primary font-bold text-xs hover:underline"
                  >
                    Browse Food to Favorite
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteMeals.map(meal => {
                    const discount = meal.discount || Math.round(((meal.originalPrice - meal.rescuePrice) / meal.originalPrice) * 100);
                    return (
                      <div key={meal.id} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-dim shrink-0 relative">
                          <img src={meal.img} alt={meal.name} className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-primary text-white text-[8px] font-extrabold px-1 py-0.5 rounded shadow">
                            -{discount}%
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline font-bold text-sm text-on-surface truncate">{meal.name}</h4>
                          <p className="text-xs text-secondary font-semibold flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-xs">storefront</span>
                            <span className="truncate">{meal.restaurant}</span>
                          </p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-headline font-extrabold text-sm text-primary">${meal.rescuePrice.toFixed(2)}</span>
                            <span className="text-[10px] text-stone-400 line-through font-medium">${meal.originalPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => {
                              onAddToCart?.(meal, 1);
                              if (addToast) {
                                addToast({
                                  type: "success",
                                  title: "Added to Cart!",
                                  message: `${meal.name} added to your rescue cart.`
                                });
                              }
                            }}
                            disabled={meal.qty <= 0}
                            className="bg-primary hover:bg-primary-container text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-warm flex items-center gap-1 active:scale-95 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-xs">add_shopping_cart</span>
                            <span>Rescue</span>
                          </button>
                          
                          <button
                            onClick={() => onToggleFavorite?.(meal.id)}
                            className="border border-outline-variant/20 hover:bg-error-container/10 hover:text-error text-stone-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs text-red-500 fill">favorite</span>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Preferences Settings */}
          {activeTab === "preferences" && (
            <div>
              <h3 className="text-2xl font-headline font-extrabold text-on-surface mb-6">Preferences</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Order Updates</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Receive status changes for your rescue orders.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notiSettings.orderStatus}
                    onChange={e => setNotiSettings({ ...notiSettings, orderStatus: e.target.checked })}
                    className="w-4 h-4 text-primary border-outline focus:ring-primary rounded"
                  />
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Live Deals &amp; Discounts</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Be notified when gourmet deals post near Cairo, Maadi.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notiSettings.deals}
                    onChange={e => setNotiSettings({ ...notiSettings, deals: e.target.checked })}
                    className="w-4 h-4 text-primary border-outline focus:ring-primary rounded"
                  />
                </div>

                <div className="flex justify-between items-center pb-4">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Weekly Environmental Summary</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Track how much organic CO₂ you prevented weekly.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notiSettings.weeklyImpact}
                    onChange={e => setNotiSettings({ ...notiSettings, weeklyImpact: e.target.checked })}
                    className="w-4 h-4 text-primary border-outline focus:ring-primary rounded"
                  />
                </div>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
