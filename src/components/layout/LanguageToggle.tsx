
import React from "react";
import { Button } from "@/components/ui/button";
import { GlobeIcon } from "lucide-react";

export function LanguageToggle() {
  // Always English - no toggle needed
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" disabled>
      <GlobeIcon className="h-4 w-4" />
      <span className="sr-only">Language: English</span>
    </Button>
  );
}
