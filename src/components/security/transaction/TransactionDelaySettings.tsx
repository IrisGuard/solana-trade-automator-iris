
import React from "react";
import { AccordionContent } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function TransactionDelaySettings() {
  return (
    <AccordionContent>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Enable Delay</h4>
            <p className="text-xs text-muted-foreground">Adds a waiting period before executing transactions</p>
          </div>
          <Switch />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="delay-time">Delay Time (minutes)</Label>
          <Select defaultValue="5">
            <SelectTrigger id="delay-time">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 minute</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </AccordionContent>
  );
}
