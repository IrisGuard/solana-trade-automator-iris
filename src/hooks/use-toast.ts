
import { toast as sonnerToast } from "sonner";

// Απλό export του toast από το Sonner
export const toast = sonnerToast;

// Συμβατότητα με την παλιά διεπαφή useToast
export function useToast() {
  return {
    toast: sonnerToast,
  };
}
