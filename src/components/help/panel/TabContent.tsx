
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommandList } from "../CommandList";
import { PlatformGuide } from "../PlatformGuide";
import { HelpSearch } from "../HelpSearch";
import { SolanaDocumentation } from "../SolanaDocumentation";
import { SystemProtectionGuide } from "../SystemProtectionGuide";

export function TabContent() {
  return (
    <ScrollArea className="h-[50vh] overflow-auto">
      <TabsContent value="commands" className="p-0">
        <CommandList />
      </TabsContent>

      <TabsContent value="guide" className="p-0">
        <PlatformGuide />
      </TabsContent>

      <TabsContent value="documentation" className="p-0">
        <SolanaDocumentation />
      </TabsContent>
      
      <TabsContent value="protection" className="p-0">
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">Προστασία & Ασφάλεια Συστήματος</h3>
          <p className="text-muted-foreground mb-4">
            Πλήρης επισκόπηση των μηχανισμών προστασίας, αντιγράφων ασφαλείας και αυτόματης αποκατάστασης της εφαρμογής.
          </p>
          <div className="mt-4">
            <SystemProtectionGuide />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="search" className="p-0">
        <HelpSearch />
      </TabsContent>
    </ScrollArea>
  );
}
