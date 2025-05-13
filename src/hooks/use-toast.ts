
import { toast } from "sonner";

export { toast }; // Export toast directly

export function useToast() {
  return {
    toast
  };
}
