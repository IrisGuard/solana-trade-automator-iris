
import React from "react";
import { AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function TransactionNotificationSettings() {
  return (
    <AccordionContent>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Ειδοποιήσεις Email</h4>
            <p className="text-xs text-muted-foreground">Λήψη ειδοποιήσεων μέσω email για όλες τις συναλλαγές</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Push Notifications</h4>
            <p className="text-xs text-muted-foreground">Λήψη ειδοποιήσεων στη συσκευή σας</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="space-y-2">
          <Label>Ειδοποίηση για συναλλαγές άνω των:</Label>
          <div className="flex items-center gap-2">
            <Input type="number" defaultValue="100" />
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
    </AccordionContent>
  );
}
