
import { toast } from "sonner";

// Απλοποιημένη υλοποίηση toast που δεν θα μπλοκάρει το UI rendering
export { toast };

export const useToast = () => {
  return { toast };
};
