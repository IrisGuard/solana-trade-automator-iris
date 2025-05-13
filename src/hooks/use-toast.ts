
import { toast } from "sonner";

// Simplified toast implementation that won't block UI rendering
export { toast };

export const useToast = () => {
  return { toast };
};
