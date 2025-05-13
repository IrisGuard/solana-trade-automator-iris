
import { toast as toastFunction } from "sonner";

// Re-export toast for consistent usage
export const toast = toastFunction;

// Re-export the existing useToast implementation from our local hook
// since sonner doesn't provide its own useToast
export { useToast } from "@/hooks/use-toast";
