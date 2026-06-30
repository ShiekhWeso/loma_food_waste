import React, { useEffect, useState } from "react";

const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? "Good morning" : HOUR < 17 ? "Good afternoon" : "Good evening";

const SHORTCUT_CARDS = [
  { icon: "storefront",  label: "Marketplace",  page: "marketplace",  color: "bg-primary/10 text-primary",   desc: "Browse rescue deals" },
  { icon: "history",     label: "My Orders",    page: "profile",      color: "bg-secondary/10 text-secondary",desc: "View past orders" },
  { icon: "contact_support", label: "Contact",  page: "contact",      color: "bg-tertiary/10 text-tertiary", desc: "Get support" },
  { icon: "info",        label: "About Lo'ma",  page: "about",        color: "bg-outline/10 text-outline",   desc: "Our mission" },
];

export default function CustomerHome({ user, meals, onNavigate, onAddToCart, addToast }) {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`http://localhost:5000/api/orders?customerId=${user.id}`);
        const orders = res.ok ? await res.json() : [];
        setRecentOrders(orders.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const liveMeals   = (meals || []).filter(m => m.qty > 0 && !m.hidden);
  const featuredMeals = [...liveMeals].sort((a, b) => b.id - a.id).slice(0, 4);
  const restaurants   = [...new Set(liveMeals.map(m => m.restaurant))].slice(0, 4);

  const handleRescue = (meal) => {
    if (!meal || meal.qty <= 0) return;
    onAddToCart(meal, 1);
    if (addToast) addToast({ type: "success", title: "Added to Cart!", message: `${meal.name} added to your rescue cart.` });
  };

  return (
    <div className="pt-20 pb-16 px-6 max-w-7xl mx-auto animate-page-in text-left font-body">

      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <section className="my-8 bg-gradient-to-r from-primary to-primary-container rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -right-6 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="relative z-10">
          <p className="text-white/70 font-body text-sm mb-1 font-semibold">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold mb-2">
            {GREETING}, {user?.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-white/80 font-body text-sm max-w-lg mb-6">
            Discover today's featured surplus meals from premier local kitchens and save up to 70%!
          </p>
          <button
            onClick={() => onNavigate("marketplace")}
            className="bg-white text-primary px-8 py-3.5 rounded-xl font-headline font-extrabold text-sm shadow-warm hover:bg-surface-container-lowest active:scale-95 transition-all flex items-center gap-2"
          >
            <span>View All Meals</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* ── Interactive How It Works Steps Replacement Section ──────────────────── */}
      <section className="mb-12">
        <div className="text-center md:text-left mb-6">
          <h2 className="text-2xl font-headline font-extrabold text-on-background">Your 3-Step Rescue Guide</h2>
          <p className="text-xs text-stone-500 mt-1 font-medium">How to make an impact, save money, and rescue gourmet food easily</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Discover Local Deals",
              desc: "Browse premium surplus meals from top-rated local kitchens near you at majorly discounted prices.",
              icon: "search",
              color: "text-primary"
            },
            {
              step: "02",
              title: "Reserve & Checkout",
              desc: "Secure your order instantly through checkout using sandbox mock payment methods with total safety.",
              icon: "shopping_cart_checkout",
              color: "text-secondary"
            },
            {
              step: "03",
              title: "Collect & Enjoy!",
              desc: "Head over to the restaurant, show your digital confirmation receipt, grab your fresh meal, and enjoy!",
              icon: "celebration",
              color: "text-tertiary"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(176,46,0,0.04)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-5xl font-black font-headline text-on-surface-variant/5">
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high/50 flex items-center justify-center mb-4">
                <span className={`material-symbols-outlined text-2xl ${item.color}`}>{item.icon}</span>
              </div>
              <h3 className="font-headline font-extrabold text-base text-on-surface mb-2">{item.title}</h3>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">

          {/* ── Featured Meals ───────────────────────────────────────────── */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-headline font-extrabold text-on-background">Featured Meals</h2>
                <p className="text-xs text-stone-500 mt-0.5 font-medium">Handpicked surplus creations available right now</p>
              </div>
              <button onClick={() => onNavigate("marketplace")} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                View All Meals <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {featuredMeals.length === 0 ? (
              <div className="bg-surface-container-low rounded-2xl p-8 text-center border border-dashed border-outline-variant/30">
                <p className="text-sm text-on-surface-variant font-medium">No active meals right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredMeals.map(meal => (
                  <MealMiniCard key={meal.id} meal={meal} onRescue={() => handleRescue(meal)} />
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => onNavigate("marketplace")}
                className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-headline font-bold text-sm transition-all"
              >
                Explore Full Marketplace →
              </button>
            </div>
          </section>

          {/* ── Recent Activity ────────────────────────────────────────── */}
          <section>
            <h2 className="text-2xl font-headline font-extrabold text-on-background mb-6">Recent Rescues</h2>
            {loading ? (
              <div className="flex gap-3 items-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin">sync</span>
                <span className="text-sm font-medium">Loading your orders...</span>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="bg-surface-container-low rounded-2xl p-8 text-center border border-dashed border-outline-variant/30">
                <span className="material-symbols-outlined text-3xl text-outline-variant mb-2 block">receipt_long</span>
                <p className="text-sm text-on-surface-variant font-medium">No orders yet. Start rescuing meals!</p>
                <button onClick={() => onNavigate("marketplace")} className="mt-3 text-primary font-bold text-sm hover:underline">View All Meals →</button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-primary mb-0.5">{order.id}</p>
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {order.items?.map(i => i.name).join(", ")}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {new Date(order.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-headline font-extrabold text-primary">${order.totalAmount?.toFixed(2)}</p>
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{order.status}</span>
                    </div>
                  </div>
                ))}
                <button onClick={() => onNavigate("profile")} className="w-full text-center text-sm font-bold text-primary hover:underline mt-2">
                  View all orders in Profile →
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Right Column ───────────────────────────────────────────────── */}
        <div className="space-y-8">
          {/* Quick Shortcuts */}
          <section>
            <h2 className="text-xl font-headline font-extrabold text-on-background mb-5">Quick Access</h2>
            <div className="grid grid-cols-2 gap-3">
              {SHORTCUT_CARDS.map(s => (
                <button
                  key={s.page}
                  onClick={() => onNavigate(s.page)}
                  className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 hover:border-primary/20 hover:shadow-[0_4px_16px_rgba(176,46,0,0.06)] transition-all text-left active:scale-[0.97]"
                >
                  <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                    <span className="material-symbols-outlined text-lg">{s.icon}</span>
                  </div>
                  <p className="font-headline font-bold text-sm text-on-surface">{s.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Featured Kitchens */}
          {restaurants.length > 0 && (
            <section>
              <h2 className="text-xl font-headline font-extrabold text-on-background mb-5">Featured Kitchens</h2>
              <div className="space-y-3">
                {restaurants.map(r => {
                  const rMeals = liveMeals.filter(m => m.restaurant === r);
                  return (
                    <button
                      key={r}
                      onClick={() => onNavigate("marketplace")}
                      className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 hover:border-primary/20 text-left flex items-center gap-3 transition-all active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-headline font-bold text-lg shrink-0">
                        {r.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-headline font-bold text-sm text-on-surface truncate">{r}</p>
                        <p className="text-xs text-secondary font-semibold">{rMeals.length} rescue deals</p>
                      </div>
                      <span className="material-symbols-outlined text-outline text-base">chevron_right</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mini Meal Card ────────────────────────────────────────────────────────────
function MealMiniCard({ meal, onRescue }) {
  const discount = meal.discount || Math.round(((meal.originalPrice - meal.rescuePrice) / meal.originalPrice) * 100);
  return (
    <div className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(176,46,0,0.08)] hover:border-primary/20 flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/10] bg-surface-dim overflow-hidden">
          <img src={meal.img} alt={meal.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow">
            -{discount}%
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-headline font-extrabold text-base text-on-surface truncate mb-1 group-hover:text-primary transition-colors">{meal.name}</h4>
          <p className="text-xs text-secondary font-bold mb-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">storefront</span>
            {meal.restaurant}
          </p>
        </div>
      </div>
      <div className="px-4 pb-4 flex items-center justify-between border-t border-outline-variant/10 pt-3">
        <div className="flex items-baseline gap-2">
          <span className="font-headline font-extrabold text-xl text-primary">${meal.rescuePrice.toFixed(2)}</span>
          <span className="text-xs text-stone-400 line-through font-medium">${meal.originalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onRescue(); }}
          disabled={meal.qty <= 0}
          className="bg-primary text-white hover:bg-primary-container px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-warm active:scale-95"
        >
          Rescue
        </button>
      </div>
    </div>
  );
}
