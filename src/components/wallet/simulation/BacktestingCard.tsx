
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BacktestingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtesting</CardTitle>
        <CardDescription>Δοκιμή στρατηγικών σε ιστορικά δεδομένα</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="backtest-strategy">Στρατηγική Συναλλαγών</Label>
          <Select>
            <SelectTrigger id="backtest-strategy">
              <SelectValue placeholder="Επιλογή στρατηγικής" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dca">Μέση Τιμή Κόστους (DCA)</SelectItem>
              <SelectItem value="grid">Grid Trading</SelectItem>
              <SelectItem value="momentum">Momentum Trading</SelectItem>
              <SelectItem value="custom">Προσαρμοσμένη Στρατηγική</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="backtest-pair">Ζεύγος Συναλλαγών</Label>
          <Select>
            <SelectTrigger id="backtest-pair">
              <SelectValue placeholder="Επιλογή ζεύγους" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sol_usdc">SOL/USDC</SelectItem>
              <SelectItem value="btc_usdc">BTC/USDC</SelectItem>
              <SelectItem value="eth_usdc">ETH/USDC</SelectItem>
              <SelectItem value="jup_usdc">JUP/USDC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="backtest-period">Χρονική Περίοδος</Label>
          <Select>
            <SelectTrigger id="backtest-period">
              <SelectValue placeholder="Επιλογή περιόδου" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Τελευταίες 24 Ώρες</SelectItem>
              <SelectItem value="1w">Τελευταία Εβδομάδα</SelectItem>
              <SelectItem value="1m">Τελευταίος Μήνας</SelectItem>
              <SelectItem value="3m">Τελευταίοι 3 Μήνες</SelectItem>
              <SelectItem value="1y">Τελευταίο Έτος</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="backtest-capital">Αρχικό Κεφάλαιο (USDC)</Label>
          <Input id="backtest-capital" type="number" defaultValue="1000" />
        </div>
        
        <Button className="w-full">
          Εκτέλεση Backtesting
        </Button>
      </CardContent>
    </Card>
  );
}
