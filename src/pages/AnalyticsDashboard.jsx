import React, { useEffect, useState } from "react";

export default function AnalyticsDashboard({ user }) {
  const [revenue, setRevenue] = useState(0);
  const [mealsSold, setMealsSold] = useState(0);
  const [activeDeals, setActiveDeals] = useState(0);
  const [wasteReduced, setWasteReduced] = useState(0);
  const [loading, setLoading] = useState(true);

  const rescueRate = 84;
  const revRecovery = 42;

  // Popular and return reason counts
  const [popularMeals, setPopularMeals] = useState([]);
  const [returnReasons, setReturnReasons] = useState({});

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const resOrders = await fetch(`${baseUrl}/api/orders?restaurant=${encodeURIComponent(user.name)}`);
      const orders = await resOrders.json();
      const resMeals = await fetch(`${baseUrl}/api/meals`);
      const meals = await resMeals.json();
      const myMeals = meals.filter(m => m.restaurant === user.name);

      const totalRev = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const totalSold = orders.reduce((sum, o) => {
        return sum + o.items
          .filter(item => item.restaurant === user.name)
          .reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);

      const activeCount = myMeals.filter(m => m.qty > 0).length;
      const wasteCo2 = totalSold * 2.5;

      setRevenue(totalRev);
      setMealsSold(totalSold);
      setActiveDeals(activeCount);
      setWasteReduced(wasteCo2);

      // Return reasons calculation
      const reasons = {};
      myMeals.forEach(m => {
        const r = m.returnReason || "Cancellation";
        reasons[r] = (reasons[r] || 0) + 1;
      });
      setReturnReasons(reasons);

      // Popular meals
      const mealCounts = {};
      orders.forEach(o => {
        o.items.forEach(item => {
          if (item.restaurant === user.name) {
            mealCounts[item.name] = (mealCounts[item.name] || 0) + item.quantity;
          }
        });
      });
      const popular = Object.entries(mealCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setPopularMeals(popular);

    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [user]);

  const exportCSV = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Revenue", `$${revenue.toFixed(2)}`],
      ["Meals Rescued", mealsSold],
      ["Active Listings", activeDeals],
      ["CO2 Saved (kg)", wasteReduced.toFixed(1)]
    ];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Loma_Analytics_${user.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="text-left font-body animate-page-in space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Analytics & Report Center</h1>
          <p className="text-on-surface-variant text-sm mt-1">Real-time metrics tracking your commercial sustainability impact.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportCSV} 
            className="bg-secondary text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-warm flex items-center gap-1.5 hover:opacity-90"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
          <button 
            onClick={exportPDF} 
            className="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-outline-variant/35"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Print PDF
          </button>
        </div>
      </header>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-3xl animate-spin text-primary">sync</span>
          <p className="text-sm text-stone-400">Loading performance data...</p>
        </div>
      ) : (
        <>
          {/* KPI Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-warm border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary text-2xl mb-2">payments</span>
              <p className="text-on-surface-variant text-xs mb-1 font-semibold uppercase tracking-wider">Total Revenue</p>
              <h3 className="font-headline text-2xl font-bold text-on-surface">${revenue.toFixed(2)}</h3>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-warm border border-outline-variant/10">
              <span className="material-symbols-outlined text-secondary text-2xl mb-2">eco</span>
              <p className="text-on-surface-variant text-xs mb-1 font-semibold uppercase tracking-wider">Meals Rescued</p>
              <h3 className="font-headline text-2xl font-bold text-on-surface">{mealsSold}</h3>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-warm border border-outline-variant/10">
              <span className="material-symbols-outlined text-tertiary text-2xl mb-2">speed</span>
              <p className="text-on-surface-variant text-xs mb-1 font-semibold uppercase tracking-wider">Rescue Success Rate</p>
              <h3 className="font-headline text-2xl font-bold text-on-surface">{rescueRate}%</h3>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-warm border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary text-2xl mb-2">trending_up</span>
              <p className="text-on-surface-variant text-xs mb-1 font-semibold uppercase tracking-wider">Revenue Recovery %</p>
              <h3 className="font-headline text-2xl font-bold text-on-surface">{revRecovery}%</h3>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-[2rem] p-8 shadow-warm border border-outline-variant/10 flex flex-col justify-between min-h-[360px]">
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface">Weekly Revenue Simulation</h3>
                <p className="text-xs text-stone-400 mt-1 font-medium">Estimated daily rescues for this week.</p>
              </div>

              {/* simulated bars */}
              <div className="flex-grow flex items-end justify-between gap-3 h-48 relative border-b border-surface-container-highest pb-2 pt-8">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-stone-400 -ml-4 py-2 font-bold">
                  <span>$250</span>
                  <span>$125</span>
                  <span>$0</span>
                </div>

                <div className="w-full flex justify-around items-end h-full px-4 gap-2">
                  {[100, 150, 112, 200, revenue > 0 ? revenue : 238, 175, 138].map((val, idx) => {
                    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    const percent = Math.min(100, (val / 250) * 100);
                    return (
                      <div 
                        key={idx} 
                        style={{ height: `${percent}%` }}
                        className="w-full max-w-[40px] bg-primary/45 hover:bg-primary rounded-t-lg transition-all relative group cursor-pointer"
                        title={days[idx]}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ${val.toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
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

            {/* Popular meals & common reasons */}
            <div className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10 flex flex-col justify-between space-y-6">
              <div>
                <h4 className="font-headline font-bold text-base text-on-surface mb-2">Most Popular Rescues</h4>
                {popularMeals.length === 0 ? (
                  <p className="text-xs text-stone-400">Waiting for rescue orders...</p>
                ) : (
                  <div className="space-y-2">
                    {popularMeals.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-on-surface">{item.name}</span>
                        <span className="bg-secondary/15 text-secondary px-2.5 py-0.5 rounded-full text-[10px]">{item.count} sold</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-headline font-bold text-base text-on-surface mb-2">Common Return Reasons</h4>
                <div className="space-y-2">
                  {Object.entries(returnReasons).length === 0 ? (
                    <p className="text-xs text-stone-400">No data collected yet.</p>
                  ) : (
                    Object.entries(returnReasons).slice(0, 3).map(([reason, val], idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-stone-500">{reason}</span>
                        <span className="font-bold text-on-surface">{val} items</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
