
import React from "react";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TransactionDelaySettings } from "../TransactionDelaySettings";
import { useLanguage } from "@/hooks/use-language";

export function TransactionDelayItem() {
  const { t } = useLanguage();
  
  return (
    <AccordionItem value="transaction-delay">
      <AccordionTrigger>
        {t("security.transactionDelay.title", "Transaction Delay")}
      </AccordionTrigger>
      <TransactionDelaySettings />
    </AccordionItem>
  );
}
