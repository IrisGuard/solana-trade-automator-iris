
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutoInitializeStatus } from "@/components/database/AutoInitializeStatus";
import { HeliusConnectionStatus } from "@/components/monitoring/HeliusConnectionStatus";

export function StatusSection() {
  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle>Κατάσταση Συστήματος</CardTitle>
      </CardHeader>
      <CardContent>
        <AutoInitializeStatus />
        <HeliusConnectionStatus />
      </CardContent>
    </Card>
  );
}
