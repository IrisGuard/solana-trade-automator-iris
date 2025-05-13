
// Re-export sonner's toast functionality
import { toast } from "sonner";

export { toast };

// Provide a useToast hook for compatibility
export function useToast() {
  return {
    toast
  };
}
