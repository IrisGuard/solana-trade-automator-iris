
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavItem } from "@/types/nav";

interface SidebarNavProps {
  items: NavItem[];
  isCollapsed?: boolean;
}

export function SidebarNav({ items = [], isCollapsed = false }: SidebarNavProps) {
  const location = useLocation();
  
  return (
    <nav className="grid gap-2 px-2">
      {items && items.map((item, index) => {
        const Icon = item.icon;
        return (
          item.href && (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    location.pathname === item.href
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline",
                    "justify-start",
                    isCollapsed && "h-9 w-9 p-0 justify-center"
                  )}
                >
                  {Icon && <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="flex items-center gap-4">
                  {item.title}
                </TooltipContent>
              )}
            </Tooltip>
          )
        );
      })}
    </nav>
  );
}
