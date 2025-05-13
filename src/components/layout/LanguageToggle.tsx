import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  // Απλοποιημένη έκδοση του LanguageToggle που εμφανίζει μόνο το εικονίδιο γλώσσας
  return (
    <Button variant="outline" size="icon" className="relative">
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Ελληνική Γλώσσα</span>
      <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
        EL
      </div>
    </Button>
  );
}
