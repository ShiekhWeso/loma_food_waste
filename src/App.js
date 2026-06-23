import React, { useState } from 'react';
import './App.css';
import MealDetails from './pages/MealDetails';

function App() {
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('home');

  // If current page is 'meal-details', show the MealDetails page
  if (currentPage === 'meal-details') {
    return <MealDetails setCurrentPage={setCurrentPage} />;
  }

  // HOME PAGE
  return (
    <div className="app">
      {/* TopNavBar */}
      <nav className="navbar">
        <div className="nav-container">
          <div 
            className="logo" 
            onClick={() => setCurrentPage('home')}
            style={{ cursor: 'pointer' }}
          >
            Lo’ma
          </div>
          <div className="nav-links">
            <button 
              className="browse-nav-btn"
              onClick={() => setCurrentPage('meal-details')}
            >
              Browse
            </button>
            <a href="#">How it Works</a>
            <a href="#">Impact</a>
            <a href="#">Dashboard</a>
          </div>
          <div className="nav-actions">
            <button className="icon-btn">
              <span className="material-symbols-outlined">location_on</span>
            </button>
            <button className="icon-btn">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            <button className="login-btn">Login</button>
            <button className="signup-btn">Sign Up</button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <span className="badge">Join the circular food revolution</span>
            <h1 className="hero-title">
              Save <span className="highlight-red">Food</span>,<br/>
              Save Money, Save the <span className="highlight-green">Planet</span>.
            </h1>
            <p className="hero-description">
              Connecting surplus artisan meals with conscious diners. High-end culinary experiences at impossible prices, served with a side of environmental impact.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => setCurrentPage('meal-details')}
              >
                Browse Live Deals
              </button>
              <button className="btn-secondary">Partner with Us</button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              <img 
                alt="Gourmet surplus food" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr10C-q-bWwjvAm_0LX8OU5HCDl2UsL6v5VHjsGn-mLkX1-M42jH9wy-pdFnc_R7Ft7CfWURCsH9nF2PfgK8r3ZK2UVhy2pl9WDujDhobljAjdwD0lg0mlGUx0_lA3-RGzz4fIQ5wPLdA0KgF659L3sr5Lj9Lqx80jgeSb45XDD30WE6gRHDMEhHCmb4JlXwZD0fsgQCk7o2UlCfhtCBd5JQRvezZ8eQ17F91gLYyh9coQkmEkarO_d-QAOwqLsjRXmitcof3JckU"
              />
            </div>
            <div className="live-badge">
              <div className="live-badge-header">
                <span className="live-dot"></span>
                <span className="live-text">Live Now</span>
              </div>
              <p>Artisan Bakery Surplus: Fresh Sourdough &amp; Pastries available in 15 mins.</p>
            </div>
          </div>
        </section>

        {/* Impact Counter */}
        <section className="impact">
          <div className="impact-container">
            <div className="impact-card">
              <span className="material-symbols-outlined impact-icon">eco</span>
              <div className="impact-number">14,200+</div>
              <div className="impact-label">Meals Rescued</div>
            </div>
            <div className="impact-card">
              <span className="material-symbols-outlined impact-icon">co2</span>
              <div className="impact-number">35.4 Tons</div>
              <div className="impact-label">CO2 Prevented</div>
            </div>
            <div className="impact-card">
              <span className="material-symbols-outlined impact-icon">savings</span>
              <div className="impact-number">$84k+</div>
              <div className="impact-label">Saved by Users</div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="how-it-works">
          <h2 className="section-title">The Circle of Value</h2>
          <div className="works-grid">
            <div className="diner-card">
              <h3>For the Diner</h3>
              <div className="step">
                <span className="step-number">01</span>
                <div>
                  <h4>Browse</h4>
                  <p>Discover high-end restaurant surplus nearby.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">02</span>
                <div>
                  <h4>Order</h4>
                  <p>Secure your meal through our glass-clean app.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">03</span>
                <div>
                  <h4>Save</h4>
                  <p>Pick up, enjoy, and reduce food waste.</p>
                </div>
              </div>
              <div className="diner-bg-image">
                <img 
                  alt="Gourmet Bowl" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWlSU1wybV0CAfRLI570rmUnDDGMobfKFUVp768iN1X9fkjSSqGorKN96U02Zqh5bM1rE4lFQqPSa_JfZyrjt5-acf7yuab6jVgD6JSQi2OdR1DEiBa3pOhm7hg4ye2_CFkcyoGtFdWRHWPKQtPN8g3iBO4lVA-yJW-8y0WbvXSaaHa6jmF7vSWUS4nioSWg2zgvHwY8yxdXyLU3uMX5ojuVmHQOuKoFxK6pq7MqFCATgBTvp6SuFsB47peyzHh0JYoy7-F-wPCBM"
                />
              </div>
            </div>
            <div className="kitchen-card">
              <h3>For the Kitchen</h3>
              <div className="kitchen-item">
                <span className="material-symbols-outlined">cancel</span>
                <span>Canceled Orders</span>
              </div>
              <div className="kitchen-item">
                <span className="material-symbols-outlined">add_circle</span>
                <span>Instant Post</span>
              </div>
              <div className="kitchen-item">
                <span className="material-symbols-outlined">trending_up</span>
                <span>Recover Revenue</span>
              </div>
              <button className="sell-btn">Start Selling</button>
            </div>
          </div>
        </section>

        {/* Live Deals */}
        <section className="live-deals">
          <div className="deals-header">
            <div>
              <h2 className="section-title">Live Opportunities</h2>
              <p className="deals-subtitle">Fresh, delicious, and waiting for a home.</p>
            </div>
            <button 
              className="view-all"
              onClick={() => setCurrentPage('meal-details')}
            >
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="deals-grid">
            {/* Card 1 */}
            <div className="deal-card" onClick={() => setCurrentPage('meal-details')}>
              <div className="deal-image">
                <img 
                  alt="Gourmet Skewers" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaCVmdhRQc-jENQd7Hn2CHRk17TcINAtc9I32I0MZ4XFD--DHJ6b5GfB_NVYNjZykLzBipUjQtpYrOcy9dn_jLMpCJZjR-R7eOfmszeUvFEAINUxQE1jrS4K7CS8gnWQSt6XVgl4g-60wLtTXdJRCmwhH0D8e_20vA8pLzk8CR-UPfA60skS_zLaGDn6DEQzZpxVdxymMiC0h-Ljw2o_dYfpKPoUo0yo7G8I6TSDkyzL-ZL1YKs3-9VHR7ekEtJs1tJOmaOWqdink"
                />
                <span className="deal-tag">4 mins left</span>
              </div>
              <h4>Mediterranean Grill Set</h4>
              <p className="deal-location">The Conscious Kitchen • 0.4 mi</p>
              <div className="deal-price">
                <span className="current-price">$8.50</span>
                <span className="original-price">$22.00</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="deal-card" onClick={() => setCurrentPage('meal-details')}>
              <div className="deal-image">
                <img 
                  alt="Avocado Toast" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQSsSMy-eqU1f8EFGlD9xHdQZgQq89T4btc4S9ePjLEG9zlI95sMKRqMfK4rebz-nSASCjZDLx0jG_R9YOEBsvZzNKRjJFN3R2BedRpnpkDM0jwAGQao8gNfO_UR1PYH85if-NamhqwerIg9s1ezNgnwr3T5B9U2ZMjj4UCzi8jA4WZPQzIdg39iZFiyVzcQxsTg4agOiRNWhW3EwfR4JhVixpoAglDxfFDhKgHm9B_3WMQaqM0Qg_dq9PA37JtA9B-Mipb6EOXGw"
                />
                <span className="deal-tag green">2 meals left</span>
              </div>
              <h4>Artisan Brunch Platter</h4>
              <p className="deal-location">Green Sprout Cafe • 1.2 mi</p>
              <div className="deal-price">
                <span className="current-price">$6.00</span>
                <span className="original-price">$14.50</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="deal-card" onClick={() => setCurrentPage('meal-details')}>
              <div className="deal-image">
                <img 
                  alt="Pastries" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC14W2OOGKeJifIRX1jGJNwF13y3o-SB3bK6OygyybcOOyScJIOQplI5Njx7ImfmQCErGMrf7KUUNr8A5mdj2d9dCOe5RLf8X4wODSMRaIa0e0CgFvfNZWQYrD-EsjvYAYvJ1eikXFI5tjAjRfjT5FvAavg-LdCrY9RZVpvTqXURC_mR8woiPIkPu_xLo2DDt5SmEInZ69NpCKSbBkn_zHIz8kN8NheeFH86CHM3XnQ9q2c67-63v6LnZgHYVjiCQJSwkyVfQ2Rbfk"
                />
                <span className="deal-tag">12 mins left</span>
              </div>
              <h4>Pastry Surprise Box</h4>
              <p className="deal-location">L'Artisan Boulangerie • 0.8 mi</p>
              <div className="deal-price">
                <span className="current-price">$4.50</span>
                <span className="original-price">$18.00</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="deal-card" onClick={() => setCurrentPage('meal-details')}>
              <div className="deal-image">
                <img 
                  alt="Salmon Bowl" 
                  src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop&crop=center"
                />
                <span className="deal-tag green">High Impact</span>
              </div>
              <h4>Superfood Salmon Bowl</h4>
              <p className="deal-location">The Fresh Table • 2.5 mi</p>
              <div className="deal-price">
                <span className="current-price">$9.00</span>
                <span className="original-price">$24.00</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">Lo’ma</div>
            <p>Saving the planet one meal at a time. Curating surplus for the conscious epicurean.</p>
          </div>
          <div className="footer-section">
            <h5>Company</h5>
            <a href="#">Sustainability Report</a>
            <a href="#">Partner with Us</a>
          </div>
          <div className="footer-section">
            <h5>Support</h5>
            <a href="#">Privacy Policy</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-section">
            <h5>Newsletter</h5>
            <div className="newsletter">
              <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button>
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Lo’ma. Saving the planet one meal at a time.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;