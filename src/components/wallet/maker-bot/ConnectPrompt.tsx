
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Loader, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useErrorReporting } from "@/hooks/useErrorReporting";

interface ConnectPromptProps {
  handleConnectWallet: () => void;
  isConnecting?: boolean;
  isPhantomInstalled?: boolean;
  size?: "default" | "large";
}

export function ConnectPrompt({ 
  handleConnectWallet, 
  isConnecting = false, 
  isPhantomInstalled = true,
  size = "default" 
}: ConnectPromptProps) {
  const { reportError } = useErrorReporting();
  
  const safeConnect = () => {
    try {
      if (!isPhantomInstalled) {
        toast.error("Το Phantom Wallet δεν είναι εγκατεστημένο", {
          description: "Παρακαλώ εγκαταστήστε το Phantom Wallet για να συνδεθείτε",
          duration: 5000
        });
        
        reportError(new Error("Προσπάθεια σύνδεσης χωρίς εγκατεστημένο Phantom Wallet"));
        return;
      }
      
      if (isConnecting) {
        toast.info("Η σύνδεση είναι σε εξέλιξη, παρακαλώ περιμένετε", {
          duration: 3000
        });
        return;
      }
      
      console.log("ConnectPrompt: Initiating wallet connection");
      handleConnectWallet();
    } catch (error) {
      console.error("Σφάλμα κατά τη σύνδεση του wallet:", error);
      toast.error("Σφάλμα κατά τη σύνδεση του wallet");
      
      // Αναφορά του πραγματικού σφάλματος
      if (error instanceof Error) {
        reportError(error);
      } else {
        reportError(new Error("Άγνωστο σφάλμα κατά τη σύνδεση του wallet"));
      }
    }
  };

  return (
    <Card className={size === "large" ? "border-dashed border-2 border-primary" : ""}>
      <CardHeader className="text-center">
        <CardTitle>Σύνδεση με το Phantom Wallet</CardTitle>
        <CardDescription>Συνδεθείτε για να χρησιμοποιήσετε το trading bot</CardDescription>
      </CardHeader>
      <CardContent className={`flex flex-col items-center ${size === "large" ? "py-10" : "py-6"}`}>
        {size === "large" && (
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
        )}
        <Button 
          onClick={safeConnect} 
          className={`flex items-center gap-2 ${size === "large" ? "text-base px-6 py-5 h-auto" : ""}`}
          size={size === "large" ? "lg" : "default"}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader className={`animate-spin ${size === "large" ? "h-5 w-5" : "h-4 w-4"}`} />
              <span>Γίνεται σύνδεση...</span>
            </>
          ) : (
            <>
              <Wallet className={size === "large" ? "h-5 w-5" : "h-4 w-4"} />
              <span>Σύνδεση με Phantom Wallet</span>
            </>
          )}
        </Button>
        
        {!isPhantomInstalled && (
          <div className="mt-4 text-sm text-muted-foreground space-y-3">
            <p>Χρειάζεστε το Phantom Wallet για να συνδεθείτε.</p>
            <a 
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-medium inline-flex items-center gap-1 hover:text-primary/90 transition-colors"
            >
              Κάντε εγκατάσταση από το phantom.app
              <ExternalLink className="h-3 w-3" />
            </a>
            
            <div className="p-3 bg-muted/50 rounded-md mt-2 text-xs">
              <p className="font-medium mb-1">Οδηγίες εγκατάστασης:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Επισκεφθείτε το <strong>phantom.app</strong></li>
                <li>Κατεβάστε το extension για τον browser σας</li>
                <li>Ακολουθήστε τις οδηγίες εγκατάστασης</li>
                <li>Δημιουργήστε ή εισάγετε ένα wallet</li>
                <li>Επιστρέψτε σε αυτή τη σελίδα και συνδεθείτε</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
