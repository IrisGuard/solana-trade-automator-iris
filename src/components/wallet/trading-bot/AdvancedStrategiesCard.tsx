
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";
import { toast } from "sonner";

interface AdvancedStrategiesCardProps {
  isActive: boolean;
}

export function AdvancedStrategiesCard({ isActive }: AdvancedStrategiesCardProps) {
  const [activeStrategy, setActiveStrategy] = useState("dca");
  const [gridLevels, setGridLevels] = useState(5);
  const [gridSpread, setGridSpread] = useState(2);
  const [dcaInterval, setDcaInterval] = useState("daily");
  const [macdSettings, setMacdSettings] = useState({
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveStrategy = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Η στρατηγική αποθηκεύτηκε");
    }, 800);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Προηγμένες Στρατηγικές</CardTitle>
        <CardDescription>
          Επιλέξτε και διαμορφώστε προηγμένες στρατηγικές συναλλαγών
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeStrategy} onValueChange={setActiveStrategy} className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="dca">DCA</TabsTrigger>
            <TabsTrigger value="grid">Grid Trading</TabsTrigger>
            <TabsTrigger value="macd">MACD</TabsTrigger>
          </TabsList>
          
          {/* DCA Strategy */}
          <TabsContent value="dca" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dca-active">Ενεργοποίηση DCA</Label>
              <Switch id="dca-active" disabled={!isActive} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dca-interval">Συχνότητα αγορών</Label>
              <Select 
                value={dcaInterval} 
                onValueChange={setDcaInterval}
                disabled={!isActive}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε συχνότητα" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Κάθε ώρα</SelectItem>
                  <SelectItem value="daily">Καθημερινά</SelectItem>
                  <SelectItem value="weekly">Εβδομαδιαία</SelectItem>
                  <SelectItem value="biweekly">Κάθε δύο εβδομάδες</SelectItem>
                  <SelectItem value="monthly">Μηνιαία</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dca-amount">Ποσό ανά αγορά (SOL)</Label>
              <Input 
                id="dca-amount"
                type="number" 
                min={0.01}
                step={0.01}
                placeholder="0.1"
                disabled={!isActive}
              />
            </div>
          </TabsContent>
          
          {/* Grid Trading Strategy */}
          <TabsContent value="grid" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="grid-active">Ενεργοποίηση Grid Trading</Label>
              <Switch id="grid-active" disabled={!isActive} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Επίπεδα Grid</Label>
                <span className="font-medium">{gridLevels}</span>
              </div>
              <Slider 
                value={[gridLevels]} 
                min={3} 
                max={10} 
                step={1} 
                onValueChange={([val]) => setGridLevels(val)}
                disabled={!isActive}
              />
              <p className="text-xs text-muted-foreground">
                Περισσότερα επίπεδα = περισσότερες συναλλαγές, μικρότερα κέρδη ανά συναλλαγή
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Εύρος Grid (%)</Label>
                <span className="font-medium">{gridSpread}%</span>
              </div>
              <Slider 
                value={[gridSpread]} 
                min={0.5} 
                max={10} 
                step={0.5} 
                onValueChange={([val]) => setGridSpread(val)}
                disabled={!isActive}
              />
              <p className="text-xs text-muted-foreground">
                Το συνολικό εύρος τιμών που θα καλύψει το grid
              </p>
            </div>
          </TabsContent>
          
          {/* MACD Strategy */}
          <TabsContent value="macd" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="macd-active">Ενεργοποίηση MACD</Label>
              <Switch id="macd-active" disabled={!isActive} />
            </div>
            
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md flex items-start space-x-2 text-sm">
              <Info className="h-4 w-4 mt-0.5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-yellow-800 dark:text-yellow-200">
                Το MACD (Moving Average Convergence Divergence) είναι ένας τεχνικός δείκτης που χρησιμοποιείται για τον εντοπισμό αλλαγών στη δύναμη, την ορμή και την κατεύθυνση μιας τάσης.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Γρήγορη περίοδος</Label>
                <Input 
                  type="number" 
                  value={macdSettings.fastPeriod}
                  onChange={(e) => setMacdSettings({
                    ...macdSettings,
                    fastPeriod: parseInt(e.target.value)
                  })}
                  min={5}
                  max={20}
                  disabled={!isActive}
                />
              </div>
              <div className="space-y-2">
                <Label>Αργή περίοδος</Label>
                <Input 
                  type="number" 
                  value={macdSettings.slowPeriod}
                  onChange={(e) => setMacdSettings({
                    ...macdSettings,
                    slowPeriod: parseInt(e.target.value)
                  })}
                  min={10}
                  max={40}
                  disabled={!isActive}
                />
              </div>
              <div className="space-y-2">
                <Label>Περίοδος σήματος</Label>
                <Input 
                  type="number" 
                  value={macdSettings.signalPeriod}
                  onChange={(e) => setMacdSettings({
                    ...macdSettings,
                    signalPeriod: parseInt(e.target.value)
                  })}
                  min={5}
                  max={15}
                  disabled={!isActive}
                />
              </div>
            </div>
          </TabsContent>
          
          <Separator className="my-4" />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveStrategy}
              disabled={!isActive || isSaving}
            >
              {isSaving ? "Αποθήκευση..." : "Αποθήκευση Στρατηγικής"}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
