
// Εισαγωγή της συνάρτησης toast από τη βιβλιοθήκη sonner
import { toast } from "sonner";

export function useToast() {
  return {
    toast,
  };
}

// Κάνουμε εξαγωγή χρήσιμων τύπων από το @radix-ui/react-toast
// για συμβατότητα με την παλιά υλοποίηση
export type ToastProps = {
  description?: string;
  title?: string;
  action?: React.ReactNode;
  duration?: number;
  variant?: 'default' | 'destructive';
};

export type ToastActionElement = React.ReactElement;
