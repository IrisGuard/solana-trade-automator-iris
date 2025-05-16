
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function HistoryTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Δεν υπάρχει ιστορικό συναλλαγών bot αυτή τη στιγμή.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
