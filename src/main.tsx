
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";

// Buffer polyfill
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = require('buffer/').Buffer;
}

// Προσθήκη κώδικα για επαλήθευση φόρτωσης
console.log("Εκκίνηση εφαρμογής Solana Trade Automator...");

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Δεν βρέθηκε το element με id 'root'!");
} else {
  console.log("Το element 'root' βρέθηκε, προσπαθώ να κάνω render την εφαρμογή...");
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    );
    console.log("Η εφαρμογή φορτώθηκε επιτυχώς στο DOM");
  } catch (error) {
    console.error("Σφάλμα κατά το render της εφαρμογής:", error);
  }
}
