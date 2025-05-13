
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PlatformGuide() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Οδηγός Χρήσης Πλατφόρμας</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Πώς να συνδέσω το πορτοφόλι μου;</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Για να συνδέσετε το Phantom wallet σας:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Βεβαιωθείτε ότι έχετε εγκαταστήσει το Phantom Wallet στον browser σας</li>
                  <li>Πατήστε το κουμπί "Σύνδεση με Wallet" στην αρχική σελίδα ή το κουμπί "Connect Wallet" στο header</li>
                  <li>Στο παράθυρο που θα εμφανιστεί, επιλέξτε το Phantom και εγκρίνετε τη σύνδεση</li>
                  <li>Εάν σας ζητηθεί, εισάγετε τον κωδικό του πορτοφολιού σας για να το ξεκλειδώσετε</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-2">Σημείωση: Η πλατφόρμα μας υποστηρίζει προς το παρόν μόνο το Phantom Wallet.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Πώς να ρυθμίσω το Trading Bot;</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Για να ρυθμίσετε το trading bot:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Συνδεθείτε με το πορτοφόλι σας</li>
                  <li>Μεταβείτε στην καρτέλα "Trading Bot" από το μενού</li>
                  <li>Επιλέξτε το token για το οποίο θέλετε να λειτουργήσει το bot</li>
                  <li>Καθορίστε τις παραμέτρους:</li>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ποσό συναλλαγής (πόσο SOL θα χρησιμοποιεί)</li>
                    <li>Stop Loss (% απώλειας που θα ενεργοποιήσει πώληση)</li>
                    <li>Take Profit (% κέρδους που θα ενεργοποιήσει πώληση)</li>
                  </ul>
                  <li>Πατήστε "Εκκίνηση Bot" για να ξεκινήσει</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Πώς να παρακολουθώ τις συναλλαγές μου;</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Για να παρακολουθείτε τις συναλλαγές σας:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Μεταβείτε στην καρτέλα "Συναλλαγές" από το πλευρικό μενού</li>
                  <li>Εδώ θα βρείτε όλες τις συναλλαγές που έχουν πραγματοποιηθεί από το πορτοφόλι σας</li>
                  <li>Μπορείτε να φιλτράρετε τις συναλλαγές με βάση:</li>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Τύπο συναλλαγής (αγορά, πώληση)</li>
                    <li>Χρονικό διάστημα</li>
                    <li>Token</li>
                  </ul>
                  <li>Κάθε συναλλαγή περιλαμβάνει πληροφορίες όπως ποσό, τιμή, ημερομηνία και κατάσταση</li>
                  <li>Μπορείτε να δείτε περισσότερες λεπτομέρειες πατώντας σε μια συγκεκριμένη συναλλαγή</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Τι είναι το API Vault;</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Το API Vault είναι ένα ασφαλές σύστημα αποθήκευσης των API keys σας:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Επιτρέπει την αποθήκευση API keys από διάφορα ανταλλακτήρια κρυπτονομισμάτων</li>
                  <li>Τα κλειδιά κρυπτογραφούνται και αποθηκεύονται με ασφάλεια στη βάση δεδομένων</li>
                  <li>Το bot μπορεί να χρησιμοποιήσει αυτά τα κλειδιά για να εκτελεί συναλλαγές εκ μέρους σας</li>
                  <li>Μπορείτε να ελέγχετε πότε θα ξεκλειδώνετε το vault για χρήση και πότε θα το κλειδώνετε ξανά</li>
                  <li>Μπορείτε να προσθέσετε, να αφαιρέσετε και να διαχειριστείτε τα API keys σας οποιαδήποτε στιγμή</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>Τι είναι το Maker Bot;</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Το Maker Bot είναι ένα ειδικό trading bot που:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Δημιουργεί εντολές αγοράς και πώλησης (maker orders) για να αυξήσει τη ρευστότητα ενός token</li>
                  <li>Μπορεί να ρυθμιστεί να λειτουργεί με τυχαία χρονικά διαστήματα μεταξύ συναλλαγών</li>
                  <li>Σας επιτρέπει να καθορίσετε πόσοι "market makers" θα λειτουργούν παράλληλα</li>
                  <li>Σας επιτρέπει να ενεργοποιήσετε λειτουργία "boost price" για να επηρεάσετε την τιμή του token</li>
                  <li>Παρέχει προσομοίωση για να δοκιμάσετε τις ρυθμίσεις σας πριν χρησιμοποιήσετε πραγματικά κεφάλαια</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Σημείωση: Η χρήση του Maker Bot θα πρέπει να γίνεται με προσοχή και σύμφωνα με τους κανονισμούς της αγοράς.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger>Ασφάλεια πλατφόρμας</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Η πλατφόρμα μας παρέχει υψηλό επίπεδο ασφάλειας:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Όλες οι συνδέσεις γίνονται με κρυπτογράφηση SSL/TLS</li>
                  <li>Τα ευαίσθητα δεδομένα όπως API keys είναι κρυπτογραφημένα στη βάση δεδομένων</li>
                  <li>Το πορτοφόλι σας δεν αποθηκεύεται ποτέ στους διακομιστές μας, μόνο η διεύθυνσή του</li>
                  <li>Οι συναλλαγές απαιτούν πάντα την έγκρισή σας μέσω του Phantom Wallet</li>
                  <li>Έχουμε υλοποιήσει μηχανισμούς προστασίας από brute force και άλλες επιθέσεις</li>
                  <li>Η πρόσβαση στο API Vault απαιτεί επανάληψη του κωδικού σας για επιπλέον προστασία</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Συμβουλή: Πάντα να αποσυνδέεστε από την πλατφόρμα όταν δεν τη χρησιμοποιείτε.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  );
}
