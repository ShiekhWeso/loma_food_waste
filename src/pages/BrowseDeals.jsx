import React, { useState, useEffect } from "react";

export default function BrowseDeals({ 
  onSelectMeal, 
  onAddToCart, 
  meals: propMeals,
  locationAddress = "Cairo, Maadi",
  locationCoords,
  onOpenLocationPicker
}) {
  const [meals, setMeals] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("discount"); // discount, price, distance
  const [distance, setDistance] = useState("all"); // 0.5, 1.0, 3.0, all
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Always fetch fresh meals on mount & when coordinates change
  useEffect(() => {
    fetchMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationCoords]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const queryParams = locationCoords && locationCoords.lat && locationCoords.lng
        ? `?lat=${locationCoords.lat}&lng=${locationCoords.lng}`
        : "";
      const res = await fetch(`http://localhost:5000/api/meals${queryParams}`);
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      console.error("Error loading meals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse distance string (e.g. "0.4 mi" -> 0.4)
  const parseDistance = (distStr) => {
    if (!distStr) return 0;
    return parseFloat(distStr.replace(" mi", ""));
  };

  // Filter & Sort meals
  const filteredMeals = meals
    .filter(meal => {
      // 1. Search Query
      if (search && !meal.name.toLowerCase().includes(search.toLowerCase()) && !meal.restaurant.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // 2. Category
      if (category !== "All" && meal.category !== category) {
        return false;
      }
      // 3. Distance
      if (distance !== "all") {
        const dVal = parseDistance(meal.distance);
        if (dVal > parseFloat(distance)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "discount") {
        return b.discount - a.discount;
      }
      if (sort === "price") {
        return a.rescuePrice - b.rescuePrice;
      }
      if (sort === "distance") {
        return parseDistance(a.distance) - parseDistance(b.distance);
      }
      return 0;
    });

  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto font-body">
      
      {/* Location Header Section */}
      <header className="mb-10 bg-surface-container-low p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-outline-variant/10 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">near_me</span>
            <span>Current Location</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight font-headline">{locationAddress}</h1>
          <p className="text-on-surface-variant text-xs font-medium">
            Showing {filteredMeals.length} conscious meals available for rescue near you.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={onOpenLocationPicker}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-highest rounded-xl text-on-surface font-semibold text-xs hover:bg-outline-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">map</span>
            <span>View Map</span>
          </button>
          <button 
            onClick={onOpenLocationPicker}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs shadow-warm transition-transform active:scale-95 hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-base">edit_location</span>
            <span>Change</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Filter Aside + Meals list */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 space-y-8 shrink-0 text-left">
          
          {/* Search Box */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
            <input 
              className="w-full pl-11 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none placeholder-stone-400" 
              placeholder="Search dishes or kitchens..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
            />
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Sort By</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Highest Discount", value: "discount" },
                { label: "Lowest Price", value: "price" },
                { label: "Distance", value: "distance" }
              ].map((opt) => (
                <label 
                  key={opt.value} 
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors text-xs font-semibold ${
                    sort === opt.value ? "bg-surface-container-high/60" : ""
                  }`}
                >
                  <input 
                    name="sort" 
                    type="radio" 
                    checked={sort === opt.value}
                    onChange={() => setSort(opt.value)}
                    className="w-4 h-4 text-primary border-outline focus:ring-primary"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Categories</h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              {["All", "Bowls", "Mains", "Desserts", "Sharing"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                    category === cat 
                      ? "bg-primary text-white font-black shadow-warm scale-[0.98]" 
                      : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Distance</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "All Distances", value: "all" },
                { label: "Within 0.5 mi", value: "0.5" },
                { label: "Within 1.5 mi", value: "1.5" },
                { label: "Within 3.0 mi", value: "3.0" }
              ].map((opt) => (
                <label 
                  key={opt.value} 
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors text-xs font-semibold ${
                    distance === opt.value ? "bg-surface-container-high/60" : ""
                  }`}
                >
                  <input 
                    name="distance" 
                    type="radio" 
                    checked={distance === opt.value}
                    onChange={() => setDistance(opt.value)}
                    className="w-4 h-4 text-primary border-outline focus:ring-primary"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* Meals Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-on-surface-variant font-semibold">
              <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
              <p>Gathering fresh rescue opportunities...</p>
            </div>
          ) : filteredMeals.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-outline-variant rounded-[2rem]">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">eco</span>
              <p className="font-bold text-lg text-on-surface mb-2">No Rescue Deals Found</p>
              <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
                We couldn't find any meals matching your current filters. Try resetting search fields or sorting differently!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredMeals.map((meal) => (
                <div 
                  key={meal.id} 
                  className="group bg-surface-container-lowest p-4 rounded-[2rem] border border-outline-variant/10 shadow-[0_8px_32px_rgba(176,46,0,0.02)] transition-all hover:shadow-[0_12px_32px_rgba(176,46,0,0.06)] hover:border-primary/10 cursor-pointer flex flex-col justify-between"
                  onClick={() => onSelectMeal(meal)}
                >
                  <div>
                    {/* Visual Card */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-5 bg-surface-dim">
                      <img 
                        src={meal.img} 
                        alt={meal.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Floating overlay chip */}
                      <div className="absolute top-4 left-4">
                        <span 
                          style={{ color: meal.statusColor, backgroundColor: meal.statusBg }}
                          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                        >
                          {meal.qty <= 0 ? "Sold Out" : meal.status}
                        </span>
                      </div>

                      {/* Carbon footprint savings ribbon */}
                      <div className="absolute bottom-4 right-4 bg-secondary/85 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm shadow-sm">
                        <span className="material-symbols-outlined text-xs">eco</span>
                        <span>CO2 Rescue</span>
                      </div>
                    </div>

                    {/* Metadata details */}
                    <h3 className="font-headline font-bold text-lg text-on-surface mb-1 group-hover:text-primary transition-colors leading-snug truncate">
                      {meal.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-4 font-semibold">
                      {meal.restaurant} • <span className="text-stone-400">{meal.distance}</span>
                    </p>
                  </div>

                  {/* Actions & Pricing */}
                  <div className="flex justify-between items-center border-t border-outline-variant/10 pt-3 mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-headline font-extrabold text-primary">
                        ${meal.rescuePrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-stone-400 line-through font-medium">
                        ${meal.originalPrice.toFixed(2)}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (meal.qty > 0) {
                          onAddToCart(meal, 1);
                        }
                      }}
                      disabled={meal.qty <= 0}
                      className="bg-surface-container-high hover:bg-primary hover:text-white text-primary px-3 py-2 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-1 active:scale-95 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">add</span>
                      <span>Rescue</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
