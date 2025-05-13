
import { Toaster as SonnerToaster } from "sonner";

// Απλό wrapper για το Sonner Toaster για συμβατότητα με υπάρχοντα κώδικα
export function Toaster() {
  // Απλή προώθηση του Sonner Toaster με προ-διαμορφωμένες επιλογές
  return (
    <SonnerToaster 
      position="top-right"
      richColors
      closeButton
    />
  );
}
