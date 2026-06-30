import React from "react";
import Logo from "./Logo";

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#f2efe4] border-t border-outline-variant/30 pt-16 pb-12 px-6 font-body text-left text-on-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Logo size="md" />
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-xs mt-3">
            Save Food, Save Money. Bridging the gap between high-end culinary kitchens and conscious epicureans.
          </p>
          {/* Social Media SVG Icons */}
          <div className="flex items-center gap-3 pt-3">
            {[
              { name: "facebook", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
              { name: "instagram", stroke: true },
              { name: "twitter", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" }
            ].map((soc) => (
              <a
                key={soc.name}
                href={`https://${soc.name}.com/loma`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-primary hover:text-white flex items-center justify-center text-on-surface-variant transition-colors"
                aria-label={soc.name}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  {soc.stroke ? (
                    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </g>
                  ) : (
                    <path d={soc.d} />
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#ac2d00] mb-4 font-headline">Quick Links</h4>
          <ul className="space-y-3 text-sm font-semibold text-on-surface-variant">
            <li>
              <button onClick={() => onNavigate("customer-home")} className="hover:text-primary transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("marketplace")} className="hover:text-primary transition-colors">
                Marketplace
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("about")} className="hover:text-primary transition-colors">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("contact")} className="hover:text-primary transition-colors">
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Legal Policies */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-[#ac2d00] mb-4 font-headline">Support & Legal</h4>
          <ul className="space-y-3 text-sm font-semibold text-on-surface-variant">
            <li>
              <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#help" className="hover:text-primary transition-colors">Help Center</a>
            </li>
          </ul>
        </div>

        {/* Sustainability Goal */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4 font-headline">Our Goal</h4>
          <div className="p-4 bg-surface-container-high/60 rounded-2xl border border-outline-variant/15">
            <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
              🌍 Every meal saved reduces greenhouse gas emissions. Together, we are aiming to rescue 100,000+ meals this year.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-outline-variant/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-on-surface-variant">
        <p>&copy; {new Date().getFullYear()} Lo'ma Platform. All Rights Reserved.</p>
        <p className="flex items-center gap-1">
          Made with <span className="material-symbols-outlined text-xs text-primary fill">favorite</span> for a better planet.
        </p>
      </div>
    </footer>
  );
}
