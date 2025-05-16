
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export type GradientVariant = 
  | "purple" 
  | "blue" 
  | "green" 
  | "amber" 
  | "pink" 
  | "indigo" 
  | "cyan" 
  | "emerald";

interface GradientCardProps {
  children: ReactNode;
  variant?: GradientVariant;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

const gradientStyles = {
  purple: "bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-purple-400/20 shadow-lg shadow-purple-900/20",
  blue: "bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-400/20 shadow-lg shadow-blue-900/20",
  green: "bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-400/20 shadow-lg shadow-emerald-900/20",
  amber: "bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-400/20 shadow-lg shadow-amber-900/20",
  pink: "bg-gradient-to-br from-pink-600/10 to-purple-600/10 border border-pink-400/20 shadow-lg shadow-pink-900/20",
  indigo: "bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-indigo-400/20 shadow-lg shadow-indigo-900/20",
  cyan: "bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-400/20 shadow-lg shadow-cyan-900/20",
  emerald: "bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-400/20 shadow-lg shadow-emerald-900/20",
};

export function GradientCard({ 
  children, 
  variant = "blue", 
  className, 
  header, 
  footer 
}: GradientCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-xl", 
      gradientStyles[variant], 
      className)}
    >
      {header && (
        <CardHeader className="backdrop-blur-sm">
          {header}
        </CardHeader>
      )}
      <CardContent className={cn(!header && "pt-6")}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="border-t border-border/40 backdrop-blur-sm">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export function GradientBorder({ 
  children, 
  variant = "blue", 
  className 
}: {
  children: ReactNode;
  variant?: GradientVariant;
  className?: string;
}) {
  return (
    <div className={cn("p-0.5 rounded-lg transition-transform", 
      {
        "bg-gradient-to-br from-purple-600 to-indigo-600": variant === "purple",
        "bg-gradient-to-br from-blue-600 to-cyan-600": variant === "blue",
        "bg-gradient-to-br from-emerald-600 to-teal-600": variant === "green",
        "bg-gradient-to-br from-amber-500 to-orange-600": variant === "amber",
        "bg-gradient-to-br from-pink-600 to-purple-600": variant === "pink",
        "bg-gradient-to-br from-indigo-600 to-blue-600": variant === "indigo",
        "bg-gradient-to-br from-cyan-600 to-blue-600": variant === "cyan",
        "bg-gradient-to-br from-emerald-600 to-green-600": variant === "emerald",
      },
      className
    )}>
      <div className="bg-background rounded-md h-full w-full">
        {children}
      </div>
    </div>
  );
}
