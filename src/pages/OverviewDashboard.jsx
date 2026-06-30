import React, { useEffect, useState } from "react";

export default function OverviewDashboard({ user, onRefreshMeals, setActiveTab }) {
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic KPI States
  const [stats, setStats] = useState({
    totalMeals: 0,
    liveMeals: 0,
    expiredMeals: 0,
    hiddenMeals: 0,
    avgDiscount: 0,
    revenueRecovered: 0,
    mealsRescued: 0,
    totalViews: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const fetchData = async () => {
    if (!user) return;
    try {
      // Fetch meals
      const resMeals = await fetch("http://localhost:5000/api/meals");
      const mealsData = await resMeals.json();
      const restaurantMeals = mealsData.filter(m => m.restaurant === user.name);
      setMeals(restaurantMeals);

      // Fetch orders
      const resOrders = await fetch(`http://localhost:5000/api/orders?restaurant=${encodeURIComponent(user.name)}`);
      const ordersData = await resOrders.json();
      setOrders(ordersData);

      // Calculations
      const totalMeals = restaurantMeals.length;
      const liveMeals = restaurantMeals.filter(m => m.qty > 0 && !m.hidden).length;
      const hiddenMeals = restaurantMeals.filter(m => m.hidden).length;
      const expiredMeals = restaurantMeals.filter(m => m.status === "Expired" || m.qty <= 0).length; // simple approximation

      const avgDiscount = totalMeals > 0 
        ? Math.round(restaurantMeals.reduce((sum, m) => sum + (m.discount || 0), 0) / totalMeals) 
        : 0;

      const revenueRecovered = ordersData.reduce((sum, o) => sum + o.totalAmount, 0);
      
      const mealsRescued = ordersData.reduce((sum, o) => {
        return sum + o.items
          .filter(item => item.restaurant === user.name)
          .reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);

      const totalViews = restaurantMeals.reduce((sum, m) => sum + (Math.floor(m.qty * 4.5) + 12), 0);
      const pendingOrders = ordersData.filter(o => o.status === "Pending Pickup" || o.status === "Pending Payment").length;
      const completedOrders = ordersData.filter(o => o.status === "Completed").length;

      setStats({
        totalMeals,
        liveMeals,
        expiredMeals,
        hiddenMeals,
        avgDiscount,
        revenueRecovered,
        mealsRescued,
        totalViews,
        pendingOrders,
        completedOrders,
      });

    } catch (err) {
      console.error("Error loading overview dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [user]);


  const lowStockMeals = meals.filter(m => m.qty > 0 && m.qty <= 2);
  // expiringSoonMeals retained for future use
  // const expiringSoonMeals = meals.filter(m => m.qty > 0).slice(0, 3);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-3xl animate-spin text-primary">sync</span>
        <p className="text-sm text-stone-400">Loading control center...</p>
      </div>
    );
  }

  return (
    <div className="text-left font-body animate-page-in space-y-10">
      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Meals Listed", value: stats.totalMeals, desc: "All dishes registered", icon: "restaurant", color: "border-primary text-primary" },
          { title: "Currently Live", value: stats.liveMeals, desc: "Active on marketplace", icon: "storefront", color: "border-secondary text-secondary" },
          { title: "Average Discount", value: `${stats.avgDiscount}%`, desc: "Average savings listed", icon: "percent", color: "border-tertiary text-tertiary" },
          { title: "Revenue Recovered", value: `$${stats.revenueRecovered.toFixed(2)}`, desc: "Recovered surplus value", icon: "payments", color: "border-secondary text-secondary" },
          { title: "Meals Rescued", value: stats.mealsRescued, desc: "Dished saved from waste", icon: "eco", color: "border-primary text-primary" },
          { title: "Total Views", value: stats.totalViews, desc: "Estimated buyer views", icon: "visibility", color: "border-tertiary text-tertiary" },
          { title: "Pending Orders", value: stats.pendingOrders, desc: "Awaiting client pickup", icon: "hourglass_empty", color: "border-primary text-primary" },
          { title: "Completed Orders", value: stats.completedOrders, desc: "Successful rescues", icon: "task_alt", color: "border-secondary text-secondary" }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className={`bg-surface-container-lowest rounded-2xl p-6 shadow-warm border-t-4 ${card.color} hover:-translate-y-1 transition-transform duration-300 flex items-center justify-between`}
          >
            <div className="space-y-1">
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-headline font-black text-on-surface">{card.value}</h3>
              <p className="text-[11px] text-stone-400 font-medium">{card.desc}</p>
            </div>
            <span className="material-symbols-outlined text-3xl opacity-30">{card.icon}</span>
          </div>
        ))}
      </div>

      {/* ── Sub Grid: Recent Orders & Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-warm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg text-on-surface">Recent Rescue Orders</h3>
            <button onClick={() => setActiveTab("history")} className="text-xs font-bold text-primary hover:underline">
              View History
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-stone-400">No orders logged yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 4).map(o => (
                <div key={o.id} className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-xs font-bold text-on-surface">{o.id}</p>
                    <p className="text-[10px] text-stone-400 font-semibold">{new Date(o.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-primary">${o.totalAmount.toFixed(2)}</p>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-secondary-container text-on-secondary-container">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts & Expiring Soon */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-warm space-y-6">
          <h3 className="font-headline font-bold text-lg text-on-surface">Kitchen Alerts</h3>
          
          {/* Low Stock */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Low Stock Warnings</p>
            {lowStockMeals.length === 0 ? (
              <p className="text-xs text-stone-400">No stock alerts.</p>
            ) : (
              <div className="space-y-2">
                {lowStockMeals.map(m => (
                  <div key={m.id} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-on-surface">{m.name}</span>
                    <span className="bg-[#ffdad6] text-[#ba1a1a] px-2 py-0.5 rounded text-[10px]">{m.qty} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-outline-variant/10" />

          {/* Quick Actions */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary">Quick Actions</p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab("add-meal")}
                className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-xs shadow-warm hover:opacity-90 transition-opacity"
              >
                + Add New Dish
              </button>
              <button 
                onClick={() => setActiveTab("live-deals")}
                className="w-full bg-surface-container-high text-on-surface py-2.5 rounded-xl font-bold text-xs hover:bg-outline-variant/35 transition-colors"
              >
                Manage Active Listings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
