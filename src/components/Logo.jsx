import React from "react";

export default function Logo({ className = "", size = "md" }) {
  const heights = {
    sm: "h-9",      // ~36px
    md: "h-[54px]", // ~54px
    lg: "h-20",     // ~80px
  };

  const selectedHeight = heights[size] || heights.md;

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Lo'ma Logo"
        className={`${selectedHeight} w-auto object-contain transition-transform duration-300 hover:scale-105`}
      />
    </div>
  );
}
