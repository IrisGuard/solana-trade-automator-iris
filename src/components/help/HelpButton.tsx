
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpPanel } from "./HelpPanel";
import { HelpCircle } from "lucide-react";

export function HelpButton() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsHelpOpen(true)}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
      
      <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
