
import { toast as sonnerToast } from "sonner";

// Απλοποιημένο export του toast
export const toast = sonnerToast;

// Και ένα hook για συμβατότητα με υπάρχοντα κώδικα
export function useToast() {
  return {
    toast: sonnerToast,
  };
}
