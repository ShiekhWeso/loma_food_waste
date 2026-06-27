import React, { useState } from "react";

export default function AddMeal({ user, onAddMealSuccess }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Bowls");
  const [originalPrice, setOriginalPrice] = useState("");
  const [rescuePrice, setRescuePrice] = useState("");
  const [qty, setQty] = useState(5);
  const [expiresIn, setExpiresIn] = useState("2 hrs");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, JPEG, or WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImg(event.target.result);
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const removeImage = () => {
    setImg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !originalPrice || !rescuePrice || qty <= 0) {
      setError("Please fill out all required fields and set positive values.");
      return;
    }

    setLoading(true);

    try {
      const mealBody = {
        name,
        restaurant: user ? user.name : "The Conscious Kitchen",
        img: img || undefined, // will fall back to server default if blank
        originalPrice: parseFloat(originalPrice),
        rescuePrice: parseFloat(rescuePrice),
        qty: parseInt(qty),
        category,
        expiresIn,
        description
      };

      const response = await fetch("http://localhost:5000/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create meal");
      }

      // Reset form
      setName("");
      setOriginalPrice("");
      setRescuePrice("");
      setQty(5);
      setExpiresIn("2 hrs");
      setImg("");
      setDescription("");

      // Notify parent to refresh and change tab
      onAddMealSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left font-body">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Add Returned Meal</h1>
        <p className="text-on-surface-variant text-sm mt-1">Recover lost food value instantly by posting unsold dishes.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-[2rem] p-8 md:p-10 border border-outline-variant/10 shadow-[0_4px_24px_rgba(176,46,0,0.02)] space-y-8">
        
        {/* Row 1: Dish Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="dishName">
              Dish Name <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)]" 
              id="dishName" 
              placeholder="Harvest Grain Bowl" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="category">
              Category <span className="text-primary">*</span>
            </label>
            <select 
              className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)] appearance-none cursor-pointer" 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Bowls">Bowls</option>
              <option value="Mains">Mains</option>
              <option value="Desserts">Desserts</option>
              <option value="Sharing">Sharing</option>
            </select>
          </div>
        </div>

        {/* Row 2: Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5b4039] uppercase tracking-wider block ml-2" htmlFor="originalPrice">
              Original Price ($) <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)]" 
              id="originalPrice" 
              placeholder="18.00" 
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              required
              type="number"
              step="0.01"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider block ml-2" htmlFor="rescuePrice">
              Rescue Price ($) <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)]" 
              id="rescuePrice" 
              placeholder="9.00" 
              value={rescuePrice}
              onChange={(e) => setRescuePrice(e.target.value)}
              required
              type="number"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Row 3: Qty & Expiration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="qty">
              Quantity Available <span className="text-primary">*</span>
            </label>
            <input 
              className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)]" 
              id="qty" 
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
              type="number"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="expiresIn">
              Deal Expiration window <span className="text-primary">*</span>
            </label>
            <select 
              className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)] appearance-none cursor-pointer" 
              id="expiresIn"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
            >
              <option value="45 mins">45 minutes</option>
              <option value="2 hrs">2 hours</option>
              <option value="4 hrs">4 hours</option>
              <option value="12 hrs">12 hours</option>
            </select>
          </div>
        </div>

        {/* Row 4: Image Drag & Drop / URL */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2">
            Dish Image <span className="text-on-surface-variant/60 font-normal lowercase">(optional)</span>
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] text-center cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01] shadow-md"
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
              // Preview State
              <div className="relative w-full h-full min-h-[160px] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img
                  src={img}
                  alt="Meal preview"
                  className="max-h-[220px] rounded-xl object-cover shadow-sm border border-outline-variant/20"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-error text-white p-2 rounded-full shadow-warm hover:bg-error-container hover:text-on-error-container transition-colors duration-150 flex items-center justify-center"
                  title="Remove Image"
                >
                  <span className="material-symbols-outlined text-sm font-bold">close</span>
                </button>
                <div className="mt-2 text-xs text-on-surface-variant font-medium">
                  {img.startsWith("data:") ? "Local Image Uploaded" : "Remote URL Image"}
                </div>
              </div>
            ) : (
              // Empty State (Upload prompt)
              <div className="space-y-3 flex flex-col items-center py-4">
                <div className="p-4 bg-primary/5 rounded-full text-primary hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl font-light">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-on-surface">
                    Drag and drop your image, or <span className="text-primary hover:underline">browse</span>
                  </p>
                  <p className="text-xs text-outline">
                    Supports PNG, JPG, JPEG, WEBP (max. 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Paste URL input as alternative/manual entry */}
          <div className="pt-1">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-sm">link</span>
              </div>
              <input
                type="text"
                placeholder="Or paste an image URL instead..."
                className="w-full bg-surface-bright border-none rounded-xl pl-11 pr-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                value={img.startsWith("data:") ? "" : img}
                onChange={(e) => setImg(e.target.value)}
              />
            </div>
            {img.startsWith("data:") && (
              <p className="text-[10px] text-secondary font-semibold mt-1 ml-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                Using dragged/uploaded file. Paste a URL above to override.
              </p>
            )}
          </div>
        </div>

        {/* Row 5: Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block ml-2" htmlFor="description">
            Short Description / Ingredients
          </label>
          <textarea 
            className="w-full bg-surface-bright border-none rounded-xl px-5 py-4 text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-300 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.01)] resize-none h-28" 
            id="description" 
            placeholder="Describe the dish, ingredients, and any allergens (e.g. gluten-free, contains nuts)." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-headline font-bold text-base shadow-warm hover:opacity-90 transition-opacity active:scale-[0.98] duration-150"
        >
          {loading ? "Posting Meal..." : "Post Rescue Deal"}
        </button>

      </form>
    </div>
  );
}
