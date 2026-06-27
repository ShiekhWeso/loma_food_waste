import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AddMeal from "./AddMeal";
import LiveDealsDashboard from "./LiveDealsDashboard";
import HistoryDashboard from "./HistoryDashboard";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default function RestaurantDashboard({ user, onNavigate, onLogout, onRefreshMeals }) {
  const [activeTab, setActiveTab] = useState("add-meal");

  const handleAddMealSuccess = (newMeal) => {
    if (onRefreshMeals) onRefreshMeals();
    // Automatically redirect to live deals dashboard tab so they can see their post
    setActiveTab("live-deals");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "add-meal":
        return <AddMeal user={user} onAddMealSuccess={handleAddMealSuccess} />;
      case "live-deals":
        return <LiveDealsDashboard user={user} onRefreshMeals={onRefreshMeals} />;
      case "history":
        return <HistoryDashboard user={user} />;
      case "analytics":
        return <AnalyticsDashboard user={user} />;
      default:
        return <AddMeal user={user} onAddMealSuccess={handleAddMealSuccess} />;
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
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
        {renderTabContent()}
      </main>
    </div>
  );
}
