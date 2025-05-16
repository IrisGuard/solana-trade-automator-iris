
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GradientVariant } from "./gradient-card";

interface GradientHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: GradientVariant;
  className?: string;
}

const gradientStyles = {
  purple: "from-purple-400 via-indigo-400 to-purple-500",
  blue: "from-blue-400 via-cyan-400 to-blue-500",
  green: "from-emerald-400 via-teal-400 to-emerald-500",
  amber: "from-amber-400 via-orange-400 to-amber-500",
  pink: "from-pink-400 via-purple-400 to-pink-500",
  indigo: "from-indigo-400 via-blue-400 to-indigo-500",
  cyan: "from-cyan-400 via-blue-400 to-cyan-500",
  emerald: "from-emerald-400 via-green-400 to-emerald-500",
};

export function GradientHeading({ 
  children, 
  as = "h2", 
  variant = "blue",
  className 
}: GradientHeadingProps) {
  const Component = as;
  const baseStyles = "font-bold bg-gradient-to-r bg-clip-text text-transparent";
  
  const sizeStyles = {
    h1: "text-3xl sm:text-4xl md:text-5xl",
    h2: "text-2xl sm:text-3xl md:text-4xl",
    h3: "text-xl sm:text-2xl md:text-3xl",
    h4: "text-lg sm:text-xl md:text-2xl",
    h5: "text-base sm:text-lg md:text-xl",
    h6: "text-sm sm:text-base md:text-lg",
  };
  
  return (
    <Component 
      className={cn(
        baseStyles, 
        sizeStyles[as],
        gradientStyles[variant],
        className
      )}
    >
      {children}
    </Component>
  );
}
