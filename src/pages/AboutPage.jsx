import React from "react";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto font-body text-left animate-page-in space-y-12">
      
      {/* ── Mission Section ── */}
      <section className="text-center space-y-4">
        <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold">
          Lo'ma Mission
        </span>
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background tracking-tight leading-[1.15]">
          Delicious Food, Zero Waste
        </h1>
        <p className="text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Lo'ma was founded on the idea that premium culinary creations should never end up in a landfill. We bridge the gap between high-end kitchens and conscious epicureans.
        </p>
      </section>

      {/* ── Details Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-warm">
          <span className="material-symbols-outlined text-3xl text-primary mb-3 fill">eco</span>
          <h2 className="text-xl font-headline font-bold text-on-surface mb-2">The Food Waste Problem</h2>
          <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
            One-third of all food produced globally goes to waste. When organic food decays in landfills, it releases methane, a greenhouse gas significantly more potent than CO2. Reducing food waste is the single most effective way to combat global warming.
          </p>
        </div>

        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-warm">
          <span className="material-symbols-outlined text-3xl text-secondary mb-3 fill">partner_exchange</span>
          <h2 className="text-xl font-headline font-bold text-on-surface mb-2">How Lo'ma Works</h2>
          <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
            High-end restaurants, bakeries, and kitchens list fresh, high-quality surplus meals on our dashboard. Diners browse the marketplace, purchase the meals at a fraction of their original cost, and pick them up directly. It's a win-win for kitchens and diners.
          </p>
        </div>
      </div>

      {/* ── Expanded Impact Statistics ── */}
      <section className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-warm">
        <h2 className="text-2xl font-headline font-bold text-on-surface mb-6 text-center">Environmental Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <span className="text-3xl font-extrabold text-secondary font-headline">14,200+</span>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Meals Rescued</p>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-primary font-headline">35.4 Tons</span>
            <p className="text-xs text-on-surface-variant font-medium mt-1">CO₂ Prevented</p>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-tertiary font-headline">$84k+</span>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Saved by Users</p>
          </div>
        </div>
      </section>

      {/* ── Partner & Diner Benefits ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 space-y-3">
          <h3 className="text-lg font-headline font-bold text-secondary">Benefits for Diners</h3>
          <ul className="list-disc pl-5 text-xs font-semibold text-on-surface-variant space-y-2">
            <li>Save up to 70% on premium menus and daily fresh dishes.</li>
            <li>Discover hidden culinary gems in your neighbourhood.</li>
            <li>Take direct action in lowering your personal environmental footprint.</li>
          </ul>
        </div>

        <div className="p-8 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 space-y-3">
          <h3 className="text-lg font-headline font-bold text-primary">Benefits for Restaurants</h3>
          <ul className="list-disc pl-5 text-xs font-semibold text-on-surface-variant space-y-2">
            <li>Recover ingredients cost and reduce waste disposal fees.</li>
            <li>Reach new local customers who want to try your food.</li>
            <li>Improve ESG targets and display green credentials to your audience.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
