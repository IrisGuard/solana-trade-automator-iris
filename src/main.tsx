
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";

// Απλούστερος τρόπος προσθήκης του Buffer polyfill
// Αυτό αποφεύγει πιθανές διενέξεις με το bundling κατά την παραγωγή
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = require('buffer/').Buffer;
}

// Προσθήκη κώδικα για επαλήθευση φόρτωσης
console.log("Εκκίνηση εφαρμογής Solana Trade Automator...");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
