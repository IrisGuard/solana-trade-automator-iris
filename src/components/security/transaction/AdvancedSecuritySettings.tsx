
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TransactionDelaySettings } from "./TransactionDelaySettings";
import { TransactionNotificationSettings } from "./TransactionNotificationSettings";
import { GeographicRestrictionSettings } from "./GeographicRestrictionSettings";

export function AdvancedSecuritySettings() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Προηγμένες Ρυθμίσεις Ασφαλείας</h3>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Καθυστέρηση Συναλλαγών</AccordionTrigger>
          <TransactionDelaySettings />
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Ειδοποιήσεις Συναλλαγών</AccordionTrigger>
          <TransactionNotificationSettings />
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Γεωγραφικοί Περιορισμοί</AccordionTrigger>
          <GeographicRestrictionSettings />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
