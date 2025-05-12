
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
          Το Solana Trade Automator είναι μια πλατφόρμα αυτοματοποίησης συναλλαγών στο δίκτυο Solana.
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
        <h3 className="text-lg font-semibold mb-2">API Vault</h3>
        <p className="mb-4">
          Το API Vault είναι ένα βασικό χαρακτηριστικό ασφαλείας που σας επιτρέπει να αποθηκεύετε με ασφάλεια και να διαχειρίζεστε κλειδιά API για διάφορες υπηρεσίες. 
        </p>
        <div className="space-y-2">
          <p className="text-sm"><strong>Κύρια χαρακτηριστικά:</strong></p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Κρυπτογράφηση κλειδιών με βάση κωδικό πρόσβασης</li>
            <li>Αυτόματη ανίχνευση ληγμένων ή άκυρων κλειδιών</li>
            <li>Οργάνωση κλειδιών ανά υπηρεσία</li>
            <li>Στατιστικά και αναφορές για τα αποθηκευμένα κλειδιά</li>
            <li>Δυνατότητες εισαγωγής και εξαγωγής</li>
            <li>Επαναφορά κλειδιών από διάφορες πηγές</li>
          </ul>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="text-lg font-semibold mb-2">Trading Bot</h3>
        <p className="mb-4">
          Το trading bot σας επιτρέπει να αυτοματοποιήσετε τις στρατηγικές συναλλαγών σας στο Solana blockchain.
        </p>
        <div className="space-y-2">
          <p className="text-sm"><strong>Δυνατότητες:</strong></p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Προσαρμόσιμες στρατηγικές συναλλαγών</li>
            <li>Ρύθμιση παραμέτρων όπως ποσά συναλλαγών και ζεύγη νομισμάτων</li>
            <li>Προσομοίωση για δοκιμή στρατηγικών</li>
            <li>Αναλύσεις απόδοσης και αναφορές</li>
            <li>Προγραμματισμένες συναλλαγές</li>
            <li>Πολλαπλά bots με διαφορετικές στρατηγικές</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
