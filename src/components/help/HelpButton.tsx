
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { HelpPanel } from "./HelpPanel";

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg flex items-center justify-center p-0 bg-primary text-primary-foreground hover:bg-primary/90 z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Βοήθεια"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
      
      <HelpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
