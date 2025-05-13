
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { TransactionList } from "./transaction/TransactionList";
import { TransactionItem } from "./transaction/TransactionItem";
import { TransactionFooter } from "./transaction/TransactionFooter";

export function TransactionHistory() {
  const [isLoading] = useState(false);
  const transactions = []; // Εδώ θα μπορούσαν να φορτωθούν δεδομένα

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ιστορικό Συναλλαγών</CardTitle>
          <CardDescription>Προβολή όλων των δραστηριοτήτων συναλλαγών σας</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              className="w-full mb-4"
              placeholder="Αναζήτηση συναλλαγών..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="transaction-type" className="text-sm font-medium mb-1 block">
                  Τύπος Συναλλαγής:
                </label>
                <Select>
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder="Όλοι οι τύποι" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλοι οι τύποι</SelectItem>
                    <SelectItem value="buy">Αγορά</SelectItem>
                    <SelectItem value="sell">Πώληση</SelectItem>
                    <SelectItem value="swap">Ανταλλαγή</SelectItem>
                    <SelectItem value="transfer">Μεταφορά</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="token-filter" className="text-sm font-medium mb-1 block">
                  Token:
                </label>
                <Select>
                  <SelectTrigger id="token-filter">
                    <SelectValue placeholder="Όλα τα Tokens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλα τα Tokens</SelectItem>
                    <SelectItem value="sol">SOL</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="eth">ETH</SelectItem>
                    <SelectItem value="btc">BTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="date-filter" className="text-sm font-medium mb-1 block">
                  Ημερομηνία:
                </label>
                <Button variant="outline" className="w-full justify-start" id="date-filter">
                  <Calendar className="mr-2 h-4 w-4" />
                  Επιλογή ημερομηνίας
                </Button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : transactions.length > 0 ? (
            <TransactionList>
              {transactions.map((transaction, index) => (
                <TransactionItem key={index} transaction={transaction} />
              ))}
              <TransactionFooter />
            </TransactionList>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Δεν βρέθηκαν συναλλαγές</p>
              <p className="text-sm text-muted-foreground mt-1">
                Συνδέστε το πορτοφόλι σας και πραγματοποιήστε κάποια συναλλαγή για να εμφανιστεί εδώ
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
