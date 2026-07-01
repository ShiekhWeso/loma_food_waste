import React, { useEffect, useState, useRef } from "react";

export default function LiveDealsDashboard({ user, onRefreshMeals }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);

  const fetchMeals = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/meals`);
      const data = await res.json();
      const filtered = data.filter(m => m.restaurant === (user ? user.name : "The Conscious Kitchen"));
      setMeals(filtered);
    } catch (err) {
      console.error("Error loading partner deals:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
    // Auto-refresh stats and deals every 15 seconds
    pollingRef.current = setInterval(() => fetchMeals(false), 15000);
    return () => clearInterval(pollingRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to end this rescue deal?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/meals/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMeals(prev => prev.filter(m => m.id !== id));
        if (onRefreshMeals) onRefreshMeals();
      } else {
        alert("Failed to delete deal");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStock = async (id, newQty) => {
    if (newQty < 0) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/meals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty })
      });
      if (res.ok) {
        setMeals(prev => prev.map(m => m.id === id ? { ...m, qty: newQty } : m));
        if (onRefreshMeals) onRefreshMeals();
      }
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  return (
    <div className="text-left font-body animate-page-in">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Live Rescue Deals</h1>
          <p className="text-on-surface-variant text-sm mt-1">Monitor and manage your active gourmet listings in real-time.</p>
        </div>
      </header>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
          <p className="text-sm text-stone-400">Loading your kitchen listings...</p>
        </div>
      ) : meals.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-outline-variant rounded-[2rem] bg-surface-container-low/30">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">storefront</span>
          <h4 className="font-bold text-base mb-1">No Active Deals</h4>
          <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
            You don't have any meals listed for rescue right now. Head over to the 'Add Meal' section to post one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {meals.map((meal) => {
            const initialQty = 15; // Simulated initial stock reference for progress bar
            const percentRemaining = Math.max(0, Math.min(100, (meal.qty / initialQty) * 100));
            const viewsSimulated = Math.floor(meal.qty * 4.5) + 12;
            const ordersSimulated = Math.max(0, initialQty - meal.qty);

            return (
              <div 
                key={meal.id} 
                className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
              >
                <div className="flex gap-5 items-center w-full md:w-auto">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-dim shrink-0">
                    <img 
                      src={meal.img} 
                      alt={meal.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-headline font-bold text-lg text-on-surface truncate">{meal.name}</h3>
                      <span 
                        style={{ color: meal.statusColor, backgroundColor: meal.statusBg }}
                        className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      >
                        {meal.qty <= 0 ? "Sold Out" : meal.status}
                      </span>
                    </div>
                    <p className="text-xs text-secondary font-bold uppercase tracking-widest">{meal.category}</p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-on-surface-variant font-medium">
                      <span className="text-base font-extrabold text-primary">${meal.rescuePrice.toFixed(2)}</span>
                      <span className="text-xs text-stone-400 line-through">${meal.originalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Progress & Quick Edit */}
                <div className="w-full md:w-64 space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-on-surface">
                    <span>Remaining Stock</span>
                    <span className="text-primary">{meal.qty} / {initialQty} Left</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentRemaining}%` }} 
                    />
                  </div>

                  {/* Quick Edit Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleUpdateStock(meal.id, meal.qty - 1)}
                      className="w-7 h-7 rounded-lg bg-surface-container-high hover:bg-outline-variant/30 flex items-center justify-center font-bold text-sm text-on-surface"
                      title="Decrease Stock"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{meal.qty}</span>
                    <button
                      onClick={() => handleUpdateStock(meal.id, meal.qty + 1)}
                      className="w-7 h-7 rounded-lg bg-surface-container-high hover:bg-outline-variant/30 flex items-center justify-center font-bold text-sm text-on-surface"
                      title="Increase Stock"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Simulated KPI values */}
                <div className="grid grid-cols-3 gap-4 w-full md:w-auto text-center md:text-left shrink-0 bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/5">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Views</span>
                    <span className="font-extrabold text-sm text-on-surface">{viewsSimulated}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Orders</span>
                    <span className="font-extrabold text-sm text-on-surface">{ordersSimulated}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Revenue</span>
                    <span className="font-extrabold text-sm text-secondary">${(ordersSimulated * meal.rescuePrice).toFixed(0)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button 
                    onClick={() => handleDelete(meal.id)}
                    className="bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white p-3 rounded-xl transition-all duration-150 flex items-center justify-center"
                    title="End Listing"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">delete</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
