
// Properly implement the useToast hook
import { toast as sonnerToast } from "sonner";
import type { ToastT } from "sonner";

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

// Use the correct type from sonner
export type ToastProps = Partial<ToastT> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

export function useToast() {
  return {
    toast: (props: ToastProps) => {
      const { title, description, ...rest } = props;
      
      return sonnerToast(title as string, {
        description,
        ...rest,
      });
    },
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    error: (title: string, description?: string) => sonnerToast.error(title, { description }),
    success: (title: string, description?: string) => sonnerToast.success(title, { description }),
    warning: (title: string, description?: string) => sonnerToast(title, { description, className: 'bg-yellow-100' }),
    info: (title: string, description?: string) => sonnerToast.info(title, { description }),
  };
}
