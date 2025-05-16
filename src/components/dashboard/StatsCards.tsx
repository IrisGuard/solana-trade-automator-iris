
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Coins, Activity, ArrowUpDown } from "lucide-react";

interface StatsCardsProps {
  solBalance: number;
  tokensCount: number;
}

export function StatsCards({ solBalance, tokensCount }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Υπόλοιπο SOL</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{solBalance?.toFixed(4) || "0"} SOL</div>
          <p className="text-xs text-muted-foreground">
            +2.5% από την προηγούμενη εβδομάδα
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tokens</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tokensCount}</div>
          <p className="text-xs text-muted-foreground">
            {tokensCount > 0 ? "Διαφορετικοί τύποι tokens" : "Δεν υπάρχουν tokens"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Συναλλαγές</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-baseline">
            <div className="text-2xl font-bold">12</div>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Τελευταίες 30 ημέρες
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
