
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SimulationTab() {
  return (
    <TabsContent value="simulation">
      <Card>
        <CardHeader>
          <CardTitle>Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Simulation functionality will be implemented soon
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
