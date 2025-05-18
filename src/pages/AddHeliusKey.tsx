
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { resetHeliusKeys } from "@/utils/resetHeliusKeys";
import { heliusService } from "@/services/helius/HeliusService";
import { toast } from "sonner";

const HELIUS_API_KEY = "ddb32813-1f4b-459d-8964-310b1b73a053";
const USER_ID = "af88a598-eb23-4281-a549-f923d1b14bed";

export default function AddHeliusKeyPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [keyStatus, setKeyStatus] = useState<"pending" | "valid" | "invalid">("pending");
  
  // Check if key is already working
  useEffect(() => {
    const checkExistingKey = async () => {
      try {
        // Try to get a transaction to see if the key is working
        const testResult = await heliusService.checkApiKey(HELIUS_API_KEY);
        if (testResult) {
          setKeyStatus("valid");
          setIsSuccess(true);
          toast.success("Το κλειδί Helius API λειτουργεί ήδη!");
        } else {
          setKeyStatus("invalid");
        }
      } catch (error) {
        console.error("Error checking existing key:", error);
        setKeyStatus("invalid");
      }
    };
    
    checkExistingKey();
  }, []);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetHeliusKeys(USER_ID, HELIUS_API_KEY);
      
      if (result) {
        setIsSuccess(true);
        // Verify the key actually works
        const isWorking = await heliusService.checkApiKey(HELIUS_API_KEY);
        
        if (isWorking) {
          setKeyStatus("valid");
          toast.success("Το κλειδί Helius API προστέθηκε επιτυχώς!");
        } else {
          setKeyStatus("invalid");
          toast.warning("Το κλειδί προστέθηκε αλλά ο έλεγχος απέτυχε");
        }
      } else {
        toast.error("Αποτυχία προσθήκης κλειδιού Helius API");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την προσθήκη του κλειδιού Helius:", error);
      toast.error("Σφάλμα κατά την προσθήκη του κλειδιού Helius");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Προσθήκη Helius API Key</CardTitle>
          <CardDescription>
            Προσθήκη του κλειδιού Helius API στο Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-md bg-slate-50">
            <div>
              <p className="font-medium">Κλειδί προς προσθήκη:</p>
              <p className="font-mono text-sm">{HELIUS_API_KEY}</p>
            </div>
            <Badge 
              variant={
                keyStatus === "valid" ? "success" : 
                keyStatus === "invalid" ? "destructive" : 
                "outline"
              }
            >
              {keyStatus === "valid" ? "Έγκυρο" : 
               keyStatus === "invalid" ? "Μη έγκυρο" : 
               "Εκκρεμεί"}
            </Badge>
          </div>
          
          {keyStatus === "valid" ? (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-md">
              <Check className="h-5 w-5 text-green-600" />
              <span>Το κλειδί Helius API είναι ήδη έγκυρο και λειτουργεί!</span>
            </div>
          ) : (
            <Button
              onClick={handleReset}
              disabled={isResetting}
              className="w-full"
              variant="default"
              size="lg"
            >
              {isResetting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Προσθήκη κλειδιού...
                </>
              ) : (
                <>
                  {keyStatus === "invalid" ? (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  ) : null}
                  Προσθήκη κλειδιού Helius API
                </>
              )}
            </Button>
          )}
          
          {isSuccess && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-md">
              <Check className="h-5 w-5 text-green-600" />
              <span>Το κλειδί Helius προστέθηκε επιτυχώς στη βάση δεδομένων!</span>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Επόμενα βήματα:</h3>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Μετά την προσθήκη του κλειδιού, το σύστημα θα το χρησιμοποιήσει αυτόματα</li>
              <li>Δεν χρειάζεται επανεκκίνηση της εφαρμογής</li>
              <li>Μπορείτε να κλείσετε αυτή τη σελίδα όταν είστε έτοιμοι</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
