
// Forward exports from the main hooks location for compatibility
import { toast as sonnerToast } from "@/components/ui/sonner";

export { toast } from "@/components/ui/sonner";

// Implement a basic useToast hook
export const useToast = () => {
  return {
    toast: sonnerToast
  };
};
