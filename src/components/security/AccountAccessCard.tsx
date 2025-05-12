
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const AccountAccessCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

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
        <div className="space-y-2">
          <Label htmlFor="current-password">Τρέχων Κωδικός Πρόσβασης</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Εισάγετε τον τρέχοντα κωδικό σας"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
              </span>
            </Button>
          </div>
        </div>
        
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
