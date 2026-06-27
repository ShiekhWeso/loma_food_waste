import React, { useEffect, useState } from "react";
import API_URL from "../api";

export default function AnalyticsDashboard({ user }) {
  const [revenue, setRevenue] = useState(0);
  const [mealsSold, setMealsSold] = useState(0);
  const [activeDeals, setActiveDeals] = useState(0);
  const [wasteReduced, setWasteReduced] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // Fetch orders
      const resOrders = await fetch(`${API_URL}/api/orders?restaurant=${encodeURIComponent(user.name)}`);
      const orders = await resOrders.json();
      
      // Fetch meals
      const resMeals = await fetch(`${API_URL}/api/meals`);
      const meals = await resMeals.json();
      const myMeals = meals.filter(m => m.restaurant === user.name);

      // Calculations
      const totalRev = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const totalSold = orders.reduce((sum, o) => {
        return sum + o.items
          .filter(item => item.restaurant === user.name)
          .reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);

      const activeCount = myMeals.filter(m => m.qty > 0).length;
      const wasteCo2 = totalSold * 2.5; // 2.5 kg per meal

      setRevenue(totalRev);
      setMealsSold(totalSold);
      setActiveDeals(activeCount);
      setWasteReduced(wasteCo2);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left font-body">
      
      {/* Page Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Analytics Dashboard</h1>
          <p className="text-on-surface-variant text-sm mt-1">Track your kitchen's commercial performance and sustainability metrics.</p>
        </div>
      </header>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
          <p className="text-sm text-stone-400">Loading performance data...</p>
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Metric 1: Total Revenue */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(176,46,0,0.04)] relative overflow-hidden group border border-outline-variant/10">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-fixed opacity-50 rounded-full blur-2xl group-hover:bg-primary-fixed-dim transition-colors duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-primary-fixed rounded-lg text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="flex items-center gap-1 text-secondary text-xs font-semibold bg-secondary-fixed/30 px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-xs">trending_up</span> 12%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-on-surface-variant text-xs mb-1 font-semibold uppercase tracking-wider">Total Revenue</p>
                <h3 className="font-headline text-2xl font-bold text-on-surface">${revenue.toFixed(2)}</h3>
              </div>
            </div>

            {/* Metric 2: Meals Sold */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(176,46,0,0.04)] relative overflow-hidden group border border-outline-variant/10">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-fixed opacity-50 rounded-full blur-2xl group-hover:bg-tertiary-fixed-dim transition-colors duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-tertiary-fixed rounded-lg text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <span className="flex items-center gap-1 text-secondary text-xs font-semibold bg-secondary-fixed/30 px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-xs">trending_up</span> 8%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-on-surface-variant text-xs mb-1 font-semibold uppercase tracking-wider">Meals Sold</p>
                <h3 className="font-headline text-2xl font-bold text-on-surface">{mealsSold}</h3>
              </div>
            </div>

            {/* Metric 3: Active Deals */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(176,46,0,0.04)] relative overflow-hidden group border border-outline-variant/10">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-variant opacity-50 rounded-full blur-2xl group-hover:bg-surface-dim transition-colors duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-surface-variant rounded-lg text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined">local_offer</span>
                </div>
                <span className="flex items-center gap-1 text-on-surface-variant text-xs font-semibold bg-surface-variant/50 px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-xs font-bold">horizontal_rule</span> 0%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-on-surface-variant text-xs mb-1 font-semibold uppercase tracking-wider">Active Deals</p>
                <h3 className="font-headline text-2xl font-bold text-on-surface">{activeDeals}</h3>
              </div>
            </div>

            {/* Metric 4: Waste Reduced */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(176,46,0,0.04)] relative overflow-hidden group border border-outline-variant/10">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-fixed opacity-50 rounded-full blur-2xl group-hover:bg-secondary-fixed-dim transition-colors duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-secondary-fixed rounded-lg text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <span className="flex items-center gap-1 text-secondary text-xs font-semibold bg-secondary-fixed/30 px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-xs">trending_up</span> 15%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-on-surface-variant text-xs mb-1 font-semibold uppercase tracking-wider">Carbon Prevented</p>
                <h3 className="font-headline text-2xl font-bold text-secondary">{wasteReduced.toFixed(1)} kg CO2</h3>
              </div>
            </div>

          </div>

          {/* Revenue Chart Block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(176,46,0,0.04)] border border-outline-variant/10 flex flex-col justify-between min-h-[360px]">
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface">Weekly Revenue Simulation</h3>
                <p className="text-xs text-stone-400 mt-1 font-medium">Visualizing estimated daily rescues for this week.</p>
              </div>

              {/* simulated bars */}
              <div className="flex-grow flex items-end justify-between gap-3 h-48 relative border-b border-surface-container-highest pb-2 pt-8">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-stone-400 -ml-4 py-2 font-bold">
                  <span>$250</span>
                  <span>$125</span>
                  <span>$0</span>
                </div>

                <div className="w-full flex justify-around items-end h-full px-4 gap-2">
                  <div className="w-full max-w-[40px] bg-primary/20 hover:bg-primary/35 rounded-t-lg h-[40%] transition-all relative group cursor-pointer">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$100</span>
                  </div>
                  <div className="w-full max-w-[40px] bg-primary/40 hover:bg-primary/55 rounded-t-lg h-[60%] transition-all relative group cursor-pointer">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$150</span>
                  </div>
                  <div className="w-full max-w-[40px] bg-primary/30 hover:bg-primary/45 rounded-t-lg h-[45%] transition-all relative group cursor-pointer">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$112</span>
                  </div>
                  <div className="w-full max-w-[40px] bg-primary/70 hover:bg-primary/85 rounded-t-lg h-[80%] transition-all relative group cursor-pointer">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$200</span>
                  </div>
                  <div className="w-full max-w-[40px] bg-primary rounded-t-lg h-[95%] transition-all relative group cursor-pointer">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">${revenue > 0 ? revenue.toFixed(0) : "238"}</span>
                  </div>
                  <div className="w-full max-w-[40px] bg-primary/60 hover:bg-primary/75 rounded-t-lg h-[70%] transition-all relative group cursor-pointer">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$175</span>
                  </div>
                  <div className="w-full max-w-[40px] bg-primary/50 hover:bg-primary/65 rounded-t-lg h-[55%] transition-all relative group cursor-pointer">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$138</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-around text-[10px] text-stone-400 font-bold mt-3 px-4">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Insight Block */}
            <div className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10 flex flex-col justify-between">
              <div>
                <h4 className="font-headline font-bold text-base text-on-surface mb-2">Sustainable Impact</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  By listing surplus food on Lo'ma, your kitchen plays an active role in resolving organic greenhouse emissions.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/5 my-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-3xl fill">eco</span>
                <div className="text-left">
                  <h5 className="font-bold text-xs text-on-surface">Kitchen Status</h5>
                  <p className="text-[10px] text-stone-500 font-medium">Gold Tier Sustainable Kitchen Seal Active.</p>
                </div>
              </div>

              <p className="text-[10px] font-bold text-stone-400 text-center uppercase tracking-wider">
                Keep listing surplus to reduce more waste!
              </p>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
