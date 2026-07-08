import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

// Mock window.matchMedia which is not defined in standard jsdom/jest environment
// Mock window.matchMedia directly at module scope
window.matchMedia = window.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;
global.IntersectionObserver = MockIntersectionObserver;

// Mock global fetch for API calls
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/api/meals")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1782671651143,
              name: "Artisan Margherita Pizza",
              restaurant: "The Conscious Kitchen",
              category: "Pizza",
              img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
              originalPrice: 22,
              rescuePrice: 11,
              qty: 6,
              expiresIn: "2 hrs",
              description: "Classic sourdough margherita pizza.",
              returnReason: "Incorrect Order",
              hidden: false,
              status: "Active",
              statusColor: "#2e7d32",
              statusBg: "#e8f5e9",
            },
          ]),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders App without crashing and shows landing page details", async () => {
  await act(async () => {
    render(<App />);
  });

  // Verify that the navbar buttons "Sign Up" and "Login" render successfully
  const signupButtons = screen.getAllByText(/Sign Up/i);
  expect(signupButtons.length).toBeGreaterThan(0);

  const loginButtons = screen.getAllByText(/Login/i);
  expect(loginButtons.length).toBeGreaterThan(0);

  // Verify Browse page navbar link exists
  const browseButtons = screen.getAllByText(/Browse/i);
  expect(browseButtons.length).toBeGreaterThan(0);

  // Navigate to Browse
  await act(async () => {
    browseButtons[0].click();
  });

  // Check if search input is present in Browse Deals with the correct placeholder
  expect(screen.getByPlaceholderText(/Search dishes or kitchens.../i)).toBeInTheDocument();
});
