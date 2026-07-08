import React, { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LocationPickerModal from "../components/LocationPickerModal";
import Logo from "../components/Logo";

export default function SignUpPartner({ onLogin, onNavigate }) {
  const [kitchenName, setKitchenName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationAddress, setLocationAddress] = useState("Cairo, Maadi");
  const [locationCoords, setLocationCoords] = useState({ lat: 30.0444, lng: 31.2357 });
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: kitchenName, 
          contactName,
          email, 
          password, 
          role: "restaurant",
          locationAddress,
          locationCoords
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      onLogin(data); // Log the partner in automatically after registration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 pt-28 pb-12 relative overflow-hidden min-h-screen">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-surface-container-high rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" className="mb-2" />
          <p className="text-on-surface-variant font-body">Partner Registration</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[2rem] shadow-2xl shadow-primary/5 overflow-hidden transition-all duration-300 border border-outline-variant/10">
          <div className="flex border-b border-outline-variant/20 bg-surface-container-low">
            <button 
              onClick={() => onNavigate("login")}
              className="flex-1 py-4 text-center font-headline font-semibold text-stone-500 hover:text-primary transition-all duration-200"
            >
              Login
            </button>
            <button 
              className="flex-1 py-4 text-center font-headline font-bold text-primary border-b-2 border-primary transition-all duration-200"
            >
              Partner
            </button>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-headline font-bold text-[#181d15] text-center mb-6">
              Register Your Kitchen
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="kitchenName">
                  Kitchen / Restaurant Name
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    storefront
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-200 font-body placeholder:text-stone-400" 
                    id="kitchenName" 
                    type="text"
                    value={kitchenName}
                    onChange={(e) => setKitchenName(e.target.value)}
                    placeholder="The Conscious Kitchen" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="contactName">
                  Contact Person Name
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    person
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-200 font-body placeholder:text-stone-400" 
                    id="contactName" 
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Chef Andre" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">
                  Business Email
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    mail
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-200 font-body placeholder:text-stone-400" 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@restaurant.com" 
                    required 
                  />
                </div>
              </div>
 
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant px-1">
                  Kitchen Location / Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">
                    location_on
                  </span>
                  <input 
                    type="text"
                    readOnly
                    onClick={() => setLocationPickerOpen(true)}
                    value={locationAddress}
                    placeholder="Click to select location on map..." 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest cursor-pointer font-body text-xs font-bold text-on-surface"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    lock
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-200 font-body placeholder:text-stone-400" 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    lock
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-200 font-body placeholder:text-stone-400" 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-headline font-bold text-lg shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all duration-200 mt-4 disabled:opacity-50"
              >
                {loading ? "Registering Kitchen..." : "Register Kitchen"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-outline-variant/20"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-stone-400">or</span>
              <div className="flex-grow border-t border-outline-variant/20"></div>
            </div>

            {/* Gmail / Google Signup */}
            <GoogleLoginButton
              role="restaurant"
              label="Sign Up with Gmail"
              onLoginSuccess={onLogin}
              onLoginFailure={(err) => setError(err)}
            />

            <div className="text-center mt-6">
              <p className="text-xs text-on-surface-variant font-medium">
                Already have an account?{" "}
                <button 
                  onClick={() => onNavigate("login")}
                  className="text-primary font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
 
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
