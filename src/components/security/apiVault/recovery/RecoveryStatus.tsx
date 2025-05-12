
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCcw, AlertTriangle, CheckCircle, Loader2, Database, Plus } from "lucide-react";

interface RecoveryStatusProps {
  isRecovering: boolean;
  recoverySuccess: boolean;
  recoveryError: string | null;
  recoveredCount: number;
  onRecoverClick: () => void;
  onAddDemoKeys?: () => void;
}

export const RecoveryStatus: React.FC<RecoveryStatusProps> = ({
  isRecovering,
  recoverySuccess,
  recoveryError,
  recoveredCount,
  onRecoverClick,
  onAddDemoKeys
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Κατάσταση Ανάκτησης</h3>
          <p className="text-sm text-muted-foreground">
            Αποτελέσματα από την τελευταία προσπάθεια ανάκτησης
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onAddDemoKeys && (
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={onAddDemoKeys}
            >
              <Plus className="h-4 w-4" />
              <span>Προσθήκη Κλειδιών</span>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            disabled={isRecovering}
            onClick={onRecoverClick}
          >
            {isRecovering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span>Ανάκτηση</span>
          </Button>
        </div>
      </div>

      {isRecovering ? (
        <Card className="p-4 flex items-center gap-3 bg-muted">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p>Σάρωση αποθηκευμένων δεδομένων για κλειδιά API...</p>
        </Card>
      ) : recoveryError ? (
        <Card className="p-4 flex items-center gap-3 bg-red-50 border-red-200">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <p className="font-medium text-red-700">Σφάλμα ανάκτησης</p>
            <p className="text-sm text-red-600">{recoveryError}</p>
          </div>
        </Card>
      ) : recoverySuccess && recoveredCount > 0 ? (
        <Card className="p-4 flex items-center gap-3 bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-medium text-green-700">Επιτυχής Ανάκτηση</p>
            <p className="text-sm text-green-600">Ανακτήθηκαν {recoveredCount} API κλειδιά</p>
          </div>
        </Card>
      ) : (
        <Card className="p-4 flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          <p>Έτοιμο για ανάκτηση κλειδιών API από τη συσκευή σας</p>
        </Card>
      )}
    </div>
  );
};
