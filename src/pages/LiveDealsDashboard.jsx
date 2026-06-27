import React, { useEffect, useState } from "react";
import API_URL from "../api";

export default function LiveDealsDashboard({ user, onRefreshMeals }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/meals`);
      const data = await res.json();
      // Filter by current restaurant name
      const filtered = data.filter(m => m.restaurant === (user ? user.name : "The Conscious Kitchen"));
      setMeals(filtered);
    } catch (err) {
      console.error("Error loading partner deals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to end this rescue deal?")) return;
    try {
      const res = await fetch(`${API_URL}/api/meals/${id}`, {
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

  return (
    <div className="text-left font-body">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Live Rescue Deals</h1>
          <p className="text-on-surface-variant text-sm mt-1">Monitor and manage your active gourmet listings.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meals.map((meal) => (
            <div 
              key={meal.id} 
              className="bg-surface-container-low p-5 rounded-[2rem] border border-outline-variant/10 shadow-[0_4px_24px_rgba(176,46,0,0.02)] flex gap-5 relative overflow-hidden group"
            >
              {/* Image */}
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-surface-dim shrink-0">
                <img 
                  src={meal.img} 
                  alt={meal.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline font-bold text-base text-on-surface leading-tight truncate max-w-[180px]">{meal.name}</h3>
                    <span 
                      style={{ color: meal.statusColor, backgroundColor: meal.statusBg }}
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm"
                    >
                      {meal.qty <= 0 ? "Sold Out" : meal.status}
                    </span>
                  </div>
                  <p className="text-xs text-secondary font-semibold mt-1 uppercase tracking-wider">{meal.category}</p>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">Pricing & Stock</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base font-extrabold text-primary">${meal.rescuePrice.toFixed(2)}</span>
                      <span className="text-xs text-stone-400 line-through">${meal.originalPrice.toFixed(2)}</span>
                      <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded ml-2">
                        {meal.qty} left
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(meal.id)}
                    className="bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center"
                    title="End Deal"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
