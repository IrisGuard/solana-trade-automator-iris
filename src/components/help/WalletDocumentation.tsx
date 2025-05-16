
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, Info, Shield, AlertTriangle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export function WalletDocumentation() {
  const { t } = useTranslation();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Πορτοφόλι Solana (Wallet)</h3>
        <p className="text-muted-foreground mb-4">
          Αναλυτικός οδηγός για τη σύνδεση, διαχείριση και επίλυση προβλημάτων του πορτοφολιού σας
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Σύνδεση Πορτοφολιού
          </CardTitle>
          <CardDescription>
            Οδηγίες για τη σύνδεση του Phantom Wallet με την εφαρμογή
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Η σύνδεση του πορτοφολιού σας είναι απαραίτητη για να χρησιμοποιήσετε τις λειτουργίες της εφαρμογής.
            Ακολουθήστε τα παρακάτω βήματα για να συνδέσετε το Phantom Wallet:
          </p>

          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li>
              <span className="font-medium">Εγκαταστήστε το Phantom Wallet:</span>
              <ul className="list-disc list-inside ml-6 text-muted-foreground">
                <li>Επισκεφθείτε το <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center">phantom.app <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Εγκαταστήστε την επέκταση για Chrome, Firefox ή Brave</li>
                <li>Δημιουργήστε ένα νέο πορτοφόλι ή εισάγετε ένα υπάρχον</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Στην εφαρμογή μας:</span>
              <ul className="list-disc list-inside ml-6 text-muted-foreground">
                <li>Πατήστε το κουμπί "Σύνδεση Πορτοφολιού" στην κεφαλίδα</li>
                <li>Επιβεβαιώστε τη σύνδεση στο αναδυόμενο παράθυρο του Phantom</li>
                <li>Εγκρίνετε την πρόσβαση στο δημόσιο κλειδί του πορτοφολιού σας</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Μετά τη σύνδεση:</span>
              <ul className="list-disc list-inside ml-6 text-muted-foreground">
                <li>Θα εμφανιστεί η διεύθυνση του πορτοφολιού σας</li>
                <li>Θα φορτωθεί το υπόλοιπο SOL και τα tokens σας</li>
                <li>Θα έχετε πρόσβαση στις λειτουργίες trading και διαχείρισης</li>
              </ul>
            </li>
          </ol>
          
          <Alert className="bg-primary/10 border-primary/30">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              {t("wallet.connectionInstructions")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Αντιμετώπιση Προβλημάτων
          </CardTitle>
          <CardDescription>
            Λύσεις για κοινά προβλήματα με το πορτοφόλι
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="issue-1">
              <AccordionTrigger className="text-left">
                Το Phantom Wallet δεν εντοπίζεται
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p>Αυτό συμβαίνει όταν η επέκταση Phantom δεν είναι εγκατεστημένη ή δεν είναι ενεργοποιημένη:</p>
                <ol className="list-decimal list-inside ml-4 space-y-2 text-muted-foreground">
                  <li>Βεβαιωθείτε ότι έχετε εγκαταστήσει την επέκταση Phantom</li>
                  <li>Ελέγξτε αν η επέκταση είναι ενεργοποιημένη στον browser σας</li>
                  <li>Κάντε ανανέωση της σελίδας (F5 ή Ctrl+R)</li>
                  <li>Αν το πρόβλημα παραμένει, δοκιμάστε να κλείσετε και να ανοίξετε ξανά τον browser</li>
                </ol>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => window.open("https://phantom.app", "_blank")}
                >
                  Εγκατάσταση Phantom <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-2">
              <AccordionTrigger className="text-left">
                Σφάλμα "PublicKey" κατά τη σύνδεση
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p>Αυτό το σφάλμα εμφανίζεται όταν υπάρχει πρόβλημα με την επεξεργασία του κλειδιού του πορτοφολιού:</p>
                <ol className="list-decimal list-inside ml-4 space-y-2 text-muted-foreground">
                  <li>Αποσυνδεθείτε από το Phantom Wallet (από την επέκταση)</li>
                  <li>Κάντε ανανέωση της σελίδας</li>
                  <li>Συνδεθείτε ξανά στο Phantom Wallet</li>
                  <li>Δοκιμάστε να συνδεθείτε ξανά στην εφαρμογή μας</li>
                </ol>
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Αν το πρόβλημα παραμένει, καθαρίστε τα δεδομένα της εφαρμογής από τις Ρυθμίσεις &gt; Ασφάλεια &gt; Εκκαθάριση Δεδομένων
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-3">
              <AccordionTrigger className="text-left">
                Το υπόλοιπο δεν εμφανίζεται σωστά
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p>Εάν το υπόλοιπο του πορτοφολιού σας ή τα tokens δεν εμφανίζονται σωστά:</p>
                <ol className="list-decimal list-inside ml-4 space-y-2 text-muted-foreground">
                  <li>Πατήστε το κουμπί ανανέωσης στην καρτέλα του πορτοφολιού</li>
                  <li>Ελέγξτε τη σύνδεση στο δίκτυο (πρέπει να είστε συνδεδεμένοι στο Internet)</li>
                  <li>Βεβαιωθείτε ότι έχετε επιλέξει το σωστό δίκτυο (Mainnet)</li>
                  <li>Δοκιμάστε να συνδεθείτε ξανά με το πορτοφόλι σας</li>
                </ol>
                <p className="text-muted-foreground text-sm mt-2">
                  Σημείωση: Η εμφάνιση των υπολοίπων μπορεί να καθυστερήσει έως και 30 δευτερόλεπτα λόγω των API calls
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="issue-4">
              <AccordionTrigger className="text-left">
                Αποτυχία επανασύνδεσης μετά από ανανέωση σελίδας
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p>Αν η αυτόματη επανασύνδεση αποτύχει μετά από ανανέωση της σελίδας:</p>
                <ol className="list-decimal list-inside ml-4 space-y-2 text-muted-foreground">
                  <li>Βεβαιωθείτε ότι το Phantom Wallet είναι ξεκλείδωτο</li>
                  <li>Ελέγξτε αν έχετε δώσει άδεια για αυτόματη επανασύνδεση στο Phantom</li>
                  <li>Προσπαθήστε να συνδεθείτε χειροκίνητα πατώντας το κουμπί σύνδεσης</li>
                </ol>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="text-sm font-medium">Τεχνικές πληροφορίες:</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Η εφαρμογή αποθηκεύει την κατάσταση σύνδεσης στο localStorage. Εάν υπάρχει πρόβλημα,
                    μπορείτε να καθαρίσετε τα δεδομένα εκτελώντας το παρακάτω στην κονσόλα του browser:
                  </p>
                  <div className="bg-background p-2 rounded mt-1 flex justify-between items-center">
                    <code className="text-xs">localStorage.removeItem('walletConnected')</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5" 
                      onClick={() => copyToClipboard("localStorage.removeItem('walletConnected')")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Ασφάλεια Πορτοφολιού
          </CardTitle>
          <CardDescription>
            Πληροφορίες για την ασφαλή χρήση του πορτοφολιού σας
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Η προστασία του πορτοφολιού σας είναι εξαιρετικά σημαντική. Ακολουθήστε τις παρακάτω οδηγίες για να διασφαλίσετε την ασφάλεια των κρυπτονομισμάτων σας:
          </p>

          <div className="space-y-3">
            <div className="p-3 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-md">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                Μην μοιράζεστε το seed phrase
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ποτέ μην μοιραστείτε το seed phrase (φράση ανάκτησης) του πορτοφολιού σας με κανέναν, ούτε με την υποστήριξη της εφαρμογής μας. Θα πρέπει να το φυλάσσετε offline σε ασφαλές μέρος.
              </p>
            </div>

            <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 rounded-md">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-500" />
                Χρησιμοποιήστε κωδικό πρόσβασης
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ενεργοποιήστε τον κωδικό πρόσβασης στο Phantom Wallet για επιπλέον ασφάλεια και ενεργοποιήστε την αυτόματη αποσύνδεση αν δεν το χρησιμοποιείτε για μεγάλο χρονικό διάστημα.
              </p>
            </div>

            <div className="p-3 border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 rounded-md">
              <h4 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                Επαληθεύετε τις συναλλαγές
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Πάντα να ελέγχετε προσεκτικά τις λεπτομέρειες των συναλλαγών πριν τις εγκρίνετε στο Phantom Wallet. Επαληθεύστε τις διευθύνσεις και τα ποσά.
              </p>
            </div>
          </div>

          <Alert variant="default" className="bg-primary/10 border-primary/30">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription>
              Η εφαρμογή μας δεν αποθηκεύει ποτέ το ιδιωτικό κλειδί ή το seed phrase του πορτοφολιού σας. 
              Όλες οι συναλλαγές απαιτούν πάντα την έγκρισή σας μέσω του Phantom Wallet.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Διαχείριση Συναλλαγών</CardTitle>
          <CardDescription>
            Πληροφορίες για τις συναλλαγές και τα tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Μετά τη σύνδεση του πορτοφολιού σας, μπορείτε να διαχειριστείτε τα tokens και τις συναλλαγές σας:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-md">
              <h4 className="font-medium mb-2">Προβολή Tokens</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Επιλέξτε την καρτέλα "Tokens" για να δείτε όλα τα tokens σας</li>
                <li>Εμφανίζεται η τρέχουσα αξία σε SOL και USD</li>
                <li>Μπορείτε να δείτε το ιστορικό τιμών και τα στατιστικά</li>
              </ul>
            </div>

            <div className="p-4 border rounded-md">
              <h4 className="font-medium mb-2">Συναλλαγές</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Στην επισκόπηση εμφανίζονται οι πρόσφατες συναλλαγές</li>
                <li>Μπορείτε να φιλτράρετε κατά τύπο (αγορά/πώληση)</li>
                <li>Κάθε συναλλαγή περιλαμβάνει λεπτομέρειες όπως ημερομηνία, ποσό και κατάσταση</li>
              </ul>
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <h4 className="font-medium mb-2">Συνδέσεις με Trading Bot</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Το πορτοφόλι σας είναι άμεσα συνδεδεμένο με τις λειτουργίες του Trading Bot:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Επιλέξτε tokens από το πορτοφόλι σας για αυτόματη διαπραγμάτευση</li>
              <li>Ορίστε τα όρια συναλλαγών βάσει του διαθέσιμου υπολοίπου σας</li>
              <li>Παρακολουθήστε τις συναλλαγές που εκτελούνται από το bot</li>
              <li>Εγκρίνετε κάθε συναλλαγή πριν εκτελεστεί για μέγιστη ασφάλεια</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
