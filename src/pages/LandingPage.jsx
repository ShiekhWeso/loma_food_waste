import React, { useEffect, useRef, useState } from "react";

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCounterAnimation(target, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const end = typeof target === "number" ? target : parseFloat(target);
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // ease-out-quart
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return count;
}

// ── Metric Card ───────────────────────────────────────────────────────────────
function MetricCard({ icon, iconColor, value, suffix, label, delay, started }) {
  const count = useCounterAnimation(value, 2000, started);
  return (
    <div
      className="animate-count-in bg-surface-container-lowest p-8 rounded-[2rem] text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/10 hover:shadow-[0_8px_32px_rgba(176,46,0,0.06)] transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <span className={`material-symbols-outlined text-4xl mb-4 fill ${iconColor}`}>{icon}</span>
      <div className="text-4xl font-extrabold text-on-background mb-2 font-headline">
        {typeof suffix === "string" && suffix.startsWith("$")
          ? `$${count.toLocaleString()}${suffix.replace("$", "")}`
          : `${count.toLocaleString()}${suffix || ""}`
        }
      </div>
      <div className="text-on-surface-variant font-medium text-sm">{label}</div>
    </div>
  );
}

const METRICS = [
  { icon: "eco",       iconColor: "text-secondary",  value: 14200,  suffix: "+",      label: "Meals Rescued"           },
  { icon: "storefront",iconColor: "text-tertiary",   value: 87,     suffix: "+",      label: "Restaurants Joined"      },
  { icon: "savings",   iconColor: "text-tertiary",   value: 84000,  suffix: "$+",     label: "Money Saved"             },
  { icon: "compost",   iconColor: "text-secondary",  value: 5,      suffix: ".2 T",   label: "Food Waste Prevented"    },
  { icon: "co2",       iconColor: "text-primary",    value: 35,     suffix: ".4 T",   label: "CO₂ Reduction"           },
  { icon: "volunteer_activism", iconColor: "text-secondary", value: 2800, suffix: "+", label: "Rescue Orders"          },
];

const FEATURED_DEALS = [
  {
    id: 220,
    name: "Artisan Margherita Pizza",
    restaurant: "The Conscious Kitchen",
    distance: "0.4 mi",
    originalPrice: 16.50,
    rescuePrice: 6.00,
    expiresIn: "2 hrs",
    qty: 5,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 237,
    name: "Gourmet Truffle Burger",
    restaurant: "Green Sprout Cafe",
    distance: "1.2 mi",
    originalPrice: 18.00,
    rescuePrice: 7.50,
    expiresIn: "1 hr",
    qty: 3,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 254,
    name: "Creamy Fettuccine Alfredo",
    restaurant: "L'Artisan Boulangerie",
    distance: "0.8 mi",
    originalPrice: 20.00,
    rescuePrice: 8.00,
    expiresIn: "3 hrs",
    qty: 4,
    img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 271,
    name: "Crispy Grilled Chicken Bowl",
    restaurant: "The Fresh Table",
    distance: "2.5 mi",
    originalPrice: 22.00,
    rescuePrice: 9.00,
    expiresIn: "4 hrs",
    qty: 6,
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
  }
];

export default function LandingPage({ onNavigate, onSelectMeal, meals = [] }) {
  const impactRef   = useRef(null);
  const [started, setStarted] = useState(false);

  const liveMeals = (meals || []).filter(m => m.qty > 0 && !m.hidden);
  const displayMeals = liveMeals.length > 0 ? liveMeals.slice(0, 4) : FEATURED_DEALS;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.25 }
    );
    if (impactRef.current) observer.observe(impactRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-16 animate-page-in">

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative px-6 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 z-10 text-left">
          <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-sm font-bold mb-6">
            Join the circular food revolution
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-background leading-[1.1] mb-8 font-headline">
            Save <span className="text-primary italic">Food</span>,<br />
            Save Money, Save the <span className="text-secondary">Planet</span>.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed font-body">
            Connecting surplus artisan meals with conscious diners. High-end culinary experiences at impossible prices, served with a side of environmental impact.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate("browse-deals")}
              className="bg-gradient-to-r from-primary to-primary-container text-white px-10 py-4 rounded-xl text-lg font-bold shadow-warm hover:opacity-90 transition-opacity active:scale-95 duration-150"
            >
              Browse Live Deals
            </button>
            <button
              onClick={() => onNavigate("signup-choose")}
              className="bg-surface-container-highest text-on-secondary-container px-10 py-4 rounded-xl text-lg font-bold hover:bg-outline-variant/35 active:scale-95 duration-150"
            >
              Partner with Us
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="lg:col-span-5 relative">
          <div className="hero-image-wrapper relative w-full aspect-square rounded-[3rem] overflow-hidden rotate-3 shadow-2xl border border-outline-variant/10 cursor-pointer">
            <img
              alt="Gourmet surplus food"
              className="w-full h-full object-cover transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr10C-q-bWwjvAm_0LX8OU5HCDl2UsL6v5VHjsGn-mLkX1-M42jH9wy-pdFnc_R7Ft7CfWURCsH9nF2PfgK8r3ZK2UVhy2pl9WDujDhobljAjdwD0lg0mlGUx0_lA3-RGzz4fIQ5wPLdA0KgF659L3sr5Lj9Lqx80jgeSb45XDD30WE6gRHDMEhHCmb4JlXwZD0fsgQCk7o2UlCfhtCBd5JQRvezZ8eQ17F91gLYyh9coQkmEkarO_d-QAOwqLsjRXmitcof3JckU"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white/80 p-6 rounded-2xl shadow-warm max-w-[240px] border border-outline-variant/10 backdrop-blur-md text-left">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="font-bold text-primary text-sm">Live Now</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Artisan Bakery Surplus: Fresh Sourdough &amp; Pastries available in 15 mins.
            </p>
          </div>
        </div>
      </section>

      {/* ── Impact Counter ─────────────────────────────────────────────── */}
      <section id="impact" ref={impactRef} className="bg-surface-container-low py-20 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold font-headline text-on-background mb-3">
              Our Collective Impact
            </h2>
            <p className="text-on-surface-variant font-medium max-w-xl mx-auto">
              Every rescue order counts. Together we're building a circular food economy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {METRICS.map((m, i) => (
              <MetricCard key={i} {...m} delay={i * 80} started={started} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works: Bento Grid ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <h2 className="text-4xl font-extrabold text-center mb-16 font-headline">The Circle of Value</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* User Path */}
          <div className="md:col-span-7 bg-surface-container-highest p-12 rounded-[2.5rem] relative overflow-hidden min-h-[400px] text-left">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8 text-on-secondary-container">For the Diner</h3>
              <div className="space-y-8">
                {[
                  { num: "01", title: "Browse", desc: "Discover high-end restaurant surplus nearby." },
                  { num: "02", title: "Order",  desc: "Secure your meal through our glass-clean app." },
                  { num: "03", title: "Save",   desc: "Pick up, enjoy, and reduce food waste." },
                ].map(s => (
                  <div key={s.num} className="flex items-start gap-5">
                    <div className="bg-white p-3 rounded-xl font-black text-secondary flex items-center justify-center w-10 h-10 shrink-0">
                      {s.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-on-surface">{s.title}</h4>
                      <p className="text-on-surface-variant text-sm mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <img
                alt="Gourmet Bowl"
                className="w-full h-full object-cover object-left"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWlSU1wybV0CAfRLI570rmUnDDGMobfKFUVp768iN1X9fkjSSqGorKN96U02Zqh5bM1rE4lFQqPSa_JfZyrjt5-acf7yuab6jVgD6JSQi2OdR1DEiBa3pOhm7hg4ye2_CFkcyoGtFdWRHWPKQtPN8g3iBO4lVA-yJW-8y0WbvXSaaHa6jmF7vSWUS4nioSWg2zgvHwY8yxdXyLU3uMX5ojuVmHQOuKoFxK6pq7MqFCATgBTvp6SuFsB47peyzHh0JYoy7-F-wPCBM"
              />
            </div>
          </div>

          {/* Restaurant Path */}
          <div className="md:col-span-5 bg-tertiary-fixed p-12 rounded-[2.5rem] flex flex-col justify-between text-left">
            <div>
              <h3 className="text-2xl font-bold mb-8 text-on-tertiary-fixed-variant">For the Kitchen</h3>
              <div className="space-y-6">
                {[
                  { icon: "cancel",     text: "Canceled Orders" },
                  { icon: "add_circle", text: "Instant Post" },
                  { icon: "trending_up",text: "Recover Revenue" },
                ].map(item => (
                  <div key={item.icon} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-tertiary text-2xl">{item.icon}</span>
                    <span className="font-bold text-on-surface text-base">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={() => onNavigate("signup-choose")}
                className="w-full bg-tertiary hover:bg-tertiary-container text-white py-4 rounded-xl font-bold active:scale-[0.98] transition-all shadow-md"
              >
                Start Selling
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Live Deals ────────────────────────────────────────── */}
      <section className="py-24 bg-surface px-6 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div className="text-left">
              <h2 className="text-4xl font-extrabold mb-4 font-headline">Live Opportunities</h2>
              <p className="text-on-surface-variant font-medium">Fresh, delicious, and waiting for a home.</p>
            </div>
            <button
              onClick={() => onNavigate("browse-deals")}
              className="text-primary font-bold flex items-center gap-2 hover:underline text-sm"
            >
              View All <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayMeals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => onSelectMeal(deal)}
                className="group cursor-pointer text-left"
              >
                <div className="relative rounded-3xl overflow-hidden mb-6 aspect-square bg-surface-dim">
                  <img
                    alt={deal.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={deal.img}
                  />
                  <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {deal.expiresIn || `${deal.qty} left`}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-1 text-on-surface truncate font-headline">{deal.name}</h4>
                <p className="text-xs text-on-surface-variant mb-3 font-semibold">
                  {deal.restaurant} • <span className="text-stone-400">{deal.distance}</span>
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">${deal.rescuePrice.toFixed(2)}</span>
                  <span className="text-sm text-on-surface-variant line-through font-medium">${deal.originalPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
