import React, { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Logo from "../components/Logo";

export default function Login({ onLogin, onNavigate }) {
  const [role, setRole] = useState("customer"); // customer or restaurant
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      // Verify that role matches chosen tab
      if (data.role !== role) {
        throw new Error(`This account is registered as a ${data.role}, not a ${role}.`);
      }

      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 pt-28 pb-12 relative overflow-hidden min-h-screen">
      {/* Background Graphic Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-surface-container-high rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        {/* Brand Anchor */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-3xl font-headline font-extrabold text-on-background tracking-tight">Welcome Back</h1>
          <p className="text-xs text-on-surface-variant mt-1">Sign in to rescue surplus gourmet meals or manage your kitchen.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-surface-container-lowest rounded-[2rem] shadow-2xl shadow-primary/5 overflow-hidden transition-all duration-300 border border-outline-variant/10">
          {/* Tab Navigation */}
          <div className="flex border-b border-outline-variant/20 bg-surface-container-low">
            <button 
              className="flex-1 py-4 text-center font-headline font-bold text-primary border-b-2 border-primary transition-all duration-200"
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate("signup-choose")}
              className="flex-1 py-4 text-center font-headline font-semibold text-stone-500 hover:text-primary transition-all duration-200"
            >
              Sign Up
            </button>
          </div>

          <div className="p-8">
            {/* Identity Selector */}
            <div className="flex items-center justify-center mb-8 p-1 bg-surface-container-low rounded-full w-fit mx-auto">
              <button 
                type="button"
                onClick={() => setRole("customer")}
                className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  role === "customer" 
                    ? "bg-surface-container-lowest text-primary shadow-sm" 
                    : "text-stone-500 hover:text-primary"
                }`}
              >
                Customer
              </button>
              <button 
                type="button"
                onClick={() => setRole("restaurant")}
                className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  role === "restaurant" 
                    ? "bg-surface-container-lowest text-primary shadow-sm" 
                    : "text-stone-500 hover:text-primary"
                }`}
              >
                Restaurant
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">
                  Email Address
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
                    placeholder="gourmet@example.com" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="password">
                    Password
                  </label>
                </div>
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

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-headline font-bold text-lg shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all duration-200 mt-4 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-outline-variant/20"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-stone-400">or</span>
              <div className="flex-grow border-t border-outline-variant/20"></div>
            </div>

            {/* Google Authentication */}
            <GoogleLoginButton
              role={role}
              onLoginSuccess={onLogin}
              onLoginFailure={(err) => setError(err)}
            />

            <div className="text-center mt-6">
              <p className="text-xs text-on-surface-variant">
                Don't have an account?{" "}
                <button 
                  onClick={() => onNavigate("signup-choose")}
                  className="text-primary font-bold hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
