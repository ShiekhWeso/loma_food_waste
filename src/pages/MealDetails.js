import React, { useState } from 'react';
import './MealDetails.css';

function MealDetails({ setCurrentPage }) {
  const [email, setEmail] = useState('');

  return (
    <div className="meal-details-page">
      {/* TopAppBar */}
      <nav className="meal-navbar">
        <div className="meal-nav-container">
          <div className="meal-nav-left">
            <span 
              className="meal-logo" 
              onClick={() => setCurrentPage('home')}
            >
              Lo’ma
            </span>
            <div className="meal-nav-links">
              <a href="#" className="meal-nav-link active">Browse</a>
              <a href="#" className="meal-nav-link">How it Works</a>
              <a href="#" className="meal-nav-link">Impact</a>
              <a href="#" className="meal-nav-link">Dashboard</a>
            </div>
          </div>
          <div className="meal-nav-right">
            <div className="meal-nav-icons">
              <button className="meal-icon-btn">
                <span className="material-symbols-outlined">location_on</span>
              </button>
              <button className="meal-icon-btn">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
            <div className="meal-nav-actions">
              <button className="meal-login-btn">Login</button>
              <button className="meal-signup-btn">Sign Up</button>
              <button className="meal-cart-btn">
                <span className="material-symbols-outlined">shopping_cart</span>
                Cart
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="meal-main">
        {/* Hero Section - Product Detail */}
        <div className="meal-hero-grid">
          {/* Left Column - Images */}
          <div className="meal-hero-left">
            <div className="meal-hero-image-wrapper">
              <img 
                alt="Gourmet salad bowl" 
                className="meal-hero-image" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6L-RFO5Tt8lQ2r4f4NmV2M0iR9RXffjgqhl4y5nLZgP0103FwR4k4v0zMDLlZ3NLRvbZxdmJhekErWZAfwRISMFrIrlJqv5C2TGoJqtXYJrLxs4A6MjZuzFhkfn97Ui5MkPn4-XwQed8Pk5dOZQB-8jYBoyb7K-YldRRaVjECiZWN3dxjToKCcoDdclheKvQ5cPLJoO2a0HCIrdY91XQOjFKMlLWFALLMwwljrAfDBV3sHu-6OdVsurOS_ToxwMrVyCmDXt2e64Y"
              />
              <div className="meal-badges-container">
                <div className="meal-badge fresh-badge">
                  <span className="material-symbols-outlined">verified</span>
                  Fresh ✅ Prepared 15 mins ago
                </div>
                <div className="meal-badge timer-badge">
                  <span className="material-symbols-outlined">timer</span>
                  Deal expires in 45:00
                </div>
              </div>
            </div>

            {/* Restaurant Profile */}
            <div className="meal-restaurant-card">
              <div className="meal-restaurant-info">
                <div className="meal-restaurant-avatar">
                  <img 
                    alt="Restaurant" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9-a3c29CXDqxDirzP-jCmpHkpJ4TDgVr5TITJ8S_UzxP3WBOdNDwjuKKg_pyT7gWfDd5NyKTtfuTJDDMR4YVtHOnXhxB3_YXno8-JEB7soOOaDY9zW0z4FzhxqEsDCWMZ6fqCl8GsmEkSG3Ka8_hI_sOyYg7WS81R4ZEYw-tKUJ416RAlry_sySaWkn9HO9qp4mp-AVaZg7Gp9QfXOvt7nHXWT_f2O3BCUiqYvnUIb1llCcy3ctDdrLfJrm4bYeCkxams3HZEDDQ"
                  />
                </div>
                <div>
                  <h3 className="meal-restaurant-name">The Conscious Kitchen</h3>
                  <div className="meal-restaurant-rating">
                    <span className="material-symbols-outlined star-icon">star</span>
                    4.9 (240+ reviews)
                    <span className="meal-rating-divider">•</span>
                    Gold Tier Partner
                  </div>
                </div>
              </div>
              <button className="meal-menu-btn">View Menu</button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="meal-hero-right">
            <div className="meal-details-card">
              <div className="meal-details-header">
                <span className="meal-culinary-tag">Culinary Surplus</span>
                <h1 className="meal-dish-title">Harvest Bowl with Roasted Halloumi</h1>
              </div>

              <div className="meal-price-section">
                <span className="meal-current-price">$8.50</span>
                <span className="meal-original-price">$22.00</span>
                <span className="meal-save-tag">Save 60%</span>
              </div>

              <div className="meal-reason-card">
                <div className="meal-reason-header">
                  <span className="material-symbols-outlined meal-reason-icon">info</span>
                  <h4 className="meal-reason-title">Reason for Return</h4>
                </div>
                <p className="meal-reason-text">
                  This order was cancelled by the customer after preparation. Meal is fresh and safe to consume. Our kitchen guarantees the same quality as a standard order.
                </p>
              </div>

              <div className="meal-eco-info">
                <div className="meal-eco-item">
                  <span className="material-symbols-outlined meal-eco-icon">eco</span>
                  <span className="meal-eco-text">Saves 1.2kg of CO2 emissions</span>
                </div>
                <div className="meal-eco-item">
                  <span className="material-symbols-outlined meal-eco-icon">local_fire_department</span>
                  <span className="meal-eco-text">650 kcal • Gluten Free Option</span>
                </div>
              </div>

              <button className="meal-add-to-cart-btn">
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Add to Cart — $8.50
              </button>
              <p className="meal-pickup-text">Pickup available in 10 minutes at Downtown Loft location</p>
            </div>

            {/* Bento Info Cards */}
            <div className="meal-bento-grid">
              <div className="meal-bento-card">
                <span className="material-symbols-outlined meal-bento-icon">package_2</span>
                <p className="meal-bento-label">Packaging</p>
                <p className="meal-bento-value">100% Compostable</p>
              </div>
              <div className="meal-bento-card">
                <span className="material-symbols-outlined meal-bento-icon">location_on</span>
                <p className="meal-bento-label">Distance</p>
                <p className="meal-bento-value">0.8 miles away</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Deals Section */}
        <section className="meal-related-section">
          <div className="meal-related-header">
            <div>
              <h2 className="meal-related-title">While you're here...</h2>
              <p className="meal-related-subtitle">More rescue opportunities from nearby kitchens.</p>
            </div>
            <button 
              className="meal-view-all-btn"
              onClick={() => setCurrentPage('meal-details')}
            >
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="meal-related-grid">
            {/* Card 1 */}
            <div className="meal-related-card" onClick={() => setCurrentPage('meal-details')}>
              <div className="meal-related-image-wrapper">
                <img 
                  alt="Poke Bowl" 
                  className="meal-related-image" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTqyRHiXsEANY8xjZw0tD0dPX8zbfTfm24vVMIf_kE6o9Rymnm-VGX0d3CoBgAvVReGVNiEjZu0n3CtBCfE-WIOY_rSNH5Il7mauFO3da9dRZeRTKG7WBUbRdQj2rk9Vq2G3hVpKbgmIE41dbt_Z_PXmIOoYrmpIkBiPaAlEfF_yagswJfqoQko31Y1izRZ-YwEPmqjtN0hgvTz6MANn5B5GW3XrJGKaG8GYdpFOQ8nrkKUayw2JwAFl6uJyd3bSDUDfFYXLB6wmU"
                />
                <span className="meal-related-tag">Only 2 Left</span>
              </div>
              <h3 className="meal-related-dish">Artisan Poke Bowl</h3>
              <div className="meal-related-price-row">
                <div className="meal-related-prices">
                  <span className="meal-related-current">$9.20</span>
                  <span className="meal-related-original">$18.00</span>
                </div>
                <span className="meal-related-time">
                  <span className="material-symbols-outlined">schedule</span>
                  10m ago
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="meal-related-card" onClick={() => setCurrentPage('meal-details')}>
              <div className="meal-related-image-wrapper">
                <img 
                  alt="Pizza" 
                  className="meal-related-image" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBu3BxZGHfVwde4EWDblhhv8MvE3CMT3pDC0DpP81YypeC8A02rC2Ik3-BJQ4clHKNEk-U_MQTdCyza2O-r-IlU0sBNh2ceyXiX2JRpbr1mxiZMJTwVq8ejy01yMDbYEqpW_OJ8arIpqrgeexMGh2Go1dz3M2M61QbeX3JKwDvqbWaID5DKFEux9H-B0_yklELwezVQP1JL3YOj-WxapnAPKQWcdhJrXcuWni2LyTKj9femwrMhYePx_H42DWVWjOWlE_wX7GwuzY"
                />
                <span className="meal-related-tag">Almost Gone</span>
              </div>
              <h3 className="meal-related-dish">Wild Mushroom Pizza</h3>
              <div className="meal-related-price-row">
                <div className="meal-related-prices">
                  <span className="meal-related-current">$11.00</span>
                  <span className="meal-related-original">$24.00</span>
                </div>
                <span className="meal-related-time">
                  <span className="material-symbols-outlined">schedule</span>
                  25m ago
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="meal-related-card" onClick={() => setCurrentPage('meal-details')}>
              <div className="meal-related-image-wrapper">
                <img 
                  alt="Burger" 
                  className="meal-related-image" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw1S6811z6lo0zTM95uNh_9jAqB59YgoMK5Cj5u6dB97rJ2hYHq-k7DV2l0edjYGVpsK_LWHAGK5f9zEYXosKcjvo7hecpvccHwEA0ElZ0sqjJn09UNZWRwHh3KAWqipVY_pKRBtO7TxcEYJQgjs2o-oIlSZeeGYCh9LRsVaH9E-YdRM3aJrOAjo_Nu-1iXx3EmsXbRwGUCcP7r1OvO6Z89Rx6jMrUwHiUY2GWpzD8eDOW96i2G9ofhiqHoKcAA0g9GXJZHEUbVW0"
                />
              </div>
              <h3 className="meal-related-dish">Truffle Umami Burger</h3>
              <div className="meal-related-price-row">
                <div className="meal-related-prices">
                  <span className="meal-related-current">$10.50</span>
                  <span className="meal-related-original">$19.50</span>
                </div>
                <span className="meal-related-time">
                  <span className="material-symbols-outlined">schedule</span>
                  5m ago
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="meal-footer">
        <div className="meal-footer-container">
          <div className="meal-footer-section">
            <span className="meal-footer-logo">Lo’ma</span>
            <p className="meal-footer-text">Saving the planet one meal at a time. Join the conscious food movement today.</p>
          </div>
          <div className="meal-footer-section">
            <h4 className="meal-footer-heading">Company</h4>
            <a href="#" className="meal-footer-link">Sustainability Report</a>
            <a href="#" className="meal-footer-link">Partner with Us</a>
          </div>
          <div className="meal-footer-section">
            <h4 className="meal-footer-heading">Support</h4>
            <a href="#" className="meal-footer-link">Privacy Policy</a>
            <a href="#" className="meal-footer-link">Contact</a>
          </div>
          <div className="meal-footer-section">
            <h4 className="meal-footer-heading">Stay Updated</h4>
            <div className="meal-newsletter">
              <input 
                type="email" 
                placeholder="Email address"
                className="meal-newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="meal-newsletter-btn">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="meal-footer-bottom">
          <p>© 2024 Lo’ma. Saving the planet one meal at a time.</p>
        </div>
      </footer>
    </div>
  );
}

export default MealDetails;