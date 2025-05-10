
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FaqSection() {
  return (
    <section className="pt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Συχνές Ερωτήσεις</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Πώς λειτουργεί το Trading Bot;</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Τα bots μας αναλύουν σε πραγματικό χρόνο τη ροή συναλλαγών στο Solana blockchain, 
              εντοπίζουν ευκαιρίες με βάση τους αλγορίθμους AI και εκτελούν αυτόματα συναλλαγές 
              σύμφωνα με τις στρατηγικές που έχετε επιλέξει. Κάθε συναλλαγή απαιτεί την έγκρισή σας 
              για μέγιστη ασφάλεια.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Είναι ασφαλή τα κεφάλαιά μου;</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Απόλυτα! Τα bots λειτουργούν με περιορισμένα δικαιώματα και δεν έχουν ποτέ 
              πρόσβαση στο ιδιωτικό σας κλειδί. Όλες οι συναλλαγές πρέπει να 
              εγκριθούν από το πορτοφόλι σας και μπορείτε να διακόψετε τη λειτουργία 
              του bot ανά πάσα στιγμή.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Τι χρεώσεις υπάρχουν;</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Υπάρχουν τα κανονικά network fees του Solana για κάθε συναλλαγή.
              Η πλατφόρμα μας χρεώνει ένα μικρό ποσοστό (2%) μόνο στα κερδοφόρα trades, 
              εξασφαλίζοντας ότι κερδίζουμε μόνο όταν κερδίζετε κι εσείς.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Πως ξεκινάω;</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Συνδέστε το Solana wallet σας, περιηγηθείτε στο Bot Control,
              επιλέξτε ένα token για trading, ορίστε τις παραμέτρους στρατηγικής 
              και ενεργοποιήστε το bot σας. Μπορείτε να παρακολουθείτε την απόδοσή του 
              σε πραγματικό χρόνο από το dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
