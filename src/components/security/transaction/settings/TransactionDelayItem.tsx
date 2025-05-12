
import React from "react";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TransactionDelaySettings } from "../TransactionDelaySettings";

export function TransactionDelayItem() {
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Καθυστέρηση Συναλλαγών</AccordionTrigger>
      <TransactionDelaySettings />
    </AccordionItem>
  );
}
