import React from "react";

export default function Sidebar({ activeTab, setActiveTab, restaurantName, onNavigate, onLogout }) {
  return (
    <aside className="hidden md:flex flex-col h-screen w-72 bg-[#f0f6e8] sticky top-0 p-6 shadow-[32px_0_32px_rgba(176,46,0,0.02)] shrink-0">
      
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-headline font-bold text-xl">
          L
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#ac2d00] font-headline">Lo'ma</h1>
          <p className="text-xs font-medium text-stone-500 tracking-wide font-body">Kitchen Dashboard</p>
        </div>
      </div>

      {/* Partner Info */}
      <div className="flex items-center gap-4 mb-8 bg-surface-container-high/50 p-3 rounded-xl">
        <img 
          alt="Restaurant Profile" 
          className="w-12 h-12 rounded-full object-cover border-2 border-primary" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkMfj5z1wEYwW5_m_rokSEpcNjuWOg9UaU8-U4Zb_tHQ1zQ1qIey1WsdymjzuRTl2pfvBa4_JAhUHuXHMs--Tg2psjDUvBnMPivJjRzHILZi0GywkR_455UVhcSCqOhYX13wImdh-hjiS3fGwDPbBf0EXXR04nfWst9w4xYEY3RYTByWlAE1L8gotA3z3MXGZvVxaC9brJ1tvgMeHOkJ-0DeNd-tJ95NkkpXKe0hq3hGcyeRu3wh8simlcOyX6vG9ayoD99oxFuuE"
        />
        <div className="overflow-hidden">
          <p className="font-headline font-bold text-on-surface text-sm truncate">{restaurantName || "The Conscious Kitchen"}</p>
          <p className="font-body text-secondary text-xs font-semibold">Gold Tier Partner</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {/* Add Meal */}
        <button 
          onClick={() => setActiveTab("add-meal")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-medium text-sm tracking-wide transition-all ${
            activeTab === "add-meal" 
              ? "bg-[#ac2d00] text-white shadow-warm scale-[0.98] font-bold" 
              : "text-stone-600 hover:text-[#ac2d00] hover:bg-[#dfe5d7]"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Add Meal</span>
        </button>

        {/* Live Deals */}
        <button 
          onClick={() => setActiveTab("live-deals")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-medium text-sm tracking-wide transition-all ${
            activeTab === "live-deals" 
              ? "bg-[#ac2d00] text-white shadow-warm scale-[0.98] font-bold" 
              : "text-stone-600 hover:text-[#ac2d00] hover:bg-[#dfe5d7]"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          <span>Live Deals</span>
        </button>

        {/* History */}
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-medium text-sm tracking-wide transition-all ${
            activeTab === "history" 
              ? "bg-[#ac2d00] text-white shadow-warm scale-[0.98] font-bold" 
              : "text-stone-600 hover:text-[#ac2d00] hover:bg-[#dfe5d7]"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">history</span>
          <span>History</span>
        </button>

        {/* Analytics */}
        <button 
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-medium text-sm tracking-wide transition-all ${
            activeTab === "analytics" 
              ? "bg-[#ac2d00] text-white shadow-warm scale-[0.98] font-bold" 
              : "text-stone-600 hover:text-[#ac2d00] hover:bg-[#dfe5d7]"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">monitoring</span>
          <span>Analytics</span>
        </button>
      </nav>

      {/* Bottom Controls */}
      <div className="mt-auto pt-6 border-t border-outline-variant/20 flex flex-col gap-3">
        <button 
          onClick={() => onNavigate("browse-deals")}
          className="w-full bg-secondary text-white py-3 rounded-xl font-bold text-sm shadow-warm hover:opacity-90 transition-opacity"
        >
          View Storefront
        </button>
        <button 
          onClick={onLogout}
          className="w-full bg-outline-variant/30 text-on-surface-variant py-3 rounded-xl font-bold text-sm hover:bg-outline-variant/50 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
