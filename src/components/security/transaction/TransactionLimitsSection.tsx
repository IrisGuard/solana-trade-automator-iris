
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactionSecurity } from "./useTransactionSecurity";

export function TransactionLimitsSection() {
  const { 
    transactionSettings, 
    isLoading, 
    saveTransactionLimits 
  } = useTransactionSecurity();
  
  const [maxDailyAmount, setMaxDailyAmount] = useState<number>(5000);
  const [maxTransactionAmount, setMaxTransactionAmount] = useState<number>(1000);
  const [currency, setCurrency] = useState<string>("sol");
  
  useEffect(() => {
    if (transactionSettings) {
      setMaxDailyAmount(Number(transactionSettings.max_daily_amount));
      setMaxTransactionAmount(Number(transactionSettings.max_transaction_amount));
    }
  }, [transactionSettings]);
  
  const handleSave = () => {
    saveTransactionLimits(maxDailyAmount, maxTransactionAmount);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Όρια Συναλλαγών</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="daily-limit">Ημερήσιο Όριο</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="daily-limit" 
              type="number" 
              value={maxDailyAmount}
              onChange={(e) => setMaxDailyAmount(Number(e.target.value))}
              disabled={isLoading}
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Νόμισμα" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sol">SOL</SelectItem>
                <SelectItem value="usdc">USDC</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transaction-limit">Όριο ανά Συναλλαγή</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="transaction-limit" 
              type="number"
              value={maxTransactionAmount}
              onChange={(e) => setMaxTransactionAmount(Number(e.target.value))}
              disabled={isLoading}
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Νόμισμα" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sol">SOL</SelectItem>
                <SelectItem value="usdc">USDC</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Button variant="outline" size="sm" onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Αποθήκευση..." : "Αποθήκευση Ορίων"}
      </Button>
    </div>
  );
}
