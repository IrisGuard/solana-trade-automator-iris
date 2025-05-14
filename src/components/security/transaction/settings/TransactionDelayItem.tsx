
import React from "react";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TransactionDelaySettings } from "../TransactionDelaySettings";
import { useLanguage } from "@/hooks/use-language";

export function TransactionDelayItem() {
  const { t } = useLanguage();
  
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>{t("security.transactionDelay")}</AccordionTrigger>
      <TransactionDelaySettings />
    </AccordionItem>
  );
}
