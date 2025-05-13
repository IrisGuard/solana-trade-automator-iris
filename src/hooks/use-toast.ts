
// Import directly from sonner for simplicity
import { toast as sonnerToast } from "sonner";

// Create a consistent useToast hook API
export function useToast() {
  return {
    toast: sonnerToast
  };
}

// Re-export the toast function from sonner for easier use
export { sonnerToast as toast };
