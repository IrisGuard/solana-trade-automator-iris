
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function SimulationSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ρυθμίσεις Προσομοίωσης</CardTitle>
        <CardDescription>Διαμόρφωση εικονικού περιβάλλοντος συναλλαγών</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Συνθήκες Αγοράς</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm">Ανοδική</Button>
            <Button variant="default" size="sm">Ουδέτερη</Button>
            <Button variant="outline" size="sm">Καθοδική</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sim-volatility">Μεταβλητότητα Αγοράς: 25%</Label>
          <Slider 
            id="sim-volatility"
            min={5} 
            max={50} 
            step={5}
            defaultValue={[25]}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sim-liquidity">Προσομοιωμένη Ρευστότητα: Μέτρια</Label>
          <Select defaultValue="medium">
            <SelectTrigger id="sim-liquidity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Χαμηλή</SelectItem>
              <SelectItem value="medium">Μέτρια</SelectItem>
              <SelectItem value="high">Υψηλή</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sim-slippage">Ανοχή Slippage: 1.5%</Label>
          <Slider 
            id="sim-slippage"
            min={0.1} 
            max={3.0} 
            step={0.1}
            defaultValue={[1.5]}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sim-speed">Ταχύτητα Προσομοίωσης</Label>
          <Select defaultValue="normal">
            <SelectTrigger id="sim-speed">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Αργή (1x)</SelectItem>
              <SelectItem value="normal">Κανονική (10x)</SelectItem>
              <SelectItem value="fast">Γρήγορη (100x)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="sim-logs" defaultChecked />
          <Label htmlFor="sim-logs">Ενεργοποίηση αναλυτικών καταγραφών</Label>
        </div>

        <Button className="w-full">
          Έναρξη Νέας Προσομοίωσης
        </Button>
      </CardContent>
    </Card>
  );
}
