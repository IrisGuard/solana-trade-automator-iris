
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, TrendingUp, ArrowBigDown, Grid, Settings, LineChart, AlertTriangle, Info, HelpCircle, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

export function BotDocumentation() {
  const { t } = useLanguage();
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Αναλυτική Τεκμηρίωση Bot</h2>
        <p className="text-sm text-muted-foreground">
          Πλήρης οδηγός για τις λειτουργίες, τις στρατηγικές και τη βέλτιστη χρήση των αυτοματοποιημένων bots της πλατφόρμας μας.
        </p>
      </div>
      
      <Tabs defaultValue="types" className="w-full">
        <TabsList className="mb-4 grid grid-cols-4 w-full">
          <TabsTrigger value="types">Τύποι Bots</TabsTrigger>
          <TabsTrigger value="strategies">Στρατηγικές</TabsTrigger>
          <TabsTrigger value="configuration">Παραμετροποίηση</TabsTrigger>
          <TabsTrigger value="optimization">Βελτιστοποίηση</TabsTrigger>
        </TabsList>
        
        <TabsContent value="types">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      Trading Bot
                    </CardTitle>
                    <Badge>Αυτόματες συναλλαγές</Badge>
                  </div>
                  <CardDescription>
                    Αυτοματοποιημένες αγορές και πωλήσεις με βάση ρυθμιζόμενες παραμέτρους και προκαθορισμένες στρατηγικές.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Βασικά Χαρακτηριστικά</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Αυτόματες εντολές αγοράς και πώλησης βάσει στρατηγικής</li>
                      <li>Ρυθμιζόμενα stop-loss και take-profit για διαχείριση κινδύνου</li>
                      <li>Υποστήριξη πολλαπλών ζευγών συναλλαγών</li>
                      <li>Παρακολούθηση απόδοσης σε πραγματικό χρόνο</li>
                      <li>Διαχείριση κεφαλαίων και αυτόματη επανεπένδυση κερδών</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Ιδανικό για</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Αυτοματοποιημένες συναλλαγές 24/7</li>
                      <li>Εκτέλεση προκαθορισμένων στρατηγικών χωρίς συναισθηματική εμπλοκή</li>
                      <li>Συναλλαγές βασισμένες σε τεχνική ανάλυση και προκαθορισμένα κριτήρια</li>
                      <li>Επενδυτές που θέλουν να εκμεταλλευτούν τη μεταβλητότητα της αγοράς</li>
                    </ul>
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="text-sm">Συμβουλή</AlertTitle>
                    <AlertDescription className="text-xs">
                      Χρησιμοποιήστε το backtesting για να δοκιμάσετε τις στρατηγικές σας πριν τις εφαρμόσετε με πραγματικά κεφάλαια.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <a href="/help#trading-bot-guide" className="text-sm text-primary flex items-center gap-1 hover:underline">
                    Αναλυτικός οδηγός Trading Bot <ChevronRight className="h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      Maker Bot
                    </CardTitle>
                    <Badge>Δημιουργία ρευστότητας</Badge>
                  </div>
                  <CardDescription>
                    Δημιουργία ρευστότητας στην αγορά μέσω αυτόματων εντολών αγοράς και πώλησης με ελεγχόμενο spread.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Βασικά Χαρακτηριστικά</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Ταυτόχρονες εντολές αγοράς και πώλησης για δημιουργία spread</li>
                      <li>Ρυθμιζόμενο εύρος τιμών για τιμές αγοράς-πώλησης</li>
                      <li>Έλεγχος όγκου συναλλαγών και συχνότητας</li>
                      <li>Παρακολούθηση κερδών από το spread</li>
                      <li>Δυναμική προσαρμογή σε συνθήκες αγοράς</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Ιδανικό για</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Δημιουργία ρευστότητας σε νέα ή χαμηλής κεφαλαιοποίησης tokens</li>
                      <li>Κέρδη μέσω του spread μεταξύ τιμών αγοράς και πώλησης</li>
                      <li>Σταθεροποίηση τιμών σε περιόδους υψηλής μεταβλητότητας</li>
                      <li>Δημιουργοί αγοράς και κάτοχοι μεγάλων ποσοτήτων συγκεκριμένων tokens</li>
                    </ul>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Σημαντική παρατήρηση</AlertTitle>
                    <AlertDescription className="text-xs">
                      Το Maker Bot απαιτεί επαρκή κεφάλαια και στα δύο tokens του ζεύγους για να λειτουργήσει αποτελεσματικά.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <a href="/help#maker-bot-guide" className="text-sm text-primary flex items-center gap-1 hover:underline">
                    Αναλυτικός οδηγός Maker Bot <ChevronRight className="h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
            </div>
            
            <Alert className="bg-muted">
              <HelpCircle className="h-4 w-4" />
              <AlertTitle>Σύγκριση Τύπων Bot</AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/70">
                      <tr>
                        <th className="p-2 text-left text-xs">Χαρακτηριστικό</th>
                        <th className="p-2 text-left text-xs">Trading Bot</th>
                        <th className="p-2 text-left text-xs">Maker Bot</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border-t">
                        <td className="p-2">Κύριος Στόχος</td>
                        <td className="p-2">Κέρδος από διακυμάνσεις τιμών</td>
                        <td className="p-2">Κέρδος από spread και δημιουργία ρευστότητας</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Στρατηγικές</td>
                        <td className="p-2">Grid, DCA, Momentum, κ.α.</td>
                        <td className="p-2">Order Book, Spread, Dynamic Pricing</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Συχνότητα Συναλλαγών</td>
                        <td className="p-2">Ποικίλλει ανάλογα με τη στρατηγική</td>
                        <td className="p-2">Υψηλή, συνεχής δημιουργία εντολών</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Διαχείριση Κινδύνου</td>
                        <td className="p-2">Stop-loss, Take-profit, Trailing stops</td>
                        <td className="p-2">Έλεγχος spread, Όρια θέσης</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Ιδανικό για</td>
                        <td className="p-2">Επενδυτές όλων των επιπέδων</td>
                        <td className="p-2">Προχωρημένους χρήστες, κατόχους tokens</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        
        <TabsContent value="strategies">
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <Grid className="h-5 w-5 text-primary" />
                      Grid Trading
                    </CardTitle>
                    <Badge variant="outline">Δημοφιλής Στρατηγική</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Η στρατηγική Grid Trading δημιουργεί ένα πλέγμα εντολών αγοράς και πώλησης σε προκαθορισμένα 
                    επίπεδα τιμών, επιτρέποντας την αυτόματη αγορά σε χαμηλές τιμές και την πώληση σε υψηλότερες.
                  </p>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Βασικές παράμετροι:</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li><strong>Lower Price:</strong> Κατώτατο όριο πλέγματος</li>
                      <li><strong>Upper Price:</strong> Ανώτατο όριο πλέγματος</li>
                      <li><strong>Grid Size:</strong> Αριθμός επιπέδων στο πλέγμα</li>
                      <li><strong>Investment Amount:</strong> Συνολικό κεφάλαιο προς επένδυση</li>
                      <li><strong>Grid Allocation:</strong> Κατανομή κεφαλαίων ανά επίπεδο</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Πλεονεκτήματα:</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Κέρδη από πλευρικές κινήσεις της αγοράς (sideways markets)</li>
                      <li>Αυτόματη αγορά στις πτώσεις και πώληση στα υψηλά</li>
                      <li>Διαφοροποίηση τιμών εισόδου και εξόδου</li>
                      <li>Σταδιακή συσσώρευση κερδών</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-2 rounded">
                    <h3 className="text-sm font-medium mb-1">Ιδανικό για:</h3>
                    <p className="text-xs">Αγορές με κανάλια τιμών, περιόδους σταθερότητας ή ήπιας μεταβλητότητας. Λειτουργεί καλύτερα σε sideways markets με προβλέψιμο εύρος.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <ArrowBigDown className="h-5 w-5 text-primary" />
                      DCA (Dollar Cost Averaging)
                    </CardTitle>
                    <Badge variant="outline">Χαμηλού Ρίσκου</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Η στρατηγική DCA πραγματοποιεί αγορές σταθερής αξίας σε τακτά χρονικά διαστήματα, 
                    ανεξάρτητα από την τιμή, μειώνοντας την επίδραση της μεταβλητότητας μακροπρόθεσμα.
                  </p>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Βασικές παράμετροι:</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li><strong>Investment Amount:</strong> Ποσό ανά αγορά</li>
                      <li><strong>Interval:</strong> Συχνότητα αγορών (ώρες/ημέρες)</li>
                      <li><strong>Total Budget:</strong> Συνολικό διαθέσιμο κεφάλαιο</li>
                      <li><strong>Target Token:</strong> Token προς συσσώρευση</li>
                      <li><strong>Auto-compound:</strong> Επανεπένδυση κερδών</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Πλεονεκτήματα:</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Μείωση του επενδυτικού ρίσκου από τη μεταβλητότητα</li>
                      <li>Απλή στρατηγική χωρίς απαίτηση για πρόβλεψη τιμών</li>
                      <li>Μακροπρόθεσμη συσσώρευση με μέσο κόστος</li>
                      <li>Ιδανική για αρχάριους επενδυτές</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-2 rounded">
                    <h3 className="text-sm font-medium mb-1">Ιδανικό για:</h3>
                    <p className="text-xs">Μακροπρόθεσμους επενδυτές που πιστεύουν στην ανοδική πορεία ενός token, αλλά θέλουν να αποφύγουν το timing της αγοράς. Ιδανικό για volatile αγορές.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Momentum Trading
                    </CardTitle>
                    <Badge variant="outline">Προχωρημένη</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Η στρατηγική Momentum εκμεταλλεύεται τις τάσεις της αγοράς, αγοράζοντας σε ανοδικές 
                    τάσεις και πουλώντας όταν η δυναμική εξασθενεί, βασισμένη σε τεχνικούς δείκτες.
                  </p>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Βασικές παράμετροι:</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li><strong>Indicators:</strong> RSI, MACD, Moving Averages</li>
                      <li><strong>Entry Conditions:</strong> Συνθήκες εισόδου στην αγορά</li>
                      <li><strong>Exit Conditions:</strong> Συνθήκες εξόδου από την αγορά</li>
                      <li><strong>Position Size:</strong> Μέγεθος θέσης ανά συναλλαγή</li>
                      <li><strong>Stop Loss/Take Profit:</strong> Αυτόματα όρια για διαχείριση κινδύνου</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Πλεονεκτήματα:</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Εκμετάλλευση ισχυρών ανοδικών ή καθοδικών τάσεων</li>
                      <li>Βασίζεται σε τεχνικούς δείκτες αντί διαίσθησης</li>
                      <li>Δυνατότητα για μεγάλα κέρδη σε σύντομο χρονικό διάστημα</li>
                      <li>Προσαρμόσιμοι δείκτες για διαφορετικές συνθήκες αγοράς</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-2 rounded">
                    <h3 className="text-sm font-medium mb-1">Ιδανικό για:</h3>
                    <p className="text-xs">Επενδυτές που κατανοούν τους τεχνικούς δείκτες και θέλουν να εκμεταλλευτούν ισχυρές τάσεις αγοράς. Απαιτεί καλύτερη κατανόηση της τεχνικής ανάλυσης.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Custom Strategy
                    </CardTitle>
                    <Badge variant="outline">Πλήρως προσαρμόσιμη</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Δημιουργήστε τη δική σας προσαρμοσμένη στρατηγική συνδυάζοντας διαφορετικούς δείκτες, 
                    συνθήκες και κανόνες συναλλαγών που ταιριάζουν στο προσωπικό σας επενδυτικό στυλ.
                  </p>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Δυνατά σημεία:</h3>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Συνδυασμός πολλαπλών στρατηγικών και δεικτών</li>
                      <li>Προσαρμοσμένοι κανόνες εισόδου και εξόδου</li>
                      <li>Εξατομικευμένη διαχείριση κινδύνου</li>
                      <li>Δυνατότητα αλγοριθμικών συναλλαγών</li>
                      <li>Υποστήριξη για εξωτερικά σήματα και δεδομένα</li>
                    </ul>
                  </div>
                  
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Προσοχή</AlertTitle>
                    <AlertDescription className="text-xs">
                      Οι προσαρμοσμένες στρατηγικές απαιτούν εκτεταμένη δοκιμή πριν την εφαρμογή με πραγματικά κεφάλαια.
                      Χρησιμοποιήστε πάντα το εργαλείο backtesting για να επικυρώσετε την απόδοση της στρατηγικής σας.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-muted p-2 rounded">
                    <h3 className="text-sm font-medium mb-1">Ιδανικό για:</h3>
                    <p className="text-xs">Έμπειρους traders που κατανοούν την τεχνική ανάλυση και έχουν συγκεκριμένες ιδέες για στρατηγικές συναλλαγών που θέλουν να αυτοματοποιήσουν.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Alert className="bg-muted">
              <LineChart className="h-4 w-4" />
              <AlertTitle>Σύγκριση Στρατηγικών: Απόδοση σε διαφορετικές συνθήκες αγοράς</AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/70">
                      <tr>
                        <th className="p-2 text-left text-xs">Συνθήκες Αγοράς</th>
                        <th className="p-2 text-left text-xs">Grid Trading</th>
                        <th className="p-2 text-left text-xs">DCA</th>
                        <th className="p-2 text-left text-xs">Momentum</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border-t">
                        <td className="p-2">Ανοδική Αγορά</td>
                        <td className="p-2">Μέτρια</td>
                        <td className="p-2">Καλή</td>
                        <td className="p-2">Εξαιρετική</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Καθοδική Αγορά</td>
                        <td className="p-2">Χαμηλή</td>
                        <td className="p-2">Μέτρια</td>
                        <td className="p-2">Καλή*</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Sideway Αγορά</td>
                        <td className="p-2">Εξαιρετική</td>
                        <td className="p-2">Μέτρια</td>
                        <td className="p-2">Χαμηλή</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Υψηλή Μεταβλητότητα</td>
                        <td className="p-2">Καλή</td>
                        <td className="p-2">Χαμηλή</td>
                        <td className="p-2">Μέτρια</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Χαμηλή Μεταβλητότητα</td>
                        <td className="p-2">Μέτρια</td>
                        <td className="p-2">Καλή</td>
                        <td className="p-2">Χαμηλή</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs mt-2">* Όταν ρυθμιστεί για short selling ή αντιστροφή δεικτών</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        
        <TabsContent value="configuration">
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Η σωστή παραμετροποίηση των bots είναι κρίσιμη για την επιτυχία της αυτοματοποιημένης 
              στρατηγικής σας. Αυτός ο οδηγός θα σας βοηθήσει να κατανοήσετε τις βασικές παραμέτρους 
              και πώς να τις ρυθμίσετε βέλτιστα.
            </p>
          
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="general">
                <AccordionTrigger className="font-medium">
                  Γενικές Παράμετροι Bot
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-xs">
                        <th className="border p-2 text-left">Παράμετρος</th>
                        <th className="border p-2 text-left">Περιγραφή</th>
                        <th className="border p-2 text-left">Προτεινόμενη Ρύθμιση</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr>
                        <td className="border p-2 font-medium">Όνομα Bot</td>
                        <td className="border p-2">Μοναδικό αναγνωριστικό για το bot σας</td>
                        <td className="border p-2">Περιγραφικό όνομα με στρατηγική/ζεύγος (π.χ. "Grid-SOL-USDC")</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Τύπος Bot</td>
                        <td className="border p-2">Trading ή Maker Bot</td>
                        <td className="border p-2">Ανάλογα με τον στόχο σας (κέρδος από διακυμάνσεις ή spread)</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Ζεύγος συναλλαγών</td>
                        <td className="border p-2">Τα tokens που θα χρησιμοποιηθούν για συναλλαγές</td>
                        <td className="border p-2">Ζεύγη με υψηλή ρευστότητα (π.χ. SOL/USDC, SOL/USDT)</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Επένδυση/Κεφάλαιο</td>
                        <td className="border p-2">Συνολικό ποσό που θα χρησιμοποιηθεί</td>
                        <td className="border p-2">Ξεκινήστε με μικρό ποσό (5-10% του χαρτοφυλακίου σας)</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Επίπεδο Ρίσκου</td>
                        <td className="border p-2">Καθορίζει την επιθετικότητα της στρατηγικής</td>
                        <td className="border p-2">Χαμηλό (0.2-0.4) για αρχάριους, Μέτριο (0.4-0.6) για έμπειρους</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="text-sm">Συμβουλή</AlertTitle>
                    <AlertDescription className="text-xs">
                      Ξεκινήστε με συντηρητικές ρυθμίσεις και σταδιακά αυξήστε το ρίσκο καθώς αποκτάτε εμπειρία 
                      και κατανόηση της συμπεριφοράς του bot.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="grid">
                <AccordionTrigger className="font-medium">
                  Παραμετροποίηση Grid Trading
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Βήματα παραμετροποίησης Grid Trading:</h4>
                    
                    <div className="relative border-l-2 border-primary/30 pl-4 pb-2 space-y-4">
                      <div>
                        <div className="flex items-center">
                          <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                            <span className="text-[10px]">1</span>
                          </div>
                          <h5 className="font-medium text-sm">Καθορισμός εύρους τιμών</h5>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-2">
                          Αναλύστε το ιστορικό τιμών για να προσδιορίσετε το πιθανό εύρος διακύμανσης. Ρυθμίστε το 
                          Lower Price και Upper Price με βάση την ανάλυση σας. Προτιμήστε ένα εύρος που η τιμή έχει 
                          κινηθεί επανειλημμένα τον τελευταίο μήνα.
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                            <span className="text-[10px]">2</span>
                          </div>
                          <h5 className="font-medium text-sm">Επιλογή μεγέθους πλέγματος</h5>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-2">
                          Καθορίστε τον αριθμό των επιπέδων στο πλέγμα (Grid Size). Περισσότερα επίπεδα σημαίνουν 
                          συχνότερες συναλλαγές με μικρότερα κέρδη ανά συναλλαγή. Λιγότερα επίπεδα σημαίνουν λιγότερες 
                          συναλλαγές αλλά μεγαλύτερο κέρδος ανά συναλλαγή.
                        </p>
                        <p className="text-xs mt-1 ml-2">
                          <strong>Προτεινόμενο:</strong> 5-10 επίπεδα για αρχάριους, 10-20 για έμπειρους χρήστες
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                            <span className="text-[10px]">3</span>
                          </div>
                          <h5 className="font-medium text-sm">Κατανομή κεφαλαίων</h5>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-2">
                          Επιλέξτε πώς θα κατανεμηθεί το κεφάλαιό σας μεταξύ των επιπέδων. Οι επιλογές είναι:
                        </p>
                        <ul className="list-disc list-inside text-xs mt-1 ml-2 space-y-1">
                          <li><strong>Ισόποση κατανομή:</strong> Ίδιο ποσό σε κάθε επίπεδο</li>
                          <li><strong>Αυξανόμενη προς τα κάτω:</strong> Περισσότερα κεφάλαια στα χαμηλότερα επίπεδα τιμών</li>
                          <li><strong>Αυξανόμενη προς τα πάνω:</strong> Περισσότερα κεφάλαια στα υψηλότερα επίπεδα τιμών</li>
                          <li><strong>Κατανομή κανονικής κατανομής:</strong> Περισσότερα κεφάλαια στη μέση του εύρους</li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                            <span className="text-[10px]">4</span>
                          </div>
                          <h5 className="font-medium text-sm">Διαχείριση κινδύνου</h5>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-2">
                          Ρυθμίστε τα stop-loss και take-profit για να περιορίσετε τις πιθανές απώλειες και να 
                          κατοχυρώσετε κέρδη σε ακραίες συνθήκες αγοράς:
                        </p>
                        <ul className="list-disc list-inside text-xs mt-1 ml-2 space-y-1">
                          <li><strong>Global Stop-Loss:</strong> 5-15% κάτω από την κατώτατη τιμή του πλέγματος</li>
                          <li><strong>Take-Profit Target:</strong> 10-30% πάνω από την ανώτατη τιμή του πλέγματος</li>
                          <li><strong>Trailing Stop:</strong> 5-10% για δυναμική προσαρμογή σε ανοδικές τάσεις</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-muted">
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Παράδειγμα παραμετροποίησης Grid Bot</AlertTitle>
                    <AlertDescription className="text-xs space-y-1">
                      <p>Για ένα ζεύγος SOL/USDC:</p>
                      <ul className="list-disc list-inside">
                        <li>Lower Price: $80</li>
                        <li>Upper Price: $120</li>
                        <li>Grid Size: 8 επίπεδα</li>
                        <li>Επένδυση: 1,000 USDC</li>
                        <li>Κατανομή: Αυξανόμενη προς τα κάτω</li>
                        <li>Global Stop-Loss: $70</li>
                        <li>Take-Profit: $140</li>
                        <li>Επίπεδα πλέγματος: $80, $85, $90, $95, $100, $105, $110, $120</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="dca">
                <AccordionTrigger className="font-medium">
                  Παραμετροποίηση DCA
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Βήματα παραμετροποίησης DCA:</h4>
                    
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted/50 text-xs">
                          <th className="border p-2 text-left">Παράμετρος</th>
                          <th className="border p-2 text-left">Περιγραφή</th>
                          <th className="border p-2 text-left">Προτεινόμενη Ρύθμιση</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        <tr>
                          <td className="border p-2 font-medium">Ποσό ανά αγορά</td>
                          <td className="border p-2">Το ποσό που θα επενδύεται σε κάθε περίοδο</td>
                          <td className="border p-2">2-5% του συνολικού κεφαλαίου σας</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Συχνότητα αγορών</td>
                          <td className="border p-2">Πόσο συχνά θα γίνονται οι αγορές</td>
                          <td className="border p-2">Καθημερινά/Εβδομαδιαία/Μηνιαία ανάλογα με τη στρατηγική</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Αυτόματη επανεπένδυση</td>
                          <td className="border p-2">Αν τα κέρδη θα επανεπενδύονται αυτόματα</td>
                          <td className="border p-2">Ενεργοποιημένο για μακροχρόνια συσσώρευση</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Target Token</td>
                          <td className="border p-2">Το κύριο token που θέλετε να συσσωρεύσετε</td>
                          <td className="border p-2">Tokens με ισχυρά θεμελιώδη (SOL, BTC, ETH)</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Base Token</td>
                          <td className="border p-2">Το token που θα χρησιμοποιείται για αγορές</td>
                          <td className="border p-2">Σταθερά νομίσματα (USDC, USDT)</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Αυτόματη πώληση</td>
                          <td className="border p-2">Αν θα πωλείται αυτόματα το token σε συγκεκριμένη τιμή</td>
                          <td className="border p-2">Προαιρετικό - Συνήθως απενεργοποιημένο στην κλασική DCA</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <Alert className="bg-primary/10 border-primary/20">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-sm">Προηγμένη DCA: Σταθμισμένη</AlertTitle>
                    <AlertDescription className="text-xs">
                      <p className="mb-1">Μπορείτε να χρησιμοποιήσετε σταθμισμένη DCA που προσαρμόζει το ποσό αγοράς με βάση την τιμή:</p>
                      <ul className="list-disc list-inside">
                        <li>Αγορά περισσότερων όταν η τιμή πέφτει</li>
                        <li>Αγορά λιγότερων όταν η τιμή ανεβαίνει</li>
                        <li>Χρήση του RSI ως σταθμιστή (αγορά περισσότερων σε χαμηλό RSI)</li>
                        <li>Προσθήκη τεχνικών δεικτών για βελτιστοποίηση αγορών</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-muted p-3 rounded">
                    <h4 className="text-sm font-medium mb-2">Παράδειγμα παραμετροποίησης DCA Bot:</h4>
                    <div className="text-xs space-y-1">
                      <p><strong>Στόχος:</strong> Συσσώρευση SOL μακροπρόθεσμα</p>
                      <p><strong>Συνολικό κεφάλαιο:</strong> 5,000 USDC</p>
                      <p><strong>Ποσό ανά αγορά:</strong> 200 USDC (4% του συνολικού)</p>
                      <p><strong>Συχνότητα:</strong> Εβδομαδιαία (κάθε Δευτέρα)</p>
                      <p><strong>Χρονικό διάστημα:</strong> 6 μήνες (25 αγορές)</p>
                      <p><strong>Αυτόματη επανεπένδυση:</strong> Ενεργοποιημένη</p>
                      <p><strong>Προηγμένες ρυθμίσεις:</strong> Αύξηση ποσού κατά 25% αν RSI &lt; 30</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="maker">
                <AccordionTrigger className="font-medium">
                  Παραμετροποίηση Maker Bot
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Βασικές παράμετροι Maker Bot:</h4>
                    
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted/50 text-xs">
                          <th className="border p-2 text-left">Παράμετρος</th>
                          <th className="border p-2 text-left">Περιγραφή</th>
                          <th className="border p-2 text-left">Προτεινόμενη Ρύθμιση</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        <tr>
                          <td className="border p-2 font-medium">Spread</td>
                          <td className="border p-2">Η διαφορά μεταξύ τιμής αγοράς και πώλησης</td>
                          <td className="border p-2">0.5% - 3% ανάλογα με τη ρευστότητα του ζεύγους</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Μέγεθος εντολής</td>
                          <td className="border p-2">Ποσό για κάθε εντολή αγοράς/πώλησης</td>
                          <td className="border p-2">1-5% του συνολικού κεφαλαίου ανά εντολή</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Αριθμός εντολών</td>
                          <td className="border p-2">Πόσες εντολές θα τοποθετούνται ταυτόχρονα</td>
                          <td className="border p-2">3-10 εντολές σε κάθε πλευρά</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Μέγιστο κεφάλαιο</td>
                          <td className="border p-2">Μέγιστο ποσό που θα δεσμεύεται σε εντολές</td>
                          <td className="border p-2">50-80% του διαθέσιμου κεφαλαίου</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Αναπροσαρμογή τιμών</td>
                          <td className="border p-2">Πόσο συχνά προσαρμόζονται οι τιμές στην αγορά</td>
                          <td className="border p-2">Κάθε 5-15 λεπτά</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">Slippage tolerance</td>
                          <td className="border p-2">Ανοχή ολίσθησης για εκτέλεση εντολών</td>
                          <td className="border p-2">0.5% - 1%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Προηγμένες ρυθμίσεις:</h4>
                    
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                      <Card className="bg-muted/30 border h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Dynamic Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs">
                          <p>Επιτρέπει στο bot να προσαρμόζει το spread βάσει των συνθηκών αγοράς:</p>
                          <ul className="list-disc list-inside space-y-1 mt-1">
                            <li>Μεγαλύτερο spread σε υψηλή μεταβλητότητα</li>
                            <li>Μικρότερο spread σε χαμηλή μεταβλητότητα</li>
                            <li>Προσαρμογή βάσει όγκου συναλλαγών</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30 border h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Inventory Management</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs">
                          <p>Διαχειρίζεται την αναλογία των δύο tokens:</p>
                          <ul className="list-disc list-inside space-y-1 mt-1">
                            <li>Στόχος αναλογίας (π.χ., 50/50%)</li>
                            <li>Στρατηγικές επανεξισορρόπησης</li>
                            <li>Όρια διακύμανσης αποθέματος</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Σημαντική προειδοποίηση</AlertTitle>
                    <AlertDescription className="text-xs">
                      Το Maker Bot απαιτεί επαρκή ποσότητα και από τα δύο tokens του ζεύγους για αποτελεσματική λειτουργία.
                      Βεβαιωθείτε ότι έχετε τουλάχιστον 40% του κεφαλαίου σας σε κάθε token του ζεύγους.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-muted p-3 rounded">
                    <h4 className="text-sm font-medium mb-2">Παράδειγμα παραμετροποίησης Maker Bot:</h4>
                    <div className="text-xs space-y-1">
                      <p><strong>Ζεύγος:</strong> SOL/USDC</p>
                      <p><strong>Συνολικό κεφάλαιο:</strong> 5 SOL και 500 USDC</p>
                      <p><strong>Spread:</strong> 1.2%</p>
                      <p><strong>Μέγεθος εντολής:</strong> 0.25 SOL / 25 USDC ανά εντολή</p>
                      <p><strong>Αριθμός εντολών:</strong> 5 εντολές αγοράς, 5 εντολές πώλησης</p>
                      <p><strong>Αναπροσαρμογή:</strong> Κάθε 10 λεπτά</p>
                      <p><strong>Ισορροπία αποθέματος:</strong> Στόχος 50/50% με επανεξισορρόπηση στο 60/40%</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="optimization">
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Η βελτιστοποίηση των bots σας είναι μια συνεχής διαδικασία που απαιτεί τακτική παρακολούθηση, 
              ανάλυση της απόδοσης και προσαρμογές. Αυτός ο οδηγός θα σας βοηθήσει να βελτιώσετε τις αποδόσεις 
              των αυτοματοποιημένων στρατηγικών σας.
            </p>
            
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Χρήση Backtesting</h3>
                <p className="text-sm">
                  Το backtesting είναι ένα ισχυρό εργαλείο που σας επιτρέπει να δοκιμάσετε τις στρατηγικές σας 
                  σε ιστορικά δεδομένα πριν τις εφαρμόσετε σε πραγματικές συνθήκες αγοράς.
                </p>
                
                <div className="relative border-l-2 border-primary/30 pl-4 pb-2 space-y-4">
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">1</span>
                      </div>
                      <h4 className="font-medium text-sm">Επιλέξτε χρονικό διάστημα</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Επιλέξτε διαφορετικά χρονικά διαστήματα που περιλαμβάνουν διαφορετικές συνθήκες αγοράς
                      (ανοδική, καθοδική, πλευρική κίνηση, υψηλή μεταβλητότητα).
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">2</span>
                      </div>
                      <h4 className="font-medium text-sm">Δοκιμάστε διαφορετικές παραμέτρους</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Πειραματιστείτε με διαφορετικές παραμέτρους για να βρείτε τον βέλτιστο συνδυασμό για κάθε 
                      στρατηγική και ζεύγος συναλλαγών.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">3</span>
                      </div>
                      <h4 className="font-medium text-sm">Αναλύστε τις μετρήσεις απόδοσης</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Εξετάστε μετρήσεις όπως συνολική απόδοση, μέγιστη πτώση (drawdown), λόγο κερδών/ζημιών,
                      δείκτη Sharpe, και ποσοστό επιτυχημένων συναλλαγών.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="absolute left-[-9px] rounded-full border-2 border-primary bg-background h-4 w-4 flex items-center justify-center">
                        <span className="text-[10px]">4</span>
                      </div>
                      <h4 className="font-medium text-sm">Εφαρμογή βέλτιστων παραμέτρων</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      Εφαρμόστε τις βέλτιστες παραμέτρους στο bot σας, αλλά ξεκινήστε με μικρότερο κεφάλαιο
                      για να επιβεβαιώσετε ότι η απόδοση σε πραγματικό χρόνο συμβαδίζει με τα αποτελέσματα του backtest.
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted rounded p-3 text-sm">
                  <h4 className="font-medium mb-1 text-sm">Προσοχή στο Overfitting</h4>
                  <p className="text-xs">
                    Αποφύγετε την υπερβολική βελτιστοποίηση που λειτουργεί μόνο σε συγκεκριμένες ιστορικές 
                    συνθήκες. Στοχεύστε σε στρατηγικές που αποδίδουν σταθερά σε διαφορετικά χρονικά διαστήματα 
                    και συνθήκες αγοράς.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Συνεχής Παρακολούθηση</h3>
                <p className="text-sm">
                  Η τακτική παρακολούθηση της απόδοσης των bots σας είναι απαραίτητη για την έγκαιρη 
                  προσαρμογή σε μεταβαλλόμενες συνθήκες αγοράς.
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="metrics">
                    <AccordionTrigger className="text-sm font-medium">
                      Βασικές μετρήσεις παρακολούθησης
                    </AccordionTrigger>
                    <AccordionContent>
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-muted/50 text-xs">
                            <th className="border p-2 text-left">Μέτρηση</th>
                            <th className="border p-2 text-left">Περιγραφή</th>
                            <th className="border p-2 text-left">Στόχος</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs">
                          <tr>
                            <td className="border p-2 font-medium">Συνολική απόδοση</td>
                            <td className="border p-2">Συνολική % αύξηση του επενδεδυμένου κεφαλαίου</td>
                            <td className="border p-2">Υψηλότερη από αντίστοιχα αγορά/benchmark</td>
                          </tr>
                          <tr>
                            <td className="border p-2 font-medium">Μέγιστη πτώση</td>
                            <td className="border p-2">Μέγιστη % απώλεια από κορυφή σε πυθμένα</td>
                            <td className="border p-2">&lt; 20% (ιδανικά &lt; 10%)</td>
                          </tr>
                          <tr>
                            <td className="border p-2 font-medium">Win Rate</td>
                            <td className="border p-2">% κερδοφόρων συναλλαγών</td>
                            <td className="border p-2">&gt; 50%</td>
                          </tr>
                          <tr>
                            <td className="border p-2 font-medium">Profit Factor</td>
                            <td className="border p-2">Συνολικά κέρδη / Συνολικές ζημίες</td>
                            <td className="border p-2">&gt; 1.5</td>
                          </tr>
                          <tr>
                            <td className="border p-2 font-medium">Sharpe Ratio</td>
                            <td className="border p-2">Απόδοση προσαρμοσμένη στον κίνδυνο</td>
                            <td className="border p-2">&gt; 1.0 (ιδανικά &gt; 2.0)</td>
                          </tr>
                          <tr>
                            <td className="border p-2 font-medium">Daily ROI</td>
                            <td className="border p-2">Μέση ημερήσια απόδοση</td>
                            <td className="border p-2">&gt; 0.1%</td>
                          </tr>
                        </tbody>
                      </table>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="adjustments">
                    <AccordionTrigger className="text-sm font-medium">
                      Πότε να προσαρμόσετε τις παραμέτρους
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Σημάδια για προσαρμογή στρατηγικής:</h4>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          <li>3+ συνεχόμενες ζημιογόνες συναλλαγές</li>
                          <li>Πτώση απόδοσης &gt; 10% σε μία εβδομάδα</li>
                          <li>Win Rate πέφτει κάτω από 45%</li>
                          <li>Σημαντική αλλαγή στη μεταβλητότητα της αγοράς</li>
                          <li>Όταν δεν εκτελούνται συναλλαγές για &gt; 5 ημέρες σε ενεργό bot</li>
                          <li>Μετά από σημαντικά γεγονότα που επηρεάζουν την αγορά</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Συχνές προσαρμογές ανά στρατηγική:</h4>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          <li><strong>Grid Bot:</strong> Προσαρμογή ορίων του πλέγματος βάσει νέου εύρους τιμών</li>
                          <li><strong>DCA:</strong> Αλλαγή συχνότητας ή ποσού αγορών βάσει μεταβλητότητας</li>
                          <li><strong>Momentum:</strong> Βαθμονόμηση ευαισθησίας δεικτών για αποφυγή ψευδών σημάτων</li>
                          <li><strong>Maker Bot:</strong> Προσαρμογή spread βάσει τρέχουσας ρευστότητας</li>
                        </ul>
                      </div>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle className="text-sm">Συμβουλή</AlertTitle>
                        <AlertDescription className="text-xs">
                          Να κρατάτε αρχείο όλων των προσαρμογών και των αποτελεσμάτων τους για να βελτιώνετε 
                          συνεχώς τη διαδικασία λήψης αποφάσεων σας.
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <h3 className="text-lg font-medium mt-6">Προηγμένες Τεχνικές</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Multi-Bot Strategies</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <p>
                        Χρησιμοποιήστε πολλαπλά bots με διαφορετικές στρατηγικές για διαφοροποίηση και μείωση κινδύνου.
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Grid bots για σταθερές αγορές</li>
                        <li>Momentum bots για ανοδικές τάσεις</li>
                        <li>DCA για μακροπρόθεσμη συσσώρευση</li>
                      </ul>
                      <p className="italic">Προτεινόμενη κατανομή: 40% Grid, 30% DCA, 30% Momentum</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Seasonality Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <p>
                        Αναλύστε εποχικά μοτίβα στα tokens για βελτιστοποίηση των συναλλαγών.
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ημερήσια/εβδομαδιαία μοτίβα</li>
                        <li>Επίδραση γεγονότων όπως airdrops</li>
                        <li>Προσαρμογή βάσει του market cycle</li>
                      </ul>
                      <p className="italic">Εφαρμόστε διαφορετικές στρατηγικές ανά φάση της αγοράς</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
