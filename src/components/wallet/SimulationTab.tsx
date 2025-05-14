
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function SimulationTab() {
  return (
    <TabsContent value="simulation">
      <Card>
        <CardHeader>
          <CardTitle>Προσομοίωση</CardTitle>
          <CardDescription>
            Δοκιμάστε τις στρατηγικές σας σε ιστορικά δεδομένα πριν το live trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border-2 border-dashed rounded-md text-center">
            <h3 className="text-lg font-medium mb-2">Προσομοίωση Trading - Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              Δοκιμάστε τις στρατηγικές σας με ιστορικά δεδομένα για να αξιολογήσετε την απόδοσή τους.
              Αυτή η λειτουργία θα είναι διαθέσιμη στην επόμενη αναβάθμιση.
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
