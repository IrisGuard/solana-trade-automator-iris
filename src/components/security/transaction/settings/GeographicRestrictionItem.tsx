
import React from "react";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GeographicRestrictionSettings } from "../GeographicRestrictionSettings";

export function GeographicRestrictionItem() {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Geographic Restrictions</AccordionTrigger>
      <GeographicRestrictionSettings />
    </AccordionItem>
  );
}
