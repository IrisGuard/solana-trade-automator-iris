
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
              Τα bots μας παρακολουθούν συνεχώς τις τιμές των tokens στο Solana blockchain 
              και εκτελούν αυτόματα συναλλαγές με βάση τις στρατηγικές και τους κανόνες 
              που έχετε ορίσει.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Είναι ασφαλή τα κεφάλαιά μου;</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Ναι, τα bots λειτουργούν με περιορισμένα δικαιώματα και δεν έχουν ποτέ 
              πρόσβαση στο ιδιωτικό σας κλειδί. Όλες οι συναλλαγές πρέπει να 
              εγκριθούν από το πορτοφόλι σας.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Τι fees υπάρχουν;</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Υπάρχουν τα κανονικά network fees του Solana για κάθε συναλλαγή.
              Η πλατφόρμα μας χρεώνει ένα μικρό ποσοστό μόνο στα κερδοφόρα trades.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Πως ξεκινάω;</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Απλώς συνδέστε το Solana wallet σας, περιηγηθείτε στο Bot Control,
              επιλέξτε μια στρατηγική και παραμετροποιήστε το bot σας. 
              Μπορείτε να το ενεργοποιήσετε άμεσα!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
