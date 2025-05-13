
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";

// Buffer polyfill
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = require('buffer/').Buffer;
}

console.log("Starting Solana Trade Automator application...");

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, attempting to render application...");
  try {
    const root = ReactDOM.createRoot(rootElement);
    console.log("Root created successfully, rendering app...");
    
    root.render(
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    );
    
    console.log("Application successfully rendered to DOM");
  } catch (error) {
    console.error("Error rendering application:", error);
  }
}
