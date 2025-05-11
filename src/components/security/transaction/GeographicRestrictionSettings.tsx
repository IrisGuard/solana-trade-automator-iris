
import React from "react";
import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function GeographicRestrictionSettings() {
  return (
    <AccordionContent>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Ενεργοποίηση Γεωγραφικών Περιορισμών</h4>
            <p className="text-xs text-muted-foreground">Περιορισμός συναλλαγών βάσει τοποθεσίας</p>
          </div>
          <Switch />
        </div>
        
        <div className="space-y-2">
          <Label>Επιτρεπόμενες Χώρες</Label>
          <TooltipProvider>
            <ToggleGroup type="multiple" className="flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="gr" aria-label="Ελλάδα" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                    🇬🇷 GR
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Ελλάδα</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="cy" aria-label="Κύπρος" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                    🇨🇾 CY
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Κύπρος</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="de" aria-label="Γερμανία" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                    🇩🇪 DE
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Γερμανία</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="fr" aria-label="Γαλλία" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                    🇫🇷 FR
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Γαλλία</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="uk" aria-label="Ηνωμένο Βασίλειο" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                    🇬🇧 UK
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Ηνωμένο Βασίλειο</TooltipContent>
              </Tooltip>
              
              <Button variant="outline" size="sm">+ Προσθήκη</Button>
            </ToggleGroup>
          </TooltipProvider>
        </div>
      </div>
    </AccordionContent>
  );
}
