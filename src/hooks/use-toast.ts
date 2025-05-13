
// Forward exports from the main hooks location for compatibility
export { toast } from "@/components/ui/sonner";

// Implement a basic useToast hook
export const useToast = () => {
  return {
    toast
  };
};
