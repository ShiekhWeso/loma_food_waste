import React, { useState, useEffect } from "react";

export default function GoogleLoginButton({ role, label, onLoginSuccess, onLoginFailure }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(!!window.google);
  
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isRealClient = clientId && clientId !== "your_google_client_id.apps.googleusercontent.com";
  
  // Load Google GIS script dynamically if Client ID is configured
  useEffect(() => {
    if (window.google) {
      setGsiLoaded(true);
      return;
    }
    if (isRealClient) {
      let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!script) {
        script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
      const handleLoad = () => setGsiLoaded(true);
      script.addEventListener("load", handleLoad);
      return () => {
        script.removeEventListener("load", handleLoad);
      };
    }
  }, [isRealClient]);

  const handleServerAuth = async (profile, accessToken = null) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          picture: profile.picture || "",
          role: role,
          access_token: accessToken,
          isMock: !accessToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to authenticate with backend");
      }

      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
      if (onLoginFailure) {
        onLoginFailure(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (isRealClient) {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: "openid email profile",
            callback: async (tokenResponse) => {
              if (tokenResponse && tokenResponse.access_token) {
                setLoading(true);
                try {
                  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                  });
                  if (!res.ok) {
                    throw new Error("Could not fetch user profile from Google");
                  }
                  const profile = await res.json();
                  await handleServerAuth(profile, tokenResponse.access_token);
                } catch (err) {
                  setError("Google info fetch failed: " + err.message);
                } finally {
                  setLoading(false);
                }
              }
            }
          });
          client.requestAccessToken();
          return;
        } catch (err) {
          console.error("Failed to initialize Google login client", err);
          setError("Google login client error: " + err.message);
        }
      } else {
        setError("Google authentication service is still initializing. Please try again in a few seconds.");
      }
      return;
    }
    
    // Fallback to beautiful mockup simulator
    setIsSimulatorOpen(true);
  };

  const handleSelectMockAccount = async (email, name, picture) => {
    setIsSimulatorOpen(false);
    await handleServerAuth({ email, name, picture });
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    setIsSimulatorOpen(false);
    await handleServerAuth({
      email: customEmail,
      name: customName,
      picture: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(customName)}`
    });
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-100">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading || (isRealClient && !gsiLoaded)}
        className="w-full py-3.5 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl font-headline font-semibold text-base shadow-sm hover:shadow active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60"
      >
        {loading || (isRealClient && !gsiLoaded) ? (
          <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        )}
        <span>{loading ? "Authenticating..." : (isRealClient && !gsiLoaded ? "Initializing Google..." : (label || "Continue with Gmail / Google"))}</span>
      </button>

      {/* Simulator Modal */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-stone-100 flex flex-col relative font-sans text-stone-800 animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsSimulatorOpen(false);
                setShowCustomForm(false);
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-50"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Google Brand Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center gap-0.5 tracking-tight font-bold text-3xl font-sans select-none mb-3">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900">Sign in with Gmail / Google</h3>
              <p className="text-sm text-stone-500 mt-1.5 px-6">
                Choose a Gmail or Google Account to continue to <span className="font-semibold text-primary">Lo’ma</span>
              </p>
              
              <div className="mt-3 inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
                Simulator Mode (Role: {role})
              </div>
            </div>

            {!showCustomForm ? (
              <div className="space-y-3">
                {/* Account list */}
                {role === "customer" ? (
                  <button
                    onClick={() =>
                      handleSelectMockAccount(
                        "sarah.customer@gmail.com",
                        "Sarah Connor",
                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah"
                      )
                    }
                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-stone-50 active:bg-stone-100 border border-stone-200/60 hover:border-stone-300 transition-all text-left group"
                  >
                    <img
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah"
                      alt="Sarah Connor"
                      className="w-10 h-10 rounded-full bg-stone-100 object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-stone-950 text-sm group-hover:text-primary transition-colors">
                        Sarah Connor
                      </p>
                      <p className="text-xs text-stone-500">sarah.customer@gmail.com</p>
                    </div>
                    <span className="material-symbols-outlined text-stone-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-lg">
                      chevron_right
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleSelectMockAccount(
                        "kitchen.owner@gmail.com",
                        "The Conscious Kitchen",
                        "https://api.dicebear.com/7.x/identicon/svg?seed=Kitchen"
                      )
                    }
                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-stone-50 active:bg-stone-100 border border-stone-200/60 hover:border-stone-300 transition-all text-left group"
                  >
                    <img
                      src="https://api.dicebear.com/7.x/identicon/svg?seed=Kitchen"
                      alt="The Conscious Kitchen"
                      className="w-10 h-10 rounded-full bg-stone-100 object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-stone-950 text-sm group-hover:text-primary transition-colors">
                        The Conscious Kitchen
                      </p>
                      <p className="text-xs text-stone-500">kitchen.owner@gmail.com</p>
                    </div>
                    <span className="material-symbols-outlined text-stone-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-lg">
                      chevron_right
                    </span>
                  </button>
                )}

                {/* Use another account */}
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-stone-50 active:bg-stone-100 border border-dashed border-stone-300 text-left group transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <span className="material-symbols-outlined">person_add</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-stone-800 text-sm group-hover:text-primary transition-colors">
                      Use another account
                    </p>
                    <p className="text-xs text-stone-500">Sign in with a custom Gmail address</p>
                  </div>
                  <span className="material-symbols-outlined text-stone-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-lg">
                    chevron_right
                  </span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Gmail Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane.doe@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="flex-1 py-3 border border-stone-200 text-stone-600 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-all active:scale-95"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-container hover:shadow-md transition-all active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            <div className="text-center mt-6 text-xs text-stone-400">
              By continuing, Google will share your name, email address, and profile picture with Lo’ma.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
