import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const TwoFactorCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <CardTitle>Επαλήθευση Δύο Παραγόντων</CardTitle>
        </div>
        <CardDescription>Προσθέστε επιπλέον επίπεδο ασφάλειας στο λογαριασμό σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa-sms">SMS Verification</Label>
            <p className="text-sm text-muted-foreground">
              Receive verification code via SMS
            </p>
          </div>
          <Switch id="2fa-sms" disabled />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa-app">Authenticator App</Label>
            <p className="text-sm text-muted-foreground">
              Use an authenticator app like Google Authenticator or Authy
            </p>
          </div>
          <Switch id="2fa-app" disabled />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa-email">Email Verification</Label>
            <p className="text-sm text-muted-foreground">
              Receive verification code via Email
            </p>
          </div>
          <Switch id="2fa-email" disabled />
        </div>
      </CardContent>
    </Card>
  );
};
