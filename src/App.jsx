import React, { useState, useEffect } from "react";
import TopNavBar from "./components/TopNavBar";
import CartSidebar from "./components/CartSidebar";
import MealDetailsModal from "./components/MealDetailsModal";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUpChooseRole from "./pages/SignUpChooseRole";
import SignUpCustomer from "./pages/SignUpCustomer";
import SignUpPartner from "./pages/SignUpPartner";
import BrowseDeals from "./pages/BrowseDeals";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import LocationPickerModal from "./components/LocationPickerModal";

// Import New Customer Pages
import CustomerHome from "./pages/CustomerHome";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// Import Toast Notification components
import ToastContainer from "./components/ToastContainer";
import AIAssistant from "./components/AIAssistant";
import Footer from "./components/Footer";


export default function App() {
  const [activePage, setActivePage] = useState("landing");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("loma_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [locationAddress, setLocationAddress] = useState(() => {
    return localStorage.getItem("loma_location_addr") || "Cairo, Maadi";
  });
  const [locationCoords, setLocationCoords] = useState(() => {
    const saved = localStorage.getItem("loma_location_coords");
    return saved ? JSON.parse(saved) : { lat: 30.0444, lng: 31.2357 };
  });
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

  // Sync location to local storage
  useEffect(() => {
    localStorage.setItem("loma_location_addr", locationAddress);
  }, [locationAddress]);

  useEffect(() => {
    localStorage.setItem("loma_location_coords", JSON.stringify(locationCoords));
  }, [locationCoords]);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("loma_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [meals, setMeals] = useState([]);
  const [mockPaymentData, setMockPaymentData] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("mock_payment") === "true") {
      return {
        orderId: query.get("orderId"),
        amount: query.get("amount")
      };
    }
    return null;
  });

  // Global Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type, title, message, duration }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("loma_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("loma_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("loma_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Handle Paymob redirect query params
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paymobTxId = query.get("id");
    const success = query.get("success");
    const pending = query.get("pending");

    if (paymobTxId && success) {
      const isSuccess = success === "true";
      const isPending = pending === "true";
      const pendingOrderId = localStorage.getItem("loma_pending_order_id");

      if (pendingOrderId) {
        if (isSuccess && !isPending) {
          fetch(`http://localhost:5000/api/orders/${pendingOrderId}`)
            .then(res => res.json())
            .then(orderData => {
              if (orderData && orderData.status !== "Payment Failed") {
                setLastOrder(orderData);
                setCartItems([]);
                localStorage.removeItem("loma_cart");
                addToast({
                  type: "success",
                  title: "Payment Successful",
                  message: "Your rescue order has been logged!"
                });
                setActivePage("order-confirmation");
              } else {
                addToast({
                  type: "error",
                  title: "Payment Failed",
                  message: "Verification failed. Please contact support."
                });
                setActivePage("checkout");
              }
            })
            .catch(err => {
              console.error("Error validating order:", err);
              setActivePage("checkout");
            })
            .finally(() => {
              localStorage.removeItem("loma_pending_order_id");
              window.history.replaceState({}, document.title, window.location.pathname);
            });
        } else {
          addToast({
            type: "error",
            title: "Payment Cancelled",
            message: "The transaction was failed or cancelled."
          });
          localStorage.removeItem("loma_pending_order_id");
          setActivePage("checkout");
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, []);

  // Fetch meals on launch and when user changes
  useEffect(() => {
    fetchMeals();
  }, [user, activePage]);

  const fetchMeals = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/meals");
      if (res.ok) {
        const data = await res.json();
        setMeals(data);
      }
    } catch (err) {
      console.error("Could not fetch global meals:", err);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    addToast({
      type: "success",
      title: "Welcome Back",
      message: `Successfully logged in as ${userData.name}.`
    });

    if (userData.role === "restaurant") {
      setActivePage("restaurant-dashboard");
    } else {
      setActivePage("customer-home");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    addToast({
      type: "info",
      title: "Logged Out",
      message: "You have been securely logged out."
    });
    setActivePage("landing");
  };

  const handleAddToCart = (meal, qty) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === meal.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prevItems, { ...meal, quantity: qty }];
      }
    });
    // Removed automatic cart sidebar opening: only trigger toast notification!
  };

  const handleUpdateCartQty = (itemId, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
      );
    }
  };

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    if (!user) {
      setActivePage("login");
    } else {
      setActivePage("checkout");
    }
  };

  const handleOrderSuccess = (orderData) => {
    setLastOrder(orderData);
    setCartItems([]); // clear cart
    setActivePage("order-confirmation");
  };

  // Route isolation / navigation redirects protection helper
  useEffect(() => {
    if (user) {
      if (user.role === "restaurant" && 
          ["landing", "customer-home", "marketplace", "about", "contact", "profile", "checkout"].includes(activePage)) {
        setActivePage("restaurant-dashboard");
      }
      if (user.role === "customer" && activePage === "restaurant-dashboard") {
        setActivePage("customer-home");
      }
    } else {
      if (["customer-home", "marketplace", "profile", "restaurant-dashboard"].includes(activePage)) {
        setActivePage("landing");
      }
    }
  }, [user, activePage]);

  // Switch views
  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <LandingPage onNavigate={setActivePage} />;
      case "customer-home":
        return (
          <CustomerHome 
            user={user} 
            meals={meals} 
            onNavigate={setActivePage} 
            onAddToCart={handleAddToCart}
            addToast={addToast}
          />
        );
      case "marketplace":
      case "browse-deals":
        return (
          <BrowseDeals 
            meals={meals}
            onSelectMeal={setSelectedMeal} 
            onAddToCart={handleAddToCart}
            locationAddress={locationAddress}
            onOpenLocationPicker={() => setLocationPickerOpen(true)}
            isAuthenticated={!!user}
            addToast={addToast}
          />
        );
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage addToast={addToast} />;
      case "profile":
        return (
          <ProfilePage 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={setActivePage}
            addToast={addToast}
          />
        );
      case "login":
        return <Login onLogin={handleLogin} onNavigate={setActivePage} />;
      case "signup-choose":
        return <SignUpChooseRole onNavigate={setActivePage} />;
      case "signup-customer":
        return <SignUpCustomer onLogin={handleLogin} onNavigate={setActivePage} />;
      case "signup-partner":
        return <SignUpPartner onLogin={handleLogin} onNavigate={setActivePage} />;
      case "checkout":
        return (
          <Checkout 
            cartItems={cartItems} 
            user={user} 
            onOrderSuccess={handleOrderSuccess}
            onNavigate={setActivePage}
            addToast={addToast}
          />
        );
      case "order-confirmation":
        return <OrderConfirmation order={lastOrder} onNavigate={setActivePage} />;
      case "restaurant-dashboard":
        return (
          <RestaurantDashboard 
            user={user} 
            onNavigate={setActivePage} 
            onLogout={handleLogout} 
            onRefreshMeals={fetchMeals}
          />
        );
      default:
        return <LandingPage onNavigate={setActivePage} />;
    }
  };

  const showHeader = activePage !== "restaurant-dashboard";
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && (
        <TopNavBar
          user={user}
          activePage={activePage}
          onNavigate={(target) => {
            if (target === "cart-open") {
              setCartOpen(true);
            } else {
              setActivePage(target);
            }
          }}
          onToggleCart={() => setCartOpen(true)}
          cartCount={cartCount}
          onLogout={handleLogout}
          locationAddress={locationAddress}
          onOpenLocationPicker={() => setLocationPickerOpen(true)}
        />
      )}

      {/* Main view injection */}
      <div className="flex-grow">
        {renderPage()}
      </div>

      {/* Premium Footer: Authenticated customers only, never on dashboard */}
      {user && user.role !== "restaurant" && activePage !== "restaurant-dashboard" && (
        <Footer onNavigate={setActivePage} />
      )}

      {/* Toast Notification Popups */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* AI Assistant Chatbot: Only loaded/visible for authenticated customers */}
      {user && user.role === "customer" && (
        <AIAssistant 
          user={user} 
          meals={meals} 
          onNavigate={(target) => {
            if (target === "cart-open") {
              setCartOpen(true);
            } else {
              setActivePage(target);
            }
          }}
        />
      )}

      {/* Shared Overlays */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onCheckout={handleProceedToCheckout}
      />

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={selectedMeal !== null}
        onClose={() => setSelectedMeal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Paymob Sandbox Simulator Modal */}
      {mockPaymentData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low max-w-md w-full rounded-[2rem] p-8 border border-outline-variant/20 shadow-2xl text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">receipt_long</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-xl text-on-background">Paymob Sandbox</h3>
                <p className="text-xs text-on-surface-variant">Local Testing Simulator</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-primary-container/10 rounded-2xl border border-primary/15 text-xs text-on-primary-container leading-relaxed">
                <strong>💡 Sandbox Mode:</strong> Your Paymob environment keys are not configured yet. We generated this sandbox screen to let you test the payment redirection and checkout flow successfully!
              </div>

              <div className="bg-surface-container-highest/30 p-5 rounded-2xl space-y-2 border border-outline-variant/10 text-on-background">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Order Reference:</span>
                  <span className="font-bold">{mockPaymentData.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Amount to Pay:</span>
                  <span className="font-extrabold text-primary">${parseFloat(mockPaymentData.amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("http://localhost:5000/api/paymob/simulate-success", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderId: mockPaymentData.orderId })
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || "Failed to process simulation");
                    
                    setMockPaymentData(null);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    handleOrderSuccess(data);
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-headline font-bold shadow-warm hover:opacity-95 transition-opacity"
              >
                Simulate Successful Payment
              </button>
              <button
                onClick={() => {
                  setMockPaymentData(null);
                  window.history.replaceState({}, document.title, window.location.pathname);
                  alert("Payment simulated as failed.");
                  setActivePage("checkout");
                }}
                className="w-full bg-surface-container-highest text-on-surface py-4 rounded-xl font-headline font-bold hover:bg-outline-variant/35 transition-colors"
              >
                Simulate Failed Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <LocationPickerModal
        isOpen={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        initialAddress={locationAddress}
        initialCoords={locationCoords}
        onSave={(addr, coords) => {
          setLocationAddress(addr);
          setLocationCoords(coords);
        }}
      />
    </div>
  );
}