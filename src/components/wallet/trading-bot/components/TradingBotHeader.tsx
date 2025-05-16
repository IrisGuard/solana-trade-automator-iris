
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TradingBotHeaderProps {
  activeTab: string;
  botStatus: string;
}

export function TradingBotHeader({ activeTab, botStatus }: TradingBotHeaderProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>
          {activeTab === "settings" && "Ρυθμίσεις Trading Bot"}
          {activeTab === "monitor" && "Παρακολούθηση Bot"}
          {activeTab === "orders" && "Ενεργές Εντολές"}
          {activeTab === "history" && "Ιστορικό Συναλλαγών"}
        </CardTitle>
        <CardDescription>
          {activeTab === "settings" && "Διαμορφώστε τις παραμέτρους του trading bot"}
          {activeTab === "monitor" && "Παρακολουθήστε την απόδοση του bot σε πραγματικό χρόνο"}
          {activeTab === "orders" && "Δείτε τις τρέχουσες εντολές που έχουν τοποθετηθεί από το bot"}
          {activeTab === "history" && "Δείτε το ιστορικό συναλλαγών που έχουν πραγματοποιηθεί από το bot"}
        </CardDescription>
      </CardHeader>
      
      {botStatus === 'error' && (
        <div className="px-6 pb-2">
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Υπήρξε σφάλμα με το bot. Παρακαλώ επανεκκινήστε το ή επικοινωνήστε με την υποστήριξη.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
