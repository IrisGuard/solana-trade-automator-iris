
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home, 
  BarChart2, 
  Wallet, 
  Shield, 
  FileText, 
  Settings,
  Bell,
  List
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function PlatformGuide() {
  return (
    <div className="p-4 space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-2">Επισκόπηση Solana Trade Automator</h3>
        <p className="text-muted-foreground">
          Το Solana Trade Automator είναι μια προηγμένη πλατφόρμα αυτοματοποίησης συναλλαγών στο δίκτυο Solana.
          Σας επιτρέπει να δημιουργείτε, να διαχειρίζεστε και να παρακολουθείτε αυτοματοποιημένα bots
          συναλλαγών, διατηρώντας παράλληλα ασφαλή τα API κλειδιά και τα κρυπτονομίσματά σας.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Κύριες Λειτουργίες</h3>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-5 w-5" />
              Αρχική Σελίδα
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm">
            <p>
              Στην αρχική σελίδα μπορείτε να δείτε μια γενική επισκόπηση της πλατφόρμας, 
              να συνδέσετε το πορτοφόλι σας και να έχετε γρήγορη πρόσβαση στα κύρια χαρακτηριστικά.
              Περιλαμβάνει συνοπτικά στοιχεία για το υπόλοιπό σας, τα tokens που κατέχετε και 
              πρόσφατες συναλλαγές.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm">
            <p>
              Το Dashboard παρέχει λεπτομερή επισκόπηση των συναλλαγών σας, των bots και της απόδοσής τους.
              Περιλαμβάνει διαγράμματα και γραφήματα για την οπτικοποίηση των δεδομένων και 
              σας επιτρέπει να παρακολουθείτε την πρόοδο των στρατηγικών σας.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <List className="h-5 w-5" />
              Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm">
            <p>
              Η σελίδα Tokens σας επιτρέπει να διαχειρίζεστε και να παρακολουθείτε τα tokens του Solana
              που κατέχετε. Παρέχει πληροφορίες για τις τιμές, τα υπόλοιπα και το ιστορικό αξίας.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm">
            <p>
              Στη σελίδα Wallet μπορείτε να διαχειριστείτε το πορτοφόλι Solana σας, να δείτε λεπτομερείς
              πληροφορίες για τα υπόλοιπά σας και να διαχειριστείτε τις ρυθμίσεις του πορτοφολιού σας.
              Περιλαμβάνει επίσης καρτέλες για τη διαχείριση του trading bot και την προσομοίωση στρατηγικών.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Συναλλαγές
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm">
            <p>
              Η σελίδα Συναλλαγών παρέχει ένα πλήρες ιστορικό όλων των συναλλαγών σας στο δίκτυο Solana.
              Μπορείτε να φιλτράρετε, να ταξινομήσετε και να αναζητήσετε συναλλαγές, καθώς και να δείτε
              λεπτομερείς πληροφορίες για κάθε συναλλαγή.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Ασφάλεια
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm">
            <p>
              Η σελίδα Ασφάλειας σας επιτρέπει να διαχειρίζεστε όλες τις ρυθμίσεις ασφαλείας της πλατφόρμας.
              Περιλαμβάνει το API Vault για την ασφαλή αποθήκευση κλειδιών API, ρυθμίσεις two-factor authentication,
              διαχείριση συνεδριών και ρυθμίσεις ασφάλειας συναλλαγών.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Ειδοποιήσεις
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm">
            <p>
              Η σελίδα Ειδοποιήσεων εμφανίζει όλες τις ειδοποιήσεις συστήματος και τις ειδοποιήσεις που 
              σχετίζονται με τις συναλλαγές σας και τα trading bots. Μπορείτε να ρυθμίσετε προτιμήσεις
              για τον τρόπο λήψης των ειδοποιήσεων.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ρυθμίσεις
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm">
            <p>
              Στη σελίδα Ρυθμίσεων μπορείτε να διαχειριστείτε τις γενικές ρυθμίσεις του λογαριασμού σας,
              τις προτιμήσεις διεπαφής χρήστη, τις ειδοποιήσεις και άλλες παραμέτρους της πλατφόρμας.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section>
        <h3 className="text-lg font-semibold mb-2">Αναλυτική Λειτουργία Trading Bot</h3>
        <p className="mb-4 text-sm">
          Το κύριο Trading Bot της πλατφόρμας παρέχει προηγμένες δυνατότητες αυτοματοποιημένων συναλλαγών στο Solana blockchain.
        </p>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Βασικές Λειτουργίες</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Επιλογή Token:</span> Επιλέξτε από τα διαθέσιμα tokens για αυτοματοποιημένες συναλλαγές.</li>
              <li><span className="font-medium">Ρύθμιση Ποσού Συναλλαγής:</span> Ορίστε το ποσό που θα χρησιμοποιεί το bot για κάθε συναλλαγή.</li>
              <li><span className="font-medium">Stop Loss:</span> Αυτόματη πώληση όταν η τιμή πέσει κάτω από ένα καθορισμένο όριο.</li>
              <li><span className="font-medium">Take Profit:</span> Αυτόματη πώληση όταν η τιμή φτάσει ένα καθορισμένο στόχο κέρδους.</li>
              <li><span className="font-medium">Μέγιστος Αριθμός Συναλλαγών:</span> Ρυθμίστε ένα ανώτατο όριο συναλλαγών για το bot.</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Διαχείριση Bot</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Εκκίνηση Bot:</span> Ενεργοποιεί το bot που θα παρακολουθεί τις τιμές και θα εκτελεί συναλλαγές.</li>
              <li><span className="font-medium">Διακοπή Bot:</span> Απενεργοποιεί το bot και ακυρώνει όλες τις εκκρεμείς εντολές.</li>
              <li><span className="font-medium">Παρακολούθηση Κατάστασης:</span> Προβολή της τρέχουσας κατάστασης του bot, των ενεργών εντολών, και των τιμών.</li>
              <li><span className="font-medium">Ιστορικό Συναλλαγών Bot:</span> Παρακολούθηση όλων των συναλλαγών που έχει εκτελέσει το bot.</li>
            </ul>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="text-lg font-semibold mb-2">Λειτουργία Maker Bot</h3>
        <p className="mb-4 text-sm">
          Το Maker Bot είναι ένα εξειδικευμένο bot που δημιουργεί και διαχειρίζεται εντολές στην αγορά για να παρέχει ρευστότητα και να επωφεληθεί από τα spreads.
        </p>

        <div className="border rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-2">Ρυθμίσεις Maker Bot</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><span className="font-medium">Προσομοίωση:</span> Δοκιμάστε το bot σε περιβάλλον προσομοίωσης χωρίς πραγματικά κεφάλαια.</li>
            <li><span className="font-medium">Αριθμός Makers:</span> Ορίστε πόσους makers θα χρησιμοποιεί το bot ταυτόχρονα.</li>
            <li><span className="font-medium">Καθυστέρηση:</span> Ρυθμίστε την ελάχιστη και μέγιστη καθυστέρηση μεταξύ των συναλλαγών.</li>
            <li><span className="font-medium">Ποσά Συναλλαγών:</span> Καθορίστε τα ποσά tokens και SOL που θα χρησιμοποιούνται σε κάθε συναλλαγή.</li>
            <li><span className="font-medium">Επιλογή DEX:</span> Επιλέξτε το αποκεντρωμένο χρηματιστήριο για τις συναλλαγές.</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Price Boost</h4>
          <p className="text-sm mb-2">
            Η λειτουργία Price Boost επιτρέπει στοχευμένες αγορές για να αυξηθεί η τιμή του token.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><span className="font-medium">Ποσοστό Αύξησης:</span> Ορίστε το επιθυμητό ποσοστό αύξησης της τιμής.</li>
            <li><span className="font-medium">Εκτέλεση Boost:</span> Ενεργοποιήστε την αύξηση της τιμής με το πάτημα ενός κουμπιού.</li>
          </ul>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="text-lg font-semibold mb-2">API Vault</h3>
        <p className="mb-4 text-sm">
          Το API Vault είναι ένα βασικό χαρακτηριστικό ασφαλείας που σας επιτρέπει να αποθηκεύετε με ασφάλεια και να διαχειρίζεστε κλειδιά API για διάφορες υπηρεσίες. 
        </p>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Κύρια χαρακτηριστικά:</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><span className="font-medium">Κρυπτογράφηση:</span> Τα κλειδιά κρυπτογραφούνται με βάση τον κύριο κωδικό πρόσβασης για μέγιστη ασφάλεια.</li>
            <li><span className="font-medium">Αυτόματο Κλείδωμα:</span> Το vault κλειδώνεται αυτόματα μετά από περίοδο αδράνειας.</li>
            <li><span className="font-medium">Διαχείριση Κλειδιών:</span> Προσθήκη, επεξεργασία, διαγραφή και οργάνωση κλειδιών.</li>
            <li><span className="font-medium">Σύνδεση API:</span> Σύνδεση και αποσύνδεση κλειδιών για χρήση στην πλατφόρμα.</li>
            <li><span className="font-medium">Εισαγωγή/Εξαγωγή:</span> Δυνατότητες εισαγωγής και εξαγωγής κλειδιών με ασφάλεια.</li>
            <li><span className="font-medium">Ρυθμίσεις Σύνδεσης:</span> Προσαρμογή των ρυθμίσεων RPC και API endpoints.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
