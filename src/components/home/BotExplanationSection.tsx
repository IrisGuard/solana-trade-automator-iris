
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, TrendingUp, Database, LineChart } from "lucide-react";

export function BotExplanationSection() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Πώς Λειτουργεί το Trading Bot</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <Bot className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-lg">1. Ανάλυση Δεδομένων</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Το bot παρακολουθεί συνεχώς την αγορά και αναλύει δεδομένα από πολλαπλά DEXs στο Solana,
              αναγνωρίζοντας πρότυπα και τάσεις.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <TrendingUp className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-lg">2. Στρατηγική AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Χρησιμοποιώντας προηγμένους αλγορίθμους AI, το bot εντοπίζει ευκαιρίες συναλλαγών
              που ταιριάζουν με τις παραμέτρους και τους κανόνες που έχετε ορίσει.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Database className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-lg">3. Εκτέλεση Συναλλαγών</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Με την έγκρισή σας, το bot εκτελεί συναλλαγές με βελτιστοποιημένο τρόπο, 
              ελαχιστοποιώντας το slippage και μεγιστοποιώντας την απόδοση.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <LineChart className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-lg">4. Παρακολούθηση & Βελτίωση</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Παρακολουθήστε την απόδοση σε πραγματικό χρόνο και βελτιστοποιήστε τις στρατηγικές σας
              βάσει των αναλυτικών στατιστικών και προτάσεων του συστήματος.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
