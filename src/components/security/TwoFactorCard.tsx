
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const TwoFactorCard = () => {
  return (
    <Card className="card-highlight">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Επαλήθευση Δύο Παραγόντων</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">Προσθέστε επιπλέον επίπεδο ασφάλειας στο λογαριασμό σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa-sms" className="text-foreground">SMS Verification</Label>
            <p className="text-sm text-muted-foreground">
              Receive verification code via SMS
            </p>
          </div>
          <Switch id="2fa-sms" className="data-[state=checked]:bg-primary" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa-app" className="text-foreground">Authenticator App</Label>
            <p className="text-sm text-muted-foreground">
              Use an authenticator app like Google Authenticator or Authy
            </p>
          </div>
          <Switch id="2fa-app" className="data-[state=checked]:bg-primary" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa-email" className="text-foreground">Email Verification</Label>
            <p className="text-sm text-muted-foreground">
              Receive verification code via Email
            </p>
          </div>
          <Switch id="2fa-email" className="data-[state=checked]:bg-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
