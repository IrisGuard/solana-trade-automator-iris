
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export function SimulationTab() {
  return (
    <TabsContent value="simulation">
      <Card>
        <CardHeader>
          <CardTitle>Trade Simulation</CardTitle>
          <CardDescription>
            Δοκιμάστε στρατηγικές trading σε περιβάλλον προσομοίωσης
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted/50 rounded-full p-6 mb-4">
              <PlayCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Προσομοίωση Trading</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Δοκιμάστε διαφορετικές στρατηγικές και παραμέτρους χωρίς να ρισκάρετε πραγματικά κεφάλαια. 
              Προσομοιώστε διαφορετικές συνθήκες αγοράς και βελτιστοποιήστε τις στρατηγικές σας.
            </p>
            <Button>Έναρξη Προσομοίωσης</Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
