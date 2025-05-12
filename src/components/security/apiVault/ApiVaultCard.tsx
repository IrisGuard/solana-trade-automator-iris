
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { KeyRecoveryView } from "./KeyRecoveryView";

export const ApiVaultCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Κλειδιά API</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Κλειδιά API που έχουν αποθηκευτεί στη συσκευή σας.
        </p>
      </CardHeader>
      <CardContent>
        <KeyRecoveryView />
      </CardContent>
    </Card>
  );
}
