
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  underline?: boolean;
  external?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, underline = false, external = false, ...props }, ref) => {
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    
    return (
      <a
        href={href}
        className={cn(
          "text-primary transition-colors",
          underline && "hover:underline",
          className
        )}
        ref={ref}
        {...externalProps}
        {...props}
      />
    );
  }
);

Link.displayName = "Link";

export { Link };
