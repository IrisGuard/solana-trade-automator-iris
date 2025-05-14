
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Οδηγίες Χρήσης</CardTitle>
          <CardDescription>
            Χρήσιμες πληροφορίες για τη χρήση της πλατφόρμας
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Πώς συνδέομαι με το Phantom Wallet;</AccordionTrigger>
              <AccordionContent>
                <p>
                  Για να συνδεθείτε με το Phantom Wallet, ακολουθήστε τα παρακάτω βήματα:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>Εγκαταστήστε το Phantom Wallet από το <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-primary underline">phantom.app</a></li>
                  <li>Δημιουργήστε ένα νέο πορτοφόλι ή εισάγετε ένα υπάρχον</li>
                  <li>Επιστρέψτε στην εφαρμογή και πατήστε το κουμπί "Σύνδεση με Phantom Wallet"</li>
                  <li>Εγκρίνετε τη σύνδεση στο παράθυρο του Phantom Wallet</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Πώς λειτουργεί το Trading Bot;</AccordionTrigger>
              <AccordionContent>
                <p>
                  Το Trading Bot της πλατφόρμας μας χρησιμοποιεί προηγμένους αλγόριθμους για να εκτελεί
                  αυτοματοποιημένες συναλλαγές στο δίκτυο Solana. Ακολουθεί τη στρατηγική που έχετε ορίσει
                  και παρακολουθεί την αγορά 24/7 για να αναγνωρίσει ευκαιρίες.
                </p>
                <p className="mt-2">
                  Για να ρυθμίσετε το Trading Bot:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>Μεταβείτε στην καρτέλα "Trading Bot"</li>
                  <li>Επιλέξτε ένα token από τη λίστα</li>
                  <li>Ορίστε τις παραμέτρους της στρατηγικής σας</li>
                  <li>Πατήστε "Έναρξη Bot" για να ξεκινήσει η λειτουργία του</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Πώς μπορώ να δω το ιστορικό των συναλλαγών μου;</AccordionTrigger>
              <AccordionContent>
                <p>
                  Για να δείτε το ιστορικό των συναλλαγών σας:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>Συνδεθείτε με το wallet σας</li>
                  <li>Στο κεντρικό dashboard, θα βρείτε την καρτέλα "Πρόσφατες Συναλλαγές"</li>
                  <li>Για πιο αναλυτικό ιστορικό, επιλέξτε "Προβολή Όλων"</li>
                </ol>
                <p className="mt-2">
                  Επίσης, μπορείτε να δείτε τις συναλλαγές που εκτελέστηκαν από το Trading Bot στην
                  καρτέλα "Παρακολούθηση" του Trading Bot.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Πώς μπορώ να επικοινωνήσω με την υποστήριξη;</AccordionTrigger>
              <AccordionContent>
                <p>
                  Για οποιαδήποτε βοήθεια ή απορία, μπορείτε να επικοινωνήσετε με την ομάδα υποστήριξης μέσω:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2">
                  <li>Email: support@solanatrade.app</li>
                  <li>Φόρμα επικοινωνίας στη σελίδα "Επικοινωνία"</li>
                </ul>
                <p className="mt-2">
                  Η ομάδα υποστήριξης είναι διαθέσιμη καθημερινά από τις 9:00 έως τις 21:00.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
