
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SimulationTab() {
  return (
    <TabsContent value="simulation" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Προσομοίωση</CardTitle>
          <CardDescription>
            Δοκιμάστε στρατηγικές σε ιστορικά δεδομένα
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Η λειτουργία προσομοίωσης είναι υπό κατασκευή.</p>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
