
import { toast as toastFunction } from "sonner";

// Re-export toast for consistent usage
export const toast = toastFunction;

// Re-export our own implementation of useToast
export const useToast = () => {
  return {
    toast: toastFunction,
  };
};
