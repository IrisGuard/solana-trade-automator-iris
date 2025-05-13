
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function SimulationResultsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Αποτελέσματα Προσομοίωσης</CardTitle>
        <CardDescription>Μετρήσεις απόδοσης από προσομοιώσεις</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Συνολική Απόδοση", value: "+12.8%", positive: true },
            { label: "Μέγιστη Πτώση", value: "-4.3%", positive: false },
            { label: "Ποσοστό Επιτυχίας", value: "68%", positive: true },
            { label: "Δείκτης Sharpe", value: "1.74", positive: true }
          ].map((stat, i) => (
            <Card key={i} className="border border-muted">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Τελευταία Προσομοίωση</h4>
            <p className="text-sm text-muted-foreground">Εκτελέστηκε πριν 2 ώρες</p>
          </div>
          
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <p>Στρατηγική</p>
              <p className="font-medium">Grid Trading</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Ζεύγος Συναλλαγών</p>
              <p className="font-medium">SOL/USDC</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Περίοδος</p>
              <p className="font-medium">Τελευταία Εβδομάδα</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Αρχικό Κεφάλαιο</p>
              <p className="font-medium">1.000 USDC</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Τελικό Κεφάλαιο</p>
              <p className="font-medium text-green-400">1.128 USDC</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Εκτελεσμένες Συναλλαγές</p>
              <p className="font-medium">47</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" className="w-full">Προβολή Αναλυτικής Αναφοράς</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
