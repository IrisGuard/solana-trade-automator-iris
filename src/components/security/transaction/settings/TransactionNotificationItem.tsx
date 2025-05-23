
import React from "react";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TransactionNotificationSettings } from "../TransactionNotificationSettings";

export function TransactionNotificationItem() {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger>Transaction Notifications</AccordionTrigger>
      <TransactionNotificationSettings />
    </AccordionItem>
  );
}
