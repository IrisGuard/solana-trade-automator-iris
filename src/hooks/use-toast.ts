
import { toast } from "sonner";

// Simple wrapper hook for sonner toast
export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) => toast.warning(message),
    info: (message: string) => toast.info(message),
  };
}
