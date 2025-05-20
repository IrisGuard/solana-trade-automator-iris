
import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/SupabaseAuthContext";

interface EmptyApiVaultProps {
  onImportClick: () => void;
  onLockClick: () => void;
  isLocked: boolean;
  onAddKeyClick?: () => void; // Added this prop
  setApiKeys?: React.Dispatch<React.SetStateAction<any[]>>; // Added this prop
}

export function EmptyApiVault({ 
  onImportClick, 
  onLockClick, 
  isLocked,
  onAddKeyClick,
  setApiKeys 
}: EmptyApiVaultProps) {
  const { user } = useAuth();

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
        <Shield className="h-10 w-10 text-muted-foreground" />
        <h2 className="text-xl font-semibold">
          {isLocked ? "Κλειδωμένο API Vault" : "Άδειο API Vault"}
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          {isLocked
            ? "Το API Vault είναι κλειδωμένο για λόγους ασφαλείας. Ξεκλειδώστε το για να διαχειριστείτε τα κλειδιά σας."
            : "Δεν υπάρχουν αποθηκευμένα κλειδιά API. Εισάγετε τα κλειδιά σας για να ξεκινήσετε."}
        </p>
        <div className="flex gap-2 mt-4">
          {!isLocked && (
            <>
              <Button variant="outline" onClick={onImportClick}>
                <Upload className="h-4 w-4 mr-2" />
                Εισαγωγή
              </Button>
              {onAddKeyClick && (
                <Button variant="outline" onClick={onAddKeyClick}>
                  <span className="h-4 w-4 mr-2 text-green-500">+</span>
                  Προσθήκη κλειδιού
                </Button>
              )}
            </>
          )}
          <Button onClick={onLockClick}>
            <Lock className="h-4 w-4 mr-2" />
            {isLocked ? "Ξεκλείδωμα" : "Κλείδωμα"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
