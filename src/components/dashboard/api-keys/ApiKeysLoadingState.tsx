
import React from 'react';
import { KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ApiKeysLoadingState() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Κλειδιά API
        </CardTitle>
        <CardDescription>Φόρτωση κλειδιών API...</CardDescription>
      </CardHeader>
      <CardContent className="h-[100px] flex items-center justify-center">
        <div className="animate-pulse">Φόρτωση...</div>
      </CardContent>
    </Card>
  );
}
