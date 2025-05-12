
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BotExplanationSection() {
  return (
    <section className="py-6">
      <h2 className="text-3xl font-bold text-center mb-8">Πώς Λειτουργεί το Trading Bot</h2>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
          <TabsTrigger value="features">Δυνατότητες</TabsTrigger>
          <TabsTrigger value="security">Ασφάλεια</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Εισαγωγή στο Solana Trading Bot</CardTitle>
                <CardDescription>Αυτοματοποιημένο trading στο Solana blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Το Solana Trading Bot είναι ένα ισχυρό εργαλείο που σχεδιάστηκε για να απλοποιήσει τις συναλλαγές στο Solana blockchain, επιτρέποντάς σας να εκτελείτε αυτοματοποιημένες στρατηγικές συναλλαγών με βάση προκαθορισμένες παραμέτρους.</p>
                
                <p>Σε αντίθεση με τα παραδοσιακά χρηματιστήρια που κλείνουν, το Solana blockchain λειτουργεί 24/7, επιτρέποντας στο bot να εκμεταλλευτεί ευκαιρίες συναλλαγών οποιαδήποτε στιγμή της ημέρας.</p>
                
                <p>Με την ενσωμάτωση προηγμένων αλγορίθμων και πρόσβαση σε δεδομένα πραγματικού χρόνου, το bot παρακολουθεί συνεχώς την αγορά και εκτελεί συναλλαγές βάσει των κριτηρίων που έχετε ορίσει.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Βασικά Χαρακτηριστικά</CardTitle>
                <CardDescription>Τι καθιστά το Solana Trading Bot ξεχωριστό</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mt-1">✓</span>
                    <span>Ολοκληρωμένη παρακολούθηση τιμών με δεδομένα πραγματικού χρόνου</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mt-1">✓</span>
                    <span>Προσαρμοζόμενες στρατηγικές συναλλαγών με πολλαπλές παραμέτρους</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mt-1">✓</span>
                    <span>Λειτουργία προσομοίωσης για δοκιμή στρατηγικών χωρίς κίνδυνο</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mt-1">✓</span>
                    <span>Ενσωμάτωση με Phantom Wallet για ασφαλείς συναλλαγές</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mt-1">✓</span>
                    <span>Αναλυτικά ιστορικά δεδομένα και αναφορές απόδοσης</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mt-1">✓</span>
                    <span>Ασφαλής διαχείριση κλειδιών API μέσω του API Vault</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="features">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maker Bot</CardTitle>
                <CardDescription>Δημιουργία ρευστότητας στην αγορά</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Το Maker Bot σχεδιάστηκε για να παρέχει ρευστότητα σε ζεύγη συναλλαγών, διευκολύνοντας τις συναλλαγές με τη δημιουργία εντολών αγοράς και πώλησης. Τα βασικά χαρακτηριστικά περιλαμβάνουν:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Προσαρμόσιμος αριθμός makers</li>
                  <li>Ευέλικτες ρυθμίσεις καθυστέρησης</li>
                  <li>Ρυθμίσεις ποσών συναλλαγών</li>
                  <li>Δυνατότητα ενίσχυσης τιμών</li>
                  <li>Πλήρες ιστορικό συναλλαγών</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Προσομοίωση & Backtesting</CardTitle>
                <CardDescription>Δοκιμή στρατηγικών χωρίς κίνδυνο</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Οι λειτουργίες προσομοίωσης σας επιτρέπουν να δοκιμάσετε τις στρατηγικές συναλλαγών σας πριν αναλάβετε πραγματικό κίνδυνο. Το backtesting χρησιμοποιεί ιστορικά δεδομένα για να αξιολογήσει την απόδοση των στρατηγικών σας.</p>
                <div className="mt-3 pt-3 border-t">
                  <h4 className="font-semibold mb-1">Διαθέσιμα εργαλεία:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Προσομοίωση αγοράς με πραγματικά δεδομένα</li>
                    <li>Backtesting με ιστορικά δεδομένα</li>
                    <li>Ανάλυση απόδοσης και στατιστικά</li>
                    <li>Σύγκριση πολλαπλών στρατηγικών</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Vault</CardTitle>
                <CardDescription>Ασφαλής διαχείριση κλειδιών API</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Το API Vault παρέχει ένα ασφαλές περιβάλλον για την αποθήκευση και διαχείριση των κλειδιών API σας για διάφορες υπηρεσίες Solana. Όλα τα κλειδιά αποθηκεύονται με κρυπτογράφηση για μέγιστη ασφάλεια.</p>
                <ul className="list-disc pl-5 mt-3 space-y-1">
                  <li>Κρυπτογραφημένη αποθήκευση κλειδιών</li>
                  <li>Εύκολη σύνδεση/αποσύνδεση API</li>
                  <li>Εισαγωγή/Εξαγωγή κλειδιών</li>
                  <li>Προτεινόμενες συνδέσεις API</li>
                  <li>Προσαρμοζόμενες ρυθμίσεις RPC</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Ασφάλεια του Trading Bot</CardTitle>
              <CardDescription>Πώς προστατεύουμε τις συναλλαγές και τα δεδομένα σας</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ασφάλεια Πορτοφολιού</h3>
                <p>Το trading bot δεν αποθηκεύει ποτέ τις ιδιωτικές κλείδες του πορτοφολιού σας. Χρησιμοποιούμε το Phantom Wallet ως ασφαλή διεπαφή για την έγκριση των συναλλαγών, διασφαλίζοντας ότι έχετε πλήρη έλεγχο κάθε στιγμή.</p>
                
                <h3 className="text-xl font-semibold">Κρυπτογραφημένα Κλειδιά API</h3>
                <p>Όλα τα κλειδιά API αποθηκεύονται με ισχυρή κρυπτογράφηση και είναι προσβάσιμα μόνο μετά από ξεκλείδωμα του API Vault. Κανένα κλειδί δεν αποστέλλεται ποτέ σε εξωτερικούς διακομιστές.</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Έλεγχος Συναλλαγών</h3>
                <p>Όλες οι συναλλαγές απαιτούν την έγκρισή σας μέσω του Phantom Wallet πριν την εκτέλεση, παρέχοντας ένα επιπλέον επίπεδο ασφάλειας και ελέγχου.</p>
                
                <h3 className="text-xl font-semibold">Προστασία Δεδομένων</h3>
                <p>Τα δεδομένα συναλλαγών και οι ρυθμίσεις αποθηκεύονται τοπικά στον περιηγητή σας. Χρησιμοποιούμε συνδέσεις HTTPS για όλες τις επικοινωνίες με τα APIs του Solana, διασφαλίζοντας την προστασία των δεδομένων σας κατά τη μεταφορά.</p>
                
                <div className="mt-4 p-3 bg-primary/10 rounded border border-primary/20">
                  <p className="text-sm font-medium">Συνιστούμε να χρησιμοποιείτε πάντα τη λειτουργία προσομοίωσης για να δοκιμάσετε τις στρατηγικές σας πριν χρησιμοποιήσετε πραγματικά κεφάλαια.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
