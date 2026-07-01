import React, { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  "All", "Pizza", "Burger", "Chicken", "Rice", "Pasta", "Seafood", "Sandwiches", 
  "Fast Food", "Grill", "Breakfast", "Desserts", "Bakery", "Drinks", 
  "Healthy Meals", "Vegetarian", "Kids Meals", "Side Dishes"
];

export default function BrowseDeals({
  onSelectMeal,
  onAddToCart,
  meals: propMeals,
  locationAddress = "Cairo, Maadi",
  locationCoords,
  onOpenLocationPicker,
  isAuthenticated = false,
  addToast
}) {
  const [meals, setMeals]       = useState([]);
  const [sort, setSort]         = useState("discount");
  const [distance, setDistance] = useState("all");
  const [category, setCategory] = useState("All");
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [rescuedId, setRescuedId] = useState(null);
  const pollingRef = useRef(null);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const queryParams = locationCoords?.lat && locationCoords?.lng
        ? `?lat=${locationCoords.lat}&lng=${locationCoords.lng}`
        : "";
      const res  = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/meals${queryParams}`);
      const data = await res.json();
      // Filter out hidden and expired meals
      const visibleMeals = data.filter(m => !m.hidden && m.qty > 0);
      setMeals(visibleMeals);
    } catch (err) {
      console.error("Error loading meals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
    pollingRef.current = setInterval(fetchMeals, 30000);
    return () => clearInterval(pollingRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationCoords]);

  const parseDistance = (distStr) => {
    if (!distStr) return 999;
    return parseFloat(distStr.replace(" mi", "")) || 999;
  };

  const filteredMeals = meals
    .filter(meal => {
      if (search && !meal.name.toLowerCase().includes(search.toLowerCase()) &&
          !meal.restaurant.toLowerCase().includes(search.toLowerCase())) return false;
      
      if (category !== "All" && meal.category !== category) return false;

      if (distance !== "all") {
        const dVal = parseDistance(meal.distance);
        if (dVal > parseFloat(distance)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "discount") return b.discount - a.discount;
      if (sort === "price")    return a.rescuePrice - b.rescuePrice;
      if (sort === "distance") return parseDistance(a.distance) - parseDistance(b.distance);
      if (sort === "newest")   return b.id - a.id;
      if (sort === "value")    return (b.originalPrice - b.rescuePrice) - (a.originalPrice - a.rescuePrice);
      return 0;
    });

  const handleRescue = (e, meal) => {
    e.stopPropagation();
    if (meal.qty <= 0) return;
    onAddToCart(meal, 1);
    setRescuedId(meal.id);
    setTimeout(() => setRescuedId(null), 500);
    if (addToast) {
      addToast({
        type: "success",
        title: "Added to Cart!",
        message: `${meal.name} was added to your rescue cart.`
      });
    }
  };

  const pageTitle = isAuthenticated ? "Marketplace" : locationAddress;
  const pageSubtitle = isAuthenticated
    ? `${filteredMeals.length} meals available for rescue`
    : `Showing ${filteredMeals.length} conscious meals available for rescue near you.`;

  return (
    <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto font-body animate-page-in">

      {/* Location / Marketplace Header */}
      <header className="mb-10 bg-surface-container-low p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-outline-variant/10 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">
              {isAuthenticated ? "storefront" : "near_me"}
            </span>
            <span>{isAuthenticated ? "Lo'ma Marketplace" : "Current Location"}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight font-headline">
            {pageTitle}
          </h1>
          <p className="text-on-surface-variant text-xs font-medium">{pageSubtitle}</p>
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

      {/* Main Grid with Independent Scrolling Sidebar */}
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Filter Sidebar (Independent Sticky Scroll) */}
        <aside className="w-full md:w-64 md:sticky md:top-28 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto pr-2 space-y-8 shrink-0 text-left custom-scrollbar">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
            <input
              className="w-full pl-11 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all outline-none placeholder-stone-400 shadow-sm"
              placeholder="Search dishes or kitchens..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
            />
          </div>

          {/* Food Categories */}
          <div>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Categories</h3>
            <div className="flex flex-wrap md:flex-col gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
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

          {/* Sort By Options */}
          <div>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Sort By</h3>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Highest Discount", value: "discount" },
                { label: "Lowest Price",     value: "price" },
                { label: "Distance",         value: "distance" },
                { label: "Newest Listings",  value: "newest" },
                { label: "Best Value",       value: "value" }
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors text-xs font-semibold ${sort === opt.value ? "bg-surface-container-high/60" : ""}`}
                >
                  <input
                    name="sort" type="radio"
                    checked={sort === opt.value}
                    onChange={() => setSort(opt.value)}
                    className="w-4 h-4 text-primary border-outline focus:ring-primary"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Distance Option */}
          <div>
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Distance</h3>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "All Distances",  value: "all" },
                { label: "Within 0.5 mi", value: "0.5" },
                { label: "Within 1.5 mi", value: "1.5" },
                { label: "Within 3.0 mi", value: "3.0" },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors text-xs font-semibold ${distance === opt.value ? "bg-surface-container-high/60" : ""}`}
                >
                  <input
                    name="distance" type="radio"
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

        {/* Meals Grid (Scrolls Independently) */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-surface-container-lowest p-4 rounded-[2rem] border border-outline-variant/10">
                  <div className="skeleton w-full aspect-[4/3] rounded-2xl mb-5" />
                  <div className="skeleton h-5 w-3/4 mb-2" />
                  <div className="skeleton h-3 w-1/2 mb-4" />
                  <div className="skeleton h-8 w-full rounded-xl" />
                </div>
              ))}
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
              {filteredMeals.map(meal => {
                const discountPct = meal.discount || Math.round(((meal.originalPrice - meal.rescuePrice) / meal.originalPrice) * 100);
                return (
                  <div
                    key={meal.id}
                    className="group bg-surface-container-lowest p-5 rounded-[2rem] border border-outline-variant/10 shadow-[0_8px_32px_rgba(176,46,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(176,46,0,0.08)] hover:border-primary/20 cursor-pointer flex flex-col justify-between"
                    onClick={() => onSelectMeal(meal)}
                  >
                    <div>
                      {/* Large Meal Image */}
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 bg-surface-dim">
                        <img
                          src={meal.img}
                          alt={meal.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Status badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            style={{ color: meal.statusColor, backgroundColor: meal.statusBg }}
                            className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md"
                          >
                            {meal.qty <= 0 ? "Sold Out" : meal.status || "Active"}
                          </span>
                        </div>
                        {/* Discount badge */}
                        <div className="absolute top-3 right-3 bg-primary text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-md">
                          -{discountPct}%
                        </div>
                      </div>

                      {/* Meal Name (Bold & Prominent) */}
                      <h3 className="font-headline font-extrabold text-xl text-on-surface mb-2 group-hover:text-primary transition-colors leading-snug truncate">
                        {meal.name}
                      </h3>

                      {/* Vertical Information Stack */}
                      <div className="space-y-1.5 mb-4 text-xs font-semibold text-on-surface-variant">
                        {/* Restaurant Name */}
                        <div className="flex items-center gap-1.5 text-secondary font-bold">
                          <span className="material-symbols-outlined text-base">storefront</span>
                          <span className="truncate">{meal.restaurant}</span>
                        </div>

                        {/* Reason for Return */}
                        <div className="flex items-center gap-1.5 text-stone-500">
                          <span className="material-symbols-outlined text-base text-primary/70">info</span>
                          <span>Reason: <strong className="text-on-surface">{meal.returnReason || "Cancellation"}</strong></span>
                        </div>

                        {/* Expiration Time */}
                        <div className="flex items-center gap-1.5 text-stone-500">
                          <span className="material-symbols-outlined text-base text-tertiary">schedule</span>
                          <span>Expires in: <strong className="text-on-surface">{meal.expiresIn || "2 hrs"}</strong></span>
                        </div>

                        {/* Availability & Distance */}
                        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">inventory_2</span>
                            <span>{meal.qty} available</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">near_me</span>
                            <span>{meal.distance || "0.8 mi"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions & Pricing */}
                    <div className="flex justify-between items-center border-t border-outline-variant/10 pt-3.5 mt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-headline font-extrabold text-primary">
                          ${meal.rescuePrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-stone-400 line-through font-medium">
                          ${meal.originalPrice.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={e => handleRescue(e, meal)}
                        disabled={meal.qty <= 0}
                        className={`
                          bg-primary text-white hover:bg-primary-container
                          px-4 py-2.5 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-1.5 shadow-warm
                          active:scale-95 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed
                          ${rescuedId === meal.id ? "rescue-pop" : ""}
                        `}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">add_shopping_cart</span>
                        <span>Rescue</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
