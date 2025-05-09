import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const AccountAccessCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle>Πρόσβαση Λογαριασμού</CardTitle>
        </div>
        <CardDescription>Διαχείριση των μεθόδων πρόσβασης στο λογαριασμό σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Πρόσβαση με Κωδικό</CardTitle>
            <CardDescription className="text-sm">Ενεργοποιήστε ή απενεργοποιήστε την πρόσβαση με κωδικό</CardDescription>
          </div>
          <Switch id="password-access" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Βιομετρική Πρόσβαση</CardTitle>
            <CardDescription className="text-sm">Ενεργοποιήστε ή απενεργοποιήστε τη βιομετρική πρόσβαση</CardDescription>
          </div>
          <Switch id="biometric-access" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Κοινωνική Πρόσβαση</CardTitle>
            <CardDescription className="text-sm">Ενεργοποιήστε ή απενεργοποιήστε την πρόσβαση μέσω κοινωνικών λογαριασμών</CardDescription>
          </div>
          <Switch id="social-access" />
        </div>
      </CardContent>
    </Card>
  );
};
