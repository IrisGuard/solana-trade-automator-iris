
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { TransactionDelayItem } from "./settings/TransactionDelayItem";
import { TransactionNotificationItem } from "./settings/TransactionNotificationItem";
import { GeographicRestrictionItem } from "./settings/GeographicRestrictionItem";

export function AdvancedSecuritySettings() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Προηγμένες Ρυθμίσεις Ασφαλείας</h3>
      
      <Accordion type="single" collapsible className="w-full">
        <TransactionDelayItem />
        <TransactionNotificationItem />
        <GeographicRestrictionItem />
      </Accordion>
    </div>
  );
}
