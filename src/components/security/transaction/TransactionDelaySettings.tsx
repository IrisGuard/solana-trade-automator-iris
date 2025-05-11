
import React from "react";
import { AccordionContent } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function TransactionDelaySettings() {
  return (
    <AccordionContent>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Ενεργοποίηση Καθυστέρησης</h4>
            <p className="text-xs text-muted-foreground">Προσθέτει χρόνο αναμονής πριν την εκτέλεση συναλλαγών</p>
          </div>
          <Switch />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="delay-time">Χρόνος Καθυστέρησης (λεπτά)</Label>
          <Select defaultValue="5">
            <SelectTrigger id="delay-time">
              <SelectValue placeholder="Επιλέξτε χρόνο" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 λεπτό</SelectItem>
              <SelectItem value="5">5 λεπτά</SelectItem>
              <SelectItem value="15">15 λεπτά</SelectItem>
              <SelectItem value="30">30 λεπτά</SelectItem>
              <SelectItem value="60">1 ώρα</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </AccordionContent>
  );
}
