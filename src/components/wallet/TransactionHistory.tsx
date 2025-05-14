
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { TransactionList } from "./transaction/TransactionList";
import { TransactionFooter } from "./transaction/TransactionFooter";
import { Transaction } from "@/types/transaction";

export function TransactionHistory({ walletAddress, limit = 10 }: { walletAddress: string | null, limit?: number }) {
  const [isLoading] = useState(false);
  // Empty array with explicit Transaction type
  const transactions: Transaction[] = []; 
  
  const getStatusBadgeClass = (status: string) => {
    return status === 'Success' 
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Send')) return '↑';
    if (type.includes('Receive')) return '↓';
    if (type.includes('Swap')) return '↔';
    return '•';
  };

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
            <div>
              <TransactionList 
                transactions={transactions}
                isLoading={isLoading}
                walletAddress={walletAddress}
                limit={limit}
                getStatusBadgeClass={getStatusBadgeClass}
                getTypeIcon={getTypeIcon}
              />
              <TransactionFooter 
                walletAddress={walletAddress} 
                showViewAll={true} 
                transactions={transactions} 
              />
            </div>
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
