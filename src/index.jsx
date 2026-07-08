import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  const registerSW = () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered successfully: ", registration.scope);
      })
      .catch((err) => {
        console.log("SW registration failed: ", err);
      });
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    registerSW();
  } else {
    window.addEventListener("load", registerSW);
  }
}
