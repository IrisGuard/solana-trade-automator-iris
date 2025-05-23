
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
            <h4 className="text-sm font-medium">Enable Geographic Restrictions</h4>
            <p className="text-xs text-muted-foreground">Restrict transactions based on location</p>
          </div>
          <Switch />
        </div>
        
        <div className="space-y-2">
          <Label>Allowed Countries</Label>
          <TooltipProvider>
            <ToggleGroup type="multiple" className="flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="gr" aria-label="Greece" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                    🇬🇷 GR
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Greece</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="cy" aria-label="Cyprus" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                    🇨🇾 CY
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Cyprus</TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>
        </div>
      </div>
    </AccordionContent>
  );
}
