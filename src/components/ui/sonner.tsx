
import { useTheme } from "next-themes";
import { Toaster as SonnerToaster, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: {
          fontSize: '16px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
