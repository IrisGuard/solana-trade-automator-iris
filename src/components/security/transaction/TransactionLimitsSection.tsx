
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TransactionLimitsSection() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Όρια Συναλλαγών</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="daily-limit">Ημερήσιο Όριο</Label>
          <div className="flex items-center gap-2">
            <Input id="daily-limit" type="number" defaultValue="5000" />
            <Select defaultValue="sol">
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
            <Input id="transaction-limit" type="number" defaultValue="1000" />
            <Select defaultValue="sol">
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
      
      <Button variant="outline" size="sm">
        Αποθήκευση Ορίων
      </Button>
    </div>
  );
}
