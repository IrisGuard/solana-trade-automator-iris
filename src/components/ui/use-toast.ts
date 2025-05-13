
// Διορθωμένη έκδοση με σωστή εξαγωγή του toast από το sonner
import { toast as sonnerToast } from "sonner";

// Εξάγει το toast για συνεπή χρήση
export const toast = sonnerToast;

// Δημιουργία και εξαγωγή του useToast hook
export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
