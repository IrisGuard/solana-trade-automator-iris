
import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { AlertTriangle, HelpCircle, RefreshCw } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

export function WalletErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const [showHelp, setShowHelp] = React.useState(false);
  
  // Ensure the error object is properly sanitized with all properties as strings
  const sanitizedError = sanitizeErrorObject(error);
  const errorMessage = sanitizedError.message || 'Unknown error';
  
  // Έλεγχος για συγκεκριμένα σφάλματα
  const isSubstringError = typeof errorMessage === 'string' && errorMessage.includes('substring is not a function');
  const isPublicKeyError = typeof errorMessage === 'string' && errorMessage.includes('Objects are not valid as a React child') && 
                          errorMessage.includes('PublicKey');
  const isConnectionError = typeof errorMessage === 'string' && (errorMessage.includes('Failed to fetch') || 
                           errorMessage.includes('Network Error'));
  const isPermissionError = typeof errorMessage === 'string' && (errorMessage.includes('User rejected') || 
                           errorMessage.includes('permission'));
  
  // Προσδιορισμός του κατάλληλου μηνύματος σφάλματος
  const getErrorMessage = () => {
    if (isSubstringError) {
      return 'Προέκυψε πρόβλημα με την επεξεργασία της διεύθυνσης του πορτοφολιού';
    } else if (isPublicKeyError) {
      return 'Προέκυψε πρόβλημα με την επεξεργασία του αντικειμένου PublicKey';
    } else if (isConnectionError) {
      return 'Δεν ήταν δυνατή η σύνδεση με το δίκτυο Solana';
    } else if (isPermissionError) {
      return 'Απορρίφθηκε η άδεια σύνδεσης με το πορτοφόλι';
    } else {
      return String(errorMessage);
    }
  };

  // Προτεινόμενες ενέργειες ανάλογα με τον τύπο του σφάλματος
  const getSuggestedAction = () => {
    if (isSubstringError || isPublicKeyError) {
      return 'Δοκιμάστε να αποσυνδεθείτε από το Phantom Wallet και να συνδεθείτε ξανά.';
    } else if (isConnectionError) {
      return 'Ελέγξτε τη σύνδεσή σας στο διαδίκτυο και βεβαιωθείτε ότι οι διακομιστές του Solana λειτουργούν.';
    } else if (isPermissionError) {
      return 'Βεβαιωθείτε ότι έχετε επιτρέψει την πρόσβαση στο πορτοφόλι σας και προσπαθήστε ξανά.';
    } else {
      return 'Δοκιμάστε να ανανεώσετε τη σελίδα και να συνδεθείτε ξανά.';
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-md p-6 space-y-6 border rounded-lg shadow-lg">
        <div className="flex items-center justify-center text-amber-500 mb-2">
          <AlertTriangle size={48} />
        </div>
        
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Πρόβλημα με το Wallet</h2>
          <p className="text-sm text-muted-foreground">
            Παρουσιάστηκε ένα σφάλμα κατά τη σύνδεση με το wallet.
          </p>
        </div>
        
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="font-medium text-red-800 dark:text-red-300">
            {getErrorMessage()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {getSuggestedAction()}
          </p>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full flex items-center gap-2" onClick={resetErrorBoundary}>
            <RefreshCw className="h-4 w-4" />
            Προσπάθεια Επανασύνδεσης
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={() => setShowHelp(true)}
          >
            <HelpCircle className="h-4 w-4" />
            Οδηγίες Αντιμετώπισης
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            Επιστροφή στην Αρχική
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          Αν το πρόβλημα παραμένει, επικοινωνήστε με την υποστήριξη παρέχοντας το παραπάνω μήνυμα σφάλματος.
        </p>
      </div>
      
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Αντιμετώπιση Προβλημάτων Πορτοφολιού</DialogTitle>
            <DialogDescription>
              Οδηγίες για την επίλυση συχνών προβλημάτων με το Phantom Wallet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <h3 className="font-medium">1. Βεβαιωθείτε ότι το Phantom είναι εγκατεστημένο και ενημερωμένο</h3>
              <p className="text-sm text-muted-foreground">
                Επισκεφθείτε το <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary underline">phantom.app</a> για να εγκαταστήσετε ή να ενημερώσετε την επέκταση.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">2. Ξεκλειδώστε το Phantom Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Βεβαιωθείτε ότι έχετε ξεκλειδώσει το πορτοφόλι σας και ότι είναι συνδεδεμένο στο Solana Mainnet.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">3. Καθαρίστε τα δεδομένα της εφαρμογής</h3>
              <p className="text-sm text-muted-foreground">
                Εκτελέστε τις παρακάτω εντολές στην κονσόλα του browser (F12 &gt; Console):
              </p>
              <div className="bg-muted p-2 rounded text-xs">
                <code>localStorage.removeItem('walletConnected')</code><br />
                <code>localStorage.removeItem('walletAddress')</code>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">4. Ελέγξτε τις άδειες του Phantom</h3>
              <p className="text-sm text-muted-foreground">
                Ανοίξτε το Phantom Wallet, πηγαίνετε στις Ρυθμίσεις &gt; Συνδεδεμένοι Ιστότοποι και βεβαιωθείτε ότι η εφαρμογή μας έχει άδεια σύνδεσης.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowHelp(false)}>Κλείσιμο</Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowHelp(false);
                window.location.href = '/wallet';
              }}
            >
              Μετάβαση στο Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
