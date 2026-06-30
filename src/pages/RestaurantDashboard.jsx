import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AddMeal from "./AddMeal";
import AnalyticsDashboard from "./AnalyticsDashboard";
import OverviewDashboard from "./OverviewDashboard";
import ManageMeals from "./ManageMeals";
import HistoryDashboard from "./HistoryDashboard";
import LiveDealsDashboard from "./LiveDealsDashboard";

export default function RestaurantDashboard({ user, onNavigate, onLogout, onRefreshMeals }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingMeal, setEditingMeal] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearResult, setClearResult] = useState(null); // { deleted, error }

  const handleAddMealSuccess = () => {
    if (onRefreshMeals) onRefreshMeals();
    setEditingMeal(null);
    setActiveTab("manage-meals");
  };

  const handleSelectMealForEdit = (meal) => {
    setEditingMeal(meal);
    setActiveTab("add-meal");
  };

  const handleCancelEdit = () => {
    setEditingMeal(null);
    setActiveTab("manage-meals");
  };

  // ── Clear All: deletes every meal belonging to this restaurant ───────────────
  const handleClearAll = async () => {
    if (!user?.name) return;
    setClearing(true);
    setClearResult(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/meals/restaurant/${encodeURIComponent(user.name)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        setClearResult({ deleted: data.deleted });
        if (onRefreshMeals) onRefreshMeals();
      } else {
        setClearResult({ error: data.message || "Failed to clear meals" });
      }
    } catch (err) {
      setClearResult({ error: "Server error — please try again." });
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewDashboard user={user} onRefreshMeals={onRefreshMeals} setActiveTab={setActiveTab} />;
      case "add-meal":
        return (
          <AddMeal
            user={user}
            onAddMealSuccess={handleAddMealSuccess}
            editingMeal={editingMeal}
            onCancelEdit={handleCancelEdit}
          />
        );
      case "manage-meals":
        return (
          <ManageMeals
            user={user}
            onRefreshMeals={onRefreshMeals}
            onSelectMealForEdit={handleSelectMealForEdit}
          />
        );
      case "analytics":
        return <AnalyticsDashboard user={user} />;
      case "history":
        return <HistoryDashboard user={user} />;
      case "live-deals":
        return <LiveDealsDashboard user={user} onRefreshMeals={onRefreshMeals} />;
      default:
        return <OverviewDashboard user={user} onRefreshMeals={onRefreshMeals} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-on-background w-full">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        restaurantName={user ? user.name : ""}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Panel Canvas */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">

        {/* ── Success / Error Toast after Clear All ────────────────────── */}
        {clearResult && (
          <div
            className={`mb-4 px-5 py-3 rounded-xl flex items-center gap-3 font-semibold text-sm animate-page-in border ${
              clearResult.error
                ? "bg-error-container text-error border-error/20"
                : "bg-secondary/10 text-secondary border-secondary/20"
            }`}
          >
            <span className="material-symbols-outlined text-base fill">
              {clearResult.error ? "error" : "check_circle"}
            </span>
            <span>
              {clearResult.error
                ? clearResult.error
                : `Successfully deleted ${clearResult.deleted} meal${clearResult.deleted !== 1 ? "s" : ""} from your menu.`}
            </span>
            <button
              onClick={() => setClearResult(null)}
              className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="flex justify-between items-center mb-8 border-b border-outline-variant/15 pb-4">
          <div className="text-left">
            <h2 className="text-2xl font-headline font-black text-on-surface">
              {activeTab === "overview"     && "Dashboard Overview"}
              {activeTab === "add-meal"     && (editingMeal ? "Edit Menu Listing" : "Add New Dish")}
              {activeTab === "manage-meals"  && "Menu Management"}
              {activeTab === "analytics"     && "Restaurant Analytics"}
              {activeTab === "history"       && "Rescue Order History"}
              {activeTab === "live-deals"    && "Live Active Listings"}
            </h2>
            <p className="text-xs text-stone-400 font-semibold mt-1">Welcome back, {user ? user.name : "Partner"}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Clear All — deletes all meals for this restaurant */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-error/10 hover:bg-error hover:text-white text-error rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Clear All
            </button>
            <button
              onClick={() => { setEditingMeal(null); setActiveTab("add-meal"); }}
              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-warm hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Meal
            </button>
          </div>
        </div>

        {renderTabContent()}
      </main>

      {/* ── Clear All Confirmation Modal ─────────────────────────────────── */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-page-in">
          <div className="bg-surface-container-lowest rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] border border-outline-variant/10 max-w-sm w-full p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-3xl text-error fill">delete_sweep</span>
            </div>

            <h3 className="text-xl font-headline font-extrabold text-on-surface mb-2">
              Clear All Meals?
            </h3>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-6">
              This will permanently delete <span className="font-bold text-error">all meals</span> from your
              menu on the marketplace. This action <span className="font-bold">cannot be undone</span>.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={clearing}
                className="flex-1 py-3 rounded-xl border border-outline-variant/30 font-bold text-sm text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {clearing ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    Clearing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">delete_forever</span>
                    Yes, Delete All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
