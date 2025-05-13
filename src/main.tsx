
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./index.css";

// Debug Supabase imports
import { supabase } from '@/integrations/supabase/client';

console.log("Starting Solana Trade Automator application...");
console.log("Supabase client initialized:", !!supabase);

// Εξετάζουμε λεπτομερώς τη διαδικασία ενεργοποίησης της εφαρμογής
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found! Make sure there's a div with id='root' in the index.html");
} else {
  console.log("Root element found, attempting to render application...");
  
  try {
    // Δημιουργία root με χρήση αποθήκευσης της αναφοράς
    const root = ReactDOM.createRoot(rootElement);
    console.log("Root created successfully, rendering app...");
    
    // Απλή εκτέλεση του render χωρίς πολύπλοκη λογική
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
    // Εμφάνιση λεπτομερειών του σφάλματος
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
}
