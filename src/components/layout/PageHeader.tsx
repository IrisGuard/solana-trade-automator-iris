
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { GradientHeading } from "@/components/ui/gradient-heading";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  variant?: "purple" | "blue" | "green" | "amber" | "pink";
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  actions,
  variant = "blue" 
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Link to="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4 mr-1" />
            <span>Αρχική</span>
          </Link>
          
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={`crumb-${index}`}>
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
              {crumb.href ? (
                <Link 
                  to={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <GradientHeading as="h1" variant={variant}>
            {title}
          </GradientHeading>
          
          {description && (
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
