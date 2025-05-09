
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const TransactionSecurityCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle>Ασφάλεια Συναλλαγών</CardTitle>
        </div>
        <CardDescription>Ελέγξτε τις ρυθμίσεις ασφαλείας των συναλλαγών σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Επιβεβαίωση Συναλλαγών</h3>
            <p className="text-sm text-muted-foreground">Απαιτείται επιβεβαίωση για όλες τις συναλλαγές</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-medium">Όρια Συναλλαγών</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="daily-limit">Ημερήσιο Όριο</Label>
              <div className="flex items-center gap-2">
                <Input id="daily-limit" type="number" defaultValue="5000" />
                <Select defaultValue="sol">
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Νόμισμα" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sol">SOL</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="usdt">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transaction-limit">Όριο ανά Συναλλαγή</Label>
              <div className="flex items-center gap-2">
                <Input id="transaction-limit" type="number" defaultValue="1000" />
                <Select defaultValue="sol">
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Νόμισμα" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sol">SOL</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="usdt">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            Αποθήκευση Ορίων
          </Button>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-medium">Εγκεκριμένες Διευθύνσεις</h3>
          <p className="text-sm text-muted-foreground">
            Επιτρέψτε συναλλαγές μόνο με συγκεκριμένες διευθύνσεις πορτοφολιών
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Χρήση Λίστας Εγκεκριμένων Διευθύνσεων</h4>
              <p className="text-xs text-muted-foreground">Περιορισμός συναλλαγών μόνο σε εγκεκριμένες διευθύνσεις</p>
            </div>
            <Switch />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Διεύθυνση</TableHead>
                  <TableHead>Περιγραφή</TableHead>
                  <TableHead className="w-24">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs">
                    5xFD...8j2P
                  </TableCell>
                  <TableCell>Κύριο πορτοφόλι ανταλλακτηρίου</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Διαγραφή
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs">
                    9aBC...3kLm
                  </TableCell>
                  <TableCell>Πορτοφόλι staking</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Διαγραφή
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="flex gap-2">
            <Input placeholder="Εισάγετε διεύθυνση πορτοφολιού" className="flex-1" />
            <Input placeholder="Περιγραφή (προαιρετικά)" className="flex-1" />
            <Button>Προσθήκη</Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-medium">Προηγμένες Ρυθμίσεις Ασφαλείας</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Καθυστέρηση Συναλλαγών</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Ενεργοποίηση Καθυστέρησης</h4>
                      <p className="text-xs text-muted-foreground">Προσθέτει χρόνο αναμονής πριν την εκτέλεση συναλλαγών</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="delay-time">Χρόνος Καθυστέρησης (λεπτά)</Label>
                    <Select defaultValue="5">
                      <SelectTrigger id="delay-time">
                        <SelectValue placeholder="Επιλέξτε χρόνο" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 λεπτό</SelectItem>
                        <SelectItem value="5">5 λεπτά</SelectItem>
                        <SelectItem value="15">15 λεπτά</SelectItem>
                        <SelectItem value="30">30 λεπτά</SelectItem>
                        <SelectItem value="60">1 ώρα</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Ειδοποιήσεις Συναλλαγών</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Ειδοποιήσεις Email</h4>
                      <p className="text-xs text-muted-foreground">Λήψη ειδοποιήσεων μέσω email για όλες τις συναλλαγές</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Push Notifications</h4>
                      <p className="text-xs text-muted-foreground">Λήψη ειδοποιήσεων στη συσκευή σας</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Ειδοποίηση για συναλλαγές άνω των:</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" defaultValue="100" />
                      <Select defaultValue="sol">
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Νόμισμα" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sol">SOL</SelectItem>
                          <SelectItem value="usdc">USDC</SelectItem>
                          <SelectItem value="usdt">USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Γεωγραφικοί Περιορισμοί</AccordionTrigger>
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
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};
