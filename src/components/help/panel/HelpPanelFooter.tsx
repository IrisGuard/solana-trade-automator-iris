
import React from "react";
import { DrawerFooter } from "@/components/ui/drawer";

export function HelpPanelFooter() {
  return (
    <DrawerFooter className="border-t">
      <div className="text-center text-sm text-muted-foreground">
        <p>Για περισσότερες πληροφορίες, επικοινωνήστε με την ομάδα υποστήριξης.</p>
        <p className="mt-1">
          <kbd className="px-2 py-0.5 rounded bg-muted border mr-2">Alt+Shift+H</kbd> 
          Άνοιγμα βοήθειας από οπουδήποτε στην εφαρμογή
        </p>
      </div>
    </DrawerFooter>
  );
}
