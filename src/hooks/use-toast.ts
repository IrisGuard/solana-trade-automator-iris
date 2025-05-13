
import { toast as sonnerToast } from "sonner";

// Export toast from Sonner
export const toast = sonnerToast;

// Compatibility with the old useToast interface
export function useToast() {
  return {
    toast: sonnerToast,
  };
}
