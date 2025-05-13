
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontSize: '16px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }
      }}
    />
  );
}
