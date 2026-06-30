import React from "react";
import Logo from "../components/Logo";

export default function SignUpChooseRole({ onNavigate }) {
  return (
    <div className="flex-grow flex items-center justify-center px-4 pt-28 pb-12 relative overflow-hidden min-h-screen">
      {/* Background Graphic Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-surface-container-high rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
 
      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo size="lg" className="mb-2" />
          <p className="text-on-surface-variant font-body">Select your role to start saving food or recovering kitchen revenue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Diner Card */}
          <div 
            onClick={() => onNavigate("signup-customer")}
            className="group cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-outline-variant/10 hover:border-primary/25 transition-all duration-300 flex flex-col justify-between text-left h-[320px] active:scale-[0.98]"
          >
            <div>
              <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">restaurant</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                For Diners
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Rescue premium gourmet meals near you, save up to 70% on local menus, and reduce CO2 emissions.
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm text-primary">
              <span>Sign Up as Diner</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 duration-200">arrow_forward</span>
            </div>
          </div>

          {/* Restaurant Card */}
          <div 
            onClick={() => onNavigate("signup-partner")}
            className="group cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-outline-variant/10 hover:border-primary/25 transition-all duration-300 flex flex-col justify-between text-left h-[320px] active:scale-[0.98]"
          >
            <div>
              <div className="w-14 h-14 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">storefront</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                For Kitchens
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                List unsold dishes, convert cancelations into immediate revenue, and showcase your sustainability goals.
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm text-primary">
              <span>Partner with Us</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 duration-200">arrow_forward</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-on-surface-variant">
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
  );
}
