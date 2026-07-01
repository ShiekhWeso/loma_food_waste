import React, { useState, useEffect } from "react";

const CATEGORIES = [
  "Pizza", "Burger", "Chicken", "Rice", "Pasta", "Seafood", "Sandwiches", 
  "Fast Food", "Grill", "Breakfast", "Desserts", "Bakery", "Drinks", 
  "Healthy Meals", "Vegetarian", "Kids Meals", "Side Dishes"
];

export default function AddMeal({ user, onAddMealSuccess, editingMeal, onCancelEdit }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Pizza");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("50");
  const [rescuePrice, setRescuePrice] = useState("");
  const [qty, setQty] = useState(5);
  
  // Controlled Expiration Date & Time
  const [expireDate, setExpireDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [expireTime, setExpireTime] = useState("22:00");

  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [returnReason, setReturnReason] = useState("Cancellation");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Populate form if editing a meal
  useEffect(() => {
    if (editingMeal) {
      setName(editingMeal.name || "");
      setCategory(editingMeal.category || "Pizza");
      setOriginalPrice(editingMeal.originalPrice ? String(editingMeal.originalPrice) : "");
      setDiscountPercent(editingMeal.discount ? String(editingMeal.discount) : "50");
      setQty(editingMeal.qty || 5);
      setImg(editingMeal.img || "");
      setDescription(editingMeal.description || "");
      setReturnReason(editingMeal.returnReason || "Cancellation");
    }
  }, [editingMeal]);

  // Pricing Logic auto calculation
  useEffect(() => {
    const orig = parseFloat(originalPrice);
    const disc = parseFloat(discountPercent);
    if (!isNaN(orig) && !isNaN(disc)) {
      const calculated = orig - (orig * (disc / 100));
      setRescuePrice(calculated.toFixed(2));
    } else {
      setRescuePrice("");
    }
  }, [originalPrice, discountPercent]);

  // Client-side Image Crop & Resize Optimization via HTML5 Canvas
  const optimizeAndSetImage = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageObj = new Image();
      imageObj.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Target standard 4:3 aspect ratio (800x600 max)
        const targetWidth = 800;
        const targetHeight = 600;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Calculate aspect ratio cover positioning (Center Crop)
        const scale = Math.max(targetWidth / imageObj.width, targetHeight / imageObj.height);
        const x = (targetWidth / 2) - (imageObj.width / 2) * scale;
        const y = (targetHeight / 2) - (imageObj.height / 2) * scale;

        ctx.drawImage(imageObj, x, y, imageObj.width * scale, imageObj.height * scale);

        // Compress to optimized WEBP / JPEG
        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setImg(optimizedDataUrl);
        setError("");
      };
      imageObj.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) optimizeAndSetImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) optimizeAndSetImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !originalPrice || !discountPercent || qty <= 0) {
      setError("Please fill out all required fields and set positive values.");
      return;
    }

    setLoading(true);

    try {
      const expiresAt = new Date(`${expireDate}T${expireTime}:00`).toISOString();
      const expiresInText = `${expireDate} at ${expireTime}`;

      const mealBody = {
        name,
        restaurant: user ? user.name : "Loma Kitchen",
        img: img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", 
        originalPrice: parseFloat(originalPrice),
        rescuePrice: parseFloat(rescuePrice),
        qty: parseInt(qty),
        category,
        expiresIn: expiresInText,
        expiresAt,
        description,
        returnReason,
        hidden: editingMeal ? editingMeal.hidden : false
      };

      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const url = editingMeal 
        ? `${baseUrl}/api/meals/${editingMeal.id}` 
        : `${baseUrl}/api/meals`;
      
      const method = editingMeal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save meal");
      }

      // Reset form
      setName("");
      setOriginalPrice("");
      setDiscountPercent("50");
      setRescuePrice("");
      setQty(5);
      setImg("");
      setDescription("");
      setReturnReason("Cancellation");

      onAddMealSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left font-body animate-page-in">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">
            {editingMeal ? "Edit Rescue Meal" : "Add Returned Meal"}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">Recover lost food value instantly by posting unsold dishes.</p>
        </div>
        {editingMeal && (
          <button 
            onClick={onCancelEdit}
            className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-xs font-bold hover:bg-outline-variant/35"
          >
            Cancel Edit
          </button>
        )}
      </header>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 border border-outline-variant/10 shadow-warm space-y-8">
        
        {/* Row 1: Restaurant & Meal Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2">
              Restaurant Name
            </label>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 text-stone-500 font-semibold text-sm shadow-sm cursor-not-allowed" 
              value={user ? user.name : "Loma Kitchen"}
              disabled
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="dishName">
              Meal Name <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-sm" 
              id="dishName" 
              placeholder="Artisan Margherita Pizza" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
            />
          </div>
        </div>

        {/* Row 2: Category & Return Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="category">
              Standard Food Category <span className="text-primary">*</span>
            </label>
            <select 
              className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-sm cursor-pointer" 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="returnReason">
              Reason for Return <span className="text-primary">*</span>
            </label>
            <select 
              className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-sm cursor-pointer" 
              id="returnReason"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
            >
              <option value="Incorrect Order">Incorrect Order</option>
              <option value="Missing Items">Missing Items</option>
              <option value="Late Delivery">Late Delivery</option>
              <option value="Cancellation">Cancellation</option>
              <option value="Wrong Ingredients">Wrong Ingredients</option>
              <option value="Cold Food Complaint">Cold Food Complaint</option>
              <option value="Wrong Delivery Address">Wrong Delivery Address</option>
            </select>
          </div>
        </div>

        {/* Row 3: Pricing & Auto Calculation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="originalPrice">
              Original Price ($) <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-sm" 
              id="originalPrice" 
              placeholder="22.00" 
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              required
              type="number"
              step="0.01"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="discountPercent">
              Discount % <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-sm" 
              id="discountPercent" 
              placeholder="50" 
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              required
              type="number"
              min="0"
              max="100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider block ml-2">
              Discounted Rescue Price ($)
            </label>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 text-secondary font-black text-sm shadow-sm cursor-not-allowed" 
              value={rescuePrice}
              disabled
              type="text"
              placeholder="Auto Calculated"
            />
          </div>
        </div>

        {/* Row 4: Qty & Controlled Expiration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="qty">
              Quantity Available <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background focus:ring-2 focus:ring-primary text-sm font-semibold shadow-sm" 
              id="qty" 
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
              type="number"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2">
              Expiration Date <span className="text-primary">*</span>
            </label>
            <input 
              type="date"
              className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background focus:ring-2 focus:ring-primary text-sm font-semibold shadow-sm cursor-pointer"
              value={expireDate}
              onChange={e => setExpireDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2">
              Expiration Time <span className="text-primary">*</span>
            </label>
            <input 
              type="time"
              className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background focus:ring-2 focus:ring-primary text-sm font-semibold shadow-sm cursor-pointer"
              value={expireTime}
              onChange={e => setExpireTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Row 5: Auto-Cropped Canvas Image Upload */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2">
            Meal Image (Auto-Cropped &amp; Centered 4:3)
          </label>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] text-center cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-outline-variant/40 bg-surface-bright hover:border-primary/60 hover:bg-surface-container-low"
            }`}
            onClick={() => document.getElementById("meal-image-input").click()}
          >
            <input
              id="meal-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {img ? (
              <div className="relative w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img
                  src={img}
                  alt="Meal preview"
                  className="max-h-[220px] rounded-xl object-cover shadow-md border border-outline-variant/20 aspect-[4/3]"
                />
                <button
                  type="button"
                  onClick={() => setImg("")}
                  className="absolute top-2 right-2 bg-error text-white p-2 rounded-full shadow-warm hover:opacity-90"
                  title="Remove Image"
                >
                  <span className="material-symbols-outlined text-sm font-bold">close</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col items-center py-4">
                <span className="material-symbols-outlined text-4xl text-primary mb-1">cloud_upload</span>
                <p className="text-sm font-bold text-on-surface">
                  Drag and drop image, or <span className="text-primary hover:underline">browse</span>
                </p>
                <p className="text-xs text-stone-400">Automatic 4:3 smart cropping &amp; compression applied</p>
              </div>
            )}
          </div>
        </div>

        {/* Row 6: Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="description">
            Short Description / Ingredients
          </label>
          <textarea 
            className="w-full bg-surface-bright border border-outline-variant/20 rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-sm resize-none h-28" 
            id="description" 
            placeholder="Describe the dish, ingredients, and any allergens." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-headline font-bold text-base shadow-warm hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          {loading ? "Saving Meal..." : editingMeal ? "Update Meal Listing" : "Post Rescue Deal"}
        </button>

      </form>
    </div>
  );
}
