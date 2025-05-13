
import { toast as sonnerToast } from "sonner";

// Re-export toast function from sonner
export const toast = sonnerToast;

// Compatibility hook for useToast
export function useToast() {
  return {
    toast: sonnerToast
  };
}
