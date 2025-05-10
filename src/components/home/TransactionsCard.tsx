
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { EnhancedTransactionHistory } from "../wallet/EnhancedTransactionHistory";

interface TransactionsCardProps {
  walletAddress: string | null;
  displayAddress: string;
}

export function TransactionsCard({ walletAddress, displayAddress }: TransactionsCardProps) {
  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Πρόσφατες Συναλλαγές</CardTitle>
          <CardDescription>Συνδεθείτε για να δείτε τις συναλλαγές σας</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>Δεν έχετε συνδέσει πορτοφόλι</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <EnhancedTransactionHistory 
      walletAddress={walletAddress}
      limit={5}
      showViewAll={true}
    />
  );
}
