import React, { useState } from 'react';
import './Browse.css';

function Browse({ setCurrentPage }) {
  const [email, setEmail] = useState('');

  // Sample meal data
  const meals = [
    {
      id: 1,
      name: "Artisan Pepperoni Large",
      price: "EGP 120",
      originalPrice: "EGP 300",
      discount: "60% OFF",
      restaurant: "Vito's Italian Kitchen",
      reason: "Cancelled by customer after preparation",
      tag: "Only 2 left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmeqnTqsoUS-LOIu09DoMzoxPZc-tc9mgJHUTiA6aikb3V6MxUzv3ifSwsiBGXR-K3uSV3kNNnGHWGpYuhenrsthoXTvRBE6-xzkbmbDLV6RrfXXM2VaDtHC7MEXRM_L2qQU_APV1pauhGDerfR_Bq_PBvfHruvzNOChRyWA6V8SJcH9vFSO79UdHpP8RwhdkBmxQNPhbkhIv7Xp0qqkkUU2iTDLzQHpUDTmfT_GTTLl9RZfgL12mMtUdJeqO6Zy3FQY1E-EPm210"
    },
    {
      id: 2,
      name: "Double Truffle Smash",
      price: "EGP 95",
      originalPrice: "EGP 175",
      discount: "45% OFF",
      restaurant: "Burger Bar Maadi",
      reason: "Mistaken order: No pickles requested",
      tag: "Only 1 left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpNvqeqHWqbl5dDTmEX-bnaTvhUa68dzgq-ewv_Dav5bGT-evhgDhYFhFqImH6vnvz3u_8-FucUF1YLdOCKuwhlrOyIubyW70-iOSi8Nj4Wf20zoEPO7AkqgBlsYkw2eATJS6WjEJVlJOqmtWZI-J367BNh1W8BL5f9SaUxh4uKpRl7JK-NkNh1iKjF4eMI49mBjsAj75MV_FkCF2b71coDWjy6wGOz1HhrDW3Vtv3fNMaUZZaPjTss7J86y-FzRPqsGdN9Z0yAbQ"
    },
    {
      id: 3,
      name: "Quinoa Power Bowl",
      price: "EGP 80",
      originalPrice: "EGP 160",
      discount: "50% OFF",
      restaurant: "Green Garden Cafe",
      reason: "Excess stock: Daily freshness guarantee",
      tag: "Only 3 left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5qgimLRkt-Is1087wcrMb1qdC1cmWpjKpfG90H-n2MkQx1BM2BwfGe1qvsxBlXFhxxSbWUSA27u6UOAPukiqkSdY3DLt5-bm1BG0EmQ6BoBYIpF6TGLLyoHYa3JkbsrLDM-DUMHloOP8P4oSxT6r1eZ7030ryVRNp4h-_1HFPVr1A25zENQ7xGjZ7kjrzw3xhcYMhz4rwQBbMaux2Za4iqtMdlZyfhznj3EiiNS00bawY7DcPEEDXykJWPh18WMxVuZ7FxL9RPcw"
    },
    {
      id: 4,
      name: "Oriental Grill Mix",
      price: "EGP 145",
      originalPrice: "EGP 485",
      discount: "70% OFF",
      restaurant: "Al Pasha Grill",
      reason: "Address out of delivery range",
      tag: "Only 2 left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqO549PJz1cYqHMn6lbIchp8Mpad3Q9iO0XLROchjkhSJWdD4lDQ66JywnqtVFutbiv4SSzwJjqyxKQYSTSPLS7cA4BmOm151Yc0bK86KaDiBpVQZaeRupLlvphv5Kyk6dyG4OecwlCmpA7VpV2PLm_WMKqFLysLxbHRh91JTiRexsZcbHKKIvMtcIxWJ6zGgINfQ_GgAAm7I0gfPonuWDpQzpjlaUzHoWW9yanm8cdpehyR80HOgnH6h7tbN9-x01Z4XQldvJPms"
    },
    {
      id: 5,
      name: "Spicy Miso Ramen",
      price: "EGP 130",
      originalPrice: "EGP 200",
      discount: "35% OFF",
      restaurant: "Oishi Ramen House",
      reason: "Driver accidental cancellation",
      tag: "Only 4 left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_EQrOVmznCwL_JlhfZFsCeYyt1z92pxBVUyA7VCfa6wW57wc2rkC7mq4iXtltghqWOtjY8GPxvJypC8dif0ygA_JLa0CeZDpjGttrphxn3jbxu8y11JZorDryj6tLzEOI-b22QXgVb8Yy1Xvmv8VJWGS2Yrq31j_WqcYAYgDXhghBVCCkhxcaBSZ9rcGTCumHSGzePlDlmWGQ_xunsEZbDPIjk2ORcTlD4YPS0wACPgRec7IHpxU4QfNwM5oHPDlCsf3RXxzZ1KY"
    },
    {
      id: 6,
      name: "Sweet Treat Box (6pcs)",
      price: "EGP 90",
      originalPrice: "EGP 200",
      discount: "55% OFF",
      restaurant: "Glaze & Drizzle",
      reason: "End of day surplus - Baked today",
      tag: "Only 2 left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvAFabfb4MiP08fApIrUcc6Atk7Y8kDvdf85vWgDGCxtV3Kt3lZUKHfWmphOhghPPtEvzQJ7xmKhCco10NFQho_wnOSsfmt0QCME0A5vS4vU4X3pRy-elxWPQ4BFQj83OcFiG8rnmGl8vLz_HljDLgXe3rTdB5rOLL_vuVhlXQmcx-TDfEn6ZFUP6IlhM-ad0gV58NewFMg_UC28h9hSqcTZkb_WNdU4_SdfUjs-6XSN7IYJwYwy-LTMHSAe8Nkk9YyKtYaIIuoYM"
    }
  ];

  const handleMealClick = (mealId) => {
    // Navigate to MealDetails page with the meal ID
    setCurrentPage('meal-details', mealId);
  };

  return (
    <div className="browse-page">
      {/* Top Navigation Bar */}
      <nav className="browse-nav">
        <div className="browse-nav-container">
          <div className="browse-nav-left">
            <span 
              className="browse-logo" 
              onClick={() => setCurrentPage('home')}
            >
              Lo’ma
            </span>
            <div className="browse-nav-links">
              <a href="#" className="browse-nav-link active">Browse</a>
              <a href="#" className="browse-nav-link">How it Works</a>
              <a href="#" className="browse-nav-link">Impact</a>
              <a href="#" className="browse-nav-link">Dashboard</a>
            </div>
          </div>
          <div className="browse-nav-right">
            <button className="browse-icon-btn">
              <span className="material-symbols-outlined">location_on</span>
            </button>
            <div className="browse-nav-actions">
              <button className="browse-login-btn">Login</button>
              <button className="browse-signup-btn">Sign Up</button>
              <button className="browse-cart-btn">
                <span className="material-symbols-outlined">shopping_cart</span>
                Cart
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="browse-main">
        {/* Location Header */}
        <header className="browse-header">
          <div className="browse-header-content">
            <div className="browse-location-badge">
              <span className="material-symbols-outlined">near_me</span>
              Current Location
            </div>
            <h1 className="browse-location-title">Cairo, Maadi</h1>
            <p className="browse-location-subtitle">Showing 42 conscious meals available for rescue near you.</p>
          </div>
          <div className="browse-header-actions">
            <button className="browse-map-btn">
              <span className="material-symbols-outlined">map</span>
              View Map
            </button>
            <button className="browse-change-btn">
              <span className="material-symbols-outlined">edit_location</span>
              Change
            </button>
          </div>
        </header>

        <div className="browse-layout">
          {/* Filter Sidebar */}
          <aside className="browse-sidebar">
            <div className="browse-filter-section">
              <h3 className="browse-filter-title">Sort By</h3>
              <div className="browse-filter-options">
                <label className="browse-filter-option active">
                  <input type="radio" name="sort" defaultChecked />
                  <span>Highest Discount</span>
                </label>
                <label className="browse-filter-option">
                  <input type="radio" name="sort" />
                  <span>Nearest Distance</span>
                </label>
              </div>
            </div>

            <div className="browse-filter-section">
              <h3 className="browse-filter-title">Categories</h3>
              <div className="browse-categories">
                <button className="browse-category-btn active">
                  <span className="material-symbols-outlined">restaurant</span>
                  All Meals
                </button>
                <button className="browse-category-btn">
                  <span className="material-symbols-outlined">local_pizza</span>
                  Pizza
                </button>
                <button className="browse-category-btn">
                  <span className="material-symbols-outlined">lunch_dining</span>
                  Burger
                </button>
                <button className="browse-category-btn">
                  <span className="material-symbols-outlined">set_meal</span>
                  Asian
                </button>
                <button className="browse-category-btn">
                  <span className="material-symbols-outlined">eco</span>
                  Vegan
                </button>
              </div>
            </div>

            <div className="browse-filter-section">
              <h3 className="browse-filter-title">Price Range</h3>
              <input type="range" className="browse-price-range" />
              <div className="browse-price-labels">
                <span>EGP 0</span>
                <span>EGP 500+</span>
              </div>
            </div>

            <div className="browse-impact-card">
              <span className="material-symbols-outlined browse-impact-icon">energy_savings_leaf</span>
              <h4 className="browse-impact-title">Your impact matters.</h4>
              <p className="browse-impact-text">Every meal rescued prevents approximately 2.5kg of CO2 emissions.</p>
            </div>
          </aside>

          {/* Meal Grid */}
          <div className="browse-meals-grid">
            {meals.map((meal) => (
              <div 
                key={meal.id} 
                className="browse-meal-card"
                onClick={() => handleMealClick(meal.id)}
              >
                <div className="browse-meal-image-wrapper">
                  <img 
                    alt={meal.name} 
                    className="browse-meal-image" 
                    src={meal.image}
                  />
                  <div className="browse-meal-badges">
                    <span className="browse-meal-tag">{meal.tag}</span>
                    <span className="browse-meal-discount">
                      <span className="material-symbols-outlined">local_fire_department</span>
                      {meal.discount}
                    </span>
                  </div>
                </div>
                <div className="browse-meal-content">
                  <div className="browse-meal-header">
                    <h3 className="browse-meal-name">{meal.name}</h3>
                    <div className="browse-meal-prices">
                      <span className="browse-meal-price">{meal.price}</span>
                      <span className="browse-meal-original">{meal.originalPrice}</span>
                    </div>
                  </div>
                  <p className="browse-meal-restaurant">{meal.restaurant}</p>
                  <div className="browse-meal-reason">
                    <p className="browse-meal-reason-label">Reason for Return</p>
                    <p className="browse-meal-reason-text">"{meal.reason}"</p>
                  </div>
                  <button className="browse-meal-add-btn">Add to Rescue</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="browse-footer">
        <div className="browse-footer-container">
          <div className="browse-footer-section">
            <span className="browse-footer-logo">Lo’ma</span>
            <p className="browse-footer-text">© 2024 Lo’ma. Saving the planet one meal at a time.</p>
          </div>
          <div className="browse-footer-section">
            <h4 className="browse-footer-heading">Impact</h4>
            <a href="#" className="browse-footer-link">Sustainability Report</a>
            <a href="#" className="browse-footer-link">Partner with Us</a>
          </div>
          <div className="browse-footer-section">
            <h4 className="browse-footer-heading">Company</h4>
            <a href="#" className="browse-footer-link">Privacy Policy</a>
            <a href="#" className="browse-footer-link">Contact</a>
          </div>
          <div className="browse-footer-section">
            <h4 className="browse-footer-heading">Join the Movement</h4>
            <div className="browse-social-icons">
              <button className="browse-social-btn">
                <span className="material-symbols-outlined">social_leaderboard</span>
              </button>
              <button className="browse-social-btn">
                <span className="material-symbols-outlined">photo_camera</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <div className="browse-mobile-nav">
        <button className="browse-mobile-btn active">
          <span className="material-symbols-outlined">restaurant_menu</span>
          <span>Browse</span>
        </button>
        <button className="browse-mobile-btn">
          <span className="material-symbols-outlined">eco</span>
          <span>Impact</span>
        </button>
        <button className="browse-mobile-btn">
          <span className="material-symbols-outlined">shopping_basket</span>
          <span>Orders</span>
        </button>
        <button className="browse-mobile-btn">
          <span className="material-symbols-outlined">account_circle</span>
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}

export default Browse;