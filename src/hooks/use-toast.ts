
import { useToast as useToastOriginal } from "@/components/ui/toast";

export const useToast = useToastOriginal;

// Re-export the toast function from sonner for easier use
export { toast } from "sonner";
