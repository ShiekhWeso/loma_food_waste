import React from "react";
import Logo from "./Logo";

export default function Sidebar({ activeTab, setActiveTab, restaurantName, user, onNavigate, onLogout }) {
  // Generate initials avatar from restaurant name
  const initials = (restaurantName || "R")
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase();

  const navItems = [
    { tab: "overview",      icon: "dashboard",   label: "Overview",        group: "Main" },
    { tab: "manage-meals",  icon: "menu_book",   label: "Manage Meals",    group: "Main" },
    { tab: "live-deals",    icon: "storefront",  label: "Live Deals",      group: "Main" },
    { tab: "add-meal",      icon: "add_circle",  label: "Add New Meal",    group: "Main" },
    { tab: "analytics",     icon: "monitoring",  label: "Analytics",       group: "Analytics" },
    { tab: "history",       icon: "history",     label: "Rescue History",  group: "Analytics" },
  ];

  const groups = ["Main", "Analytics"];

  return (
    <aside className="hidden md:flex flex-col h-screen w-72 bg-[#faf7f2] sticky top-0 shrink-0 border-r border-outline-variant/15 text-left overflow-y-auto">
      
      {/* ── Logo Header ─────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-5 flex items-center justify-center">
        <Logo size="md" />
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="mx-6 border-t border-outline-variant/20" />

      {/* ── Restaurant Identity Block ────────────────────────────────── */}
      <div className="px-6 py-5 flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-warm">
          <span className="font-headline font-extrabold text-white text-lg leading-none">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-headline font-extrabold text-on-surface text-sm leading-tight truncate">
            {restaurantName || "Loma Kitchen"}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
              Verified Partner
            </span>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="mx-6 mb-4 border-t border-outline-variant/15" />

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav className="flex-1 px-4 flex flex-col gap-6">
        {groups.map(group => {
          const items = navItems.filter(n => n.group === group);
          return (
            <div key={group} className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b4039] opacity-70 ml-2 mb-2">
                {group}
              </p>
              {items.map(item => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-medium text-sm tracking-wide transition-all ${
                    activeTab === item.tab
                      ? "bg-primary text-white shadow-warm scale-[0.98] font-bold"
                      : "text-stone-600 hover:text-primary hover:bg-primary/8"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          );
        })}

        {/* Other */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b4039] opacity-70 ml-2 mb-2">
            Other
          </p>
          <button
            onClick={() => onNavigate("browse-deals")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-medium text-sm tracking-wide text-stone-600 hover:text-secondary hover:bg-secondary/8 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            <span>View Live Marketplace</span>
          </button>
        </div>
      </nav>

      {/* ── Bottom Controls ──────────────────────────────────────────── */}
      <div className="px-4 py-5 border-t border-outline-variant/15 flex flex-col gap-3">
        <button
          onClick={onLogout}
          className="w-full bg-error/10 text-error hover:bg-error hover:text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm font-bold">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
