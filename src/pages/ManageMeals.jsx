import React, { useEffect, useState } from "react";

export default function ManageMeals({ user, onRefreshMeals, onSelectMealForEdit }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/meals");
      const data = await res.json();
      const filtered = data.filter(m => m.restaurant === user.name);
      setMeals(filtered);
    } catch (err) {
      console.error("Error fetching restaurant meals:", err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchMeals(); }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing completely?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/meals/${id}`, {
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

  const handleToggleHide = async (meal) => {
    const nextHiddenState = !meal.hidden;
    try {
      const res = await fetch(`http://localhost:5000/api/meals/${meal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: nextHiddenState })
      });
      if (res.ok) {
        setMeals(prev => prev.map(m => m.id === meal.id ? { ...m, hidden: nextHiddenState } : m));
        if (onRefreshMeals) onRefreshMeals();
      }
    } catch (err) {
      console.error("Error toggling meal visibility:", err);
    }
  };

  const handleDuplicate = async (meal) => {
    try {
      const duplicatedMeal = {
        name: `${meal.name} (Copy)`,
        restaurant: meal.restaurant,
        img: meal.img,
        originalPrice: meal.originalPrice,
        rescuePrice: meal.rescuePrice,
        qty: meal.qty,
        category: meal.category,
        expiresIn: meal.expiresIn,
        description: meal.description,
        returnReason: meal.returnReason || "Cancellation"
      };

      const res = await fetch("http://localhost:5000/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicatedMeal)
      });
      if (res.ok) {
        fetchMeals();
        if (onRefreshMeals) onRefreshMeals();
      }
    } catch (err) {
      console.error("Error duplicating meal:", err);
    }
  };

  return (
    <div className="text-left font-body animate-page-in">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Manage Kitchen Meals</h1>
          <p className="text-on-surface-variant text-sm mt-1">Review, modify, duplicate, or delete your rescue listings.</p>
        </div>
      </header>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
          <p className="text-sm text-stone-400">Loading your menu...</p>
        </div>
      ) : meals.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-outline-variant rounded-[2rem] bg-surface-container-low/30">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">storefront</span>
          <h4 className="font-bold text-base mb-1">No Meals Found</h4>
          <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
            Get started by adding a meal listing to your menu dashboard.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-warm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-on-surface-variant">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/15 text-stone-500 uppercase tracking-wider text-left">
                  <th className="p-4">Meal</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Prices</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Expiry</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {meals.map(meal => {
                  const finalPrice = meal.rescuePrice || 0;
                  const discount = meal.discount || 0;
                  return (
                    <tr key={meal.id} className={`hover:bg-surface-container-low/30 ${meal.hidden ? "opacity-60" : ""}`}>
                      <td className="p-4 flex items-center gap-3">
                        <img src={meal.img} alt={meal.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-on-surface text-sm">{meal.name}</p>
                          <p className="text-[10px] text-stone-400 font-medium">{meal.category}</p>
                        </div>
                      </td>
                      <td className="p-4">{meal.returnReason || "Cancellation"}</td>
                      <td className="p-4">
                        <span className="text-primary font-bold">${finalPrice.toFixed(2)}</span>
                        <span className="text-stone-400 line-through ml-2">${meal.originalPrice.toFixed(2)}</span>
                        <span className="text-xs text-stone-400 ml-1">({discount}%)</span>
                      </td>
                      <td className="p-4">{meal.qty}</td>
                      <td className="p-4">{meal.expiresIn}</td>
                      <td className="p-4">
                        <span 
                          style={{ color: meal.statusColor, backgroundColor: meal.statusBg }}
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                        >
                          {meal.qty <= 0 ? "Sold Out" : meal.status}
                        </span>
                        {meal.hidden && (
                          <span className="ml-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-surface-container-highest text-stone-500 uppercase">
                            Hidden
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleHide(meal)}
                          className="p-2 hover:bg-surface-container-high rounded-lg text-stone-500 hover:text-on-surface"
                          title={meal.hidden ? "Show on Marketplace" : "Hide from Marketplace"}
                        >
                          <span className="material-symbols-outlined text-sm font-bold">
                            {meal.hidden ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDuplicate(meal)}
                          className="p-2 hover:bg-surface-container-high rounded-lg text-secondary hover:text-on-surface"
                          title="Duplicate"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">content_copy</span>
                        </button>
                        <button
                          onClick={() => onSelectMealForEdit(meal)}
                          className="p-2 hover:bg-surface-container-high rounded-lg text-primary hover:text-on-surface"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(meal.id)}
                          className="p-2 hover:bg-error-container hover:text-error rounded-lg text-error"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
