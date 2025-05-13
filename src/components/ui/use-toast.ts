
import { toast } from "sonner";

// Απλή επανεξαγωγή του toast για συνέπεια
export { toast };

// Επιστρέφει το hook με το toast function
export const useToast = () => {
  return {
    toast,
  };
};
