
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpPanel } from "./HelpPanel";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";

export function HelpButton() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Keyboard shortcut for help (Alt+Shift+H)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        setIsHelpOpen(true);
        
        // Notify user about the help panel opening
        toast.info("Βοηθός πλατφόρμας", {
          description: "Ο βοηθός πλατφόρμας άνοιξε με το συνδυασμό Alt+Shift+H"
        });
      }
      
      // Alt+Shift+R για επαναφορά έκτακτης ανάγκης (δεν ενεργοποιείται εδώ, μόνο για κοινοποίηση)
      if (event.altKey && event.shiftKey && event.key === 'R' && !isHelpOpen) {
        toast.info("Λειτουργία Επαναφοράς", {
          description: "Για να ενεργοποιήσετε τη λειτουργία επαναφοράς, πατήστε Alt+Shift+R",
          duration: 5000
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHelpOpen]);
  
  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 animate-pulse hover:animate-none"
        size="icon"
        onClick={() => setIsHelpOpen(true)}
        aria-label="Άνοιγμα βοηθού πλατφόρμας"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
      
      <div className="fixed bottom-[76px] right-6 text-xs text-center opacity-70 pointer-events-none">
        <span className="bg-background/80 px-2 py-1 rounded-full shadow-sm">
          Alt+Shift+H
        </span>
      </div>
      
      <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
