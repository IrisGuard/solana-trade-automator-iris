
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ConnectivityStatusProps {
  connected: boolean;
}

export function ConnectivityStatus({ connected }: ConnectivityStatusProps) {
  if (connected) {
    return null;
  }

  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Παρακαλώ συνδέστε το πορτοφόλι σας για να χρησιμοποιήσετε το Trading Bot
      </AlertDescription>
    </Alert>
  );
}
