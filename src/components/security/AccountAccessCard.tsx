
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
    <Card className="card-highlight">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Πρόσβαση Λογαριασμού</CardTitle>
        </div>
        <CardDescription>Διαχείριση των μεθόδων πρόσβασης στο λογαριασμό σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-foreground">Τρέχων Κωδικός Πρόσβασης</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Εισάγετε τον τρέχοντα κωδικό σας"
              className="pr-10 bg-background/60"
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
            <p className="font-medium text-foreground">Πρόσβαση με Κωδικό</p>
            <p className="text-sm text-muted-foreground">Ενεργοποιήστε ή απενεργοποιήστε την πρόσβαση με κωδικό</p>
          </div>
          <Switch id="password-access" className="data-[state=checked]:bg-primary" />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Βιομετρική Πρόσβαση</p>
            <p className="text-sm text-muted-foreground">Ενεργοποιήστε ή απενεργοποιήστε τη βιομετρική πρόσβαση</p>
          </div>
          <Switch id="biometric-access" className="data-[state=checked]:bg-primary" />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Κοινωνική Πρόσβαση</p>
            <p className="text-sm text-muted-foreground">Ενεργοποιήστε ή απενεργοποιήστε την πρόσβαση μέσω κοινωνικών λογαριασμών</p>
          </div>
          <Switch id="social-access" className="data-[state=checked]:bg-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
