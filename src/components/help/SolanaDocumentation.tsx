
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolanaResourceList } from "./solana/SolanaResourceList";
import { SystemProtectionGuide } from "./SystemProtectionGuide";
import { Shield, BookOpen, FileText, Database, Code, Server, Cpu, MessageSquare } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SolanaDocumentation() {
  return (
    <div className="p-4">
      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Πόροι Solana
          </TabsTrigger>
          <TabsTrigger value="protection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Προστασία Συστήματος
          </TabsTrigger>
          <TabsTrigger value="apis" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            API Τεκμηρίωση
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Δομή Δεδομένων
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Solana Programs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          <SolanaResourceList />
        </TabsContent>
        
        <TabsContent value="protection">
          <SystemProtectionGuide />
        </TabsContent>
        
        <TabsContent value="apis">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Τεκμηρίωση API</h3>
              <p className="text-muted-foreground">
                Αναλυτική τεκμηρίωση για τα APIs της πλατφόρμας και τον τρόπο χρήσης τους.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="helius">
                <AccordionTrigger className="font-medium">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span>Helius API</span>
                    <Badge variant="outline" className="ml-2">Core Service</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm">
                    Το Helius API παρέχει υψηλής απόδοσης πρόσβαση στο blockchain του Solana, συμπεριλαμβανομένων
                    των συναλλαγών, των NFTs και άλλων δεδομένων on-chain.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Βασικά Endpoints:</h4>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{`GET https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Παραδείγματα Χρήσης:</h4>
                    <Card className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Λήψη Υπολοίπου Πορτοφολιού</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                          <code>{`const getBalance = async (address) => {
  const response = await fetch("https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getBalance",
      params: [address]
    })
  });
  const { result } = await response.json();
  return result.value;
};`}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Σημαντικές Λειτουργίες:</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Enhanced RPC με υψηλά όρια και αξιοπιστία</li>
                      <li>Ενημερώσεις σε πραγματικό χρόνο (webhooks)</li>
                      <li>NFT και DeFi APIs</li>
                      <li>Παρακολούθηση συναλλαγών και γεγονότων</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm">
                    Μπορείτε να αποκτήσετε κλειδί API από τον ιστότοπο του Helius και να το αποθηκεύσετε 
                    με ασφάλεια στο API Vault της πλατφόρμας μας.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="jupiter">
                <AccordionTrigger className="font-medium">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span>Jupiter Aggregator API</span>
                    <Badge variant="outline" className="ml-2">Trading Service</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm">
                    Το Jupiter Aggregator API επιτρέπει τη βέλτιστη εκτέλεση συναλλαγών στο Solana, συγκεντρώνοντας 
                    ρευστότητα από πολλαπλά DEXs για να προσφέρει τις καλύτερες τιμές και χαμηλά fees.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Βασικά Endpoints:</h4>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{`GET https://quote-api.jup.ag/v6/quote
POST https://quote-api.jup.ag/v6/swap`}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Παραδείγματα Χρήσης:</h4>
                    <Card className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Λήψη Προσφοράς Ανταλλαγής</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                          <code>{`const getQuote = async (inputMint, outputMint, amount) => {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount,
    slippageBps: "50"
  });
  const response = await fetch(\`https://quote-api.jup.ag/v6/quote?\${params}\`);
  return await response.json();
};`}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Χαρακτηριστικά:</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Συνάθροιση ρευστότητας από 15+ DEXs</li>
                      <li>Εύρεση βέλτιστης διαδρομής συναλλαγής</li>
                      <li>Προσαρμοζόμενο όριο slippage</li>
                      <li>Υποστήριξη για όλα τα SPL tokens</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="internal">
                <AccordionTrigger className="font-medium">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span>Internal Platform APIs</span>
                    <Badge variant="outline" className="ml-2">Core Service</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm">
                    Τα εσωτερικά APIs της πλατφόρμας παρέχουν πρόσβαση στη λειτουργικότητα των bots, τη διαχείριση των 
                    κλειδιών API και την παρακολούθηση των συναλλαγών.
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-medium">Διαθέσιμα Internal APIs:</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li><strong>Bot Management API</strong> - Έλεγχος και παρακολούθηση των bots</li>
                      <li><strong>API Vault Service</strong> - Διαχείριση κρυπτογραφημένων κλειδιών API</li>
                      <li><strong>Transaction Monitoring</strong> - Παρακολούθηση και ανάλυση συναλλαγών</li>
                      <li><strong>System Protection Service</strong> - Διαχείριση αντιγράφων ασφαλείας και ασφάλειας</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm">
                    Τα εσωτερικά APIs είναι διαθέσιμα μόνο εντός της εφαρμογής και δεν απαιτούν ξεχωριστά κλειδιά API.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="solscan">
                <AccordionTrigger className="font-medium">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span>Solscan API</span>
                    <Badge variant="outline" className="ml-2">Explorer</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm">
                    Το Solscan API παρέχει δεδομένα για συναλλαγές, λογαριασμούς και tokens στο δίκτυο Solana.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Βασικά Endpoints:</h4>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{`GET https://api.solscan.io/account?address={address}&cluster=mainnet
GET https://api.solscan.io/transaction?tx={signature}&cluster=mainnet`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Χρήσεις:</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Παρακολούθηση δραστηριότητας πορτοφολιού</li>
                      <li>Λήψη πληροφοριών για tokens και NFTs</li>
                      <li>Έλεγχος επιβεβαίωσης συναλλαγών</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="database">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Δομή Δεδομένων</h3>
              <p className="text-muted-foreground">
                Πληροφορίες για τη δομή των δεδομένων και την αποθήκευσή τους στην εφαρμογή.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="api-keys">
                <AccordionTrigger className="font-medium">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <span>Αποθήκευση API Κλειδιών</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm">
                    Τα κλειδιά API αποθηκεύονται με ασφάλεια με κρυπτογράφηση AES-256 και προστασία για παρεμβολές.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Δομή Δεδομένων:</h4>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{`{
  id: "uuid-v4",
  name: "Όνομα κλειδιού",
  service: "helius", // Τύπος υπηρεσίας
  encryptedKey: "AES-256 κρυπτογραφημένο κλειδί",
  iv: "Initialization Vector",
  createdAt: "Timestamp",
  lastUsed: "Timestamp",
  isActive: boolean
}`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Μηχανισμοί Ασφάλειας:</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Κρυπτογράφηση AES-256 με κλειδί παραγόμενο από τον κύριο κωδικό</li>
                      <li>Επαλήθευση ακεραιότητας με HMAC</li>
                      <li>Αυτόματο κλείδωμα μετά από περίοδο αδράνειας</li>
                      <li>Περιορισμένη προβολή ευαίσθητων πληροφοριών</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="bot-data">
                <AccordionTrigger className="font-medium">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <span>Δεδομένα Bots</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm">
                    Οι ρυθμίσεις και τα δεδομένα απόδοσης των bots αποθηκεύονται σε κρυπτογραφημένη μορφή στο localStorage και συγχρονίζονται με ασφάλεια με το backend.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Δομή Ρυθμίσεων Bot:</h4>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{`{
  id: "uuid-v4",
  name: "Όνομα Bot",
  type: "trading" | "maker",
  strategy: "grid" | "dca" | "momentum",
  status: "active" | "paused" | "stopped",
  parameters: {
    baseToken: "SOL",
    quoteToken: "USDC",
    allocation: 1000,
    riskLevel: 0.5,
    minPrice: 100,
    maxPrice: 200,
    gridSize: 10,
    stopLoss: 90,
    takeProfit: 220,
    // Άλλες παράμετροι ανάλογα με τη στρατηγική
  },
  performance: {
    initialValue: 1000,
    currentValue: 1120,
    totalTrades: 52,
    winningTrades: 38,
    profitFactor: 1.75,
    // Μετρικές απόδοσης
  },
  createdAt: "Timestamp",
  updatedAt: "Timestamp"
}`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Αποθήκευση & Συγχρονισμός:</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Αποθήκευση ρυθμίσεων σε κρυπτογραφημένο localStorage</li>
                      <li>Περιοδικός συγχρονισμός με backend (καθε 60 δευτερόλεπτα)</li>
                      <li>Αυτόματα αντίγραφα ασφαλείας μετά από σημαντικές αλλαγές</li>
                      <li>Ιστορικό εκδόσεων για κάθε αλλαγή ρύθμισης</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="backups">
                <AccordionTrigger className="font-medium">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <span>Αντίγραφα Ασφαλείας</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm">
                    Τα αντίγραφα ασφαλείας της δομής της εφαρμογής αποθηκεύονται με αυξημένη πλεονασμό για διασφάλιση της ακεραιότητας των δεδομένων.
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-medium">Σημεία Αποθήκευσης:</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>localStorage με κρυπτογράφηση AES-256</li>
                      <li>IndexedDB για μεγαλύτερα σύνολα δεδομένων</li>
                      <li>Cloud αποθήκευση (όταν είναι συνδεδεμένο)</li>
                      <li>Δυνατότητα χειροκίνητης εξαγωγής σε αρχείο</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Αυτοματισμοί:</h4>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Αυτόματη δημιουργία αντιγράφων κατά την εκκίνηση της εφαρμογής</li>
                      <li>Περιοδικά αντίγραφα κάθε 60 λεπτά χρήσης</li>
                      <li>Αυτόματη δημιουργία αντιγράφων πριν από κρίσιμες ενέργειες</li>
                      <li>Διατήρηση των τελευταίων 5 σημείων αποκατάστασης</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="programs">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Solana Programs</h3>
              <p className="text-muted-foreground">
                Πληροφορίες για τα βασικά Solana Programs που χρησιμοποιούνται στην πλατφόρμα.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Cpu className="h-4 w-4" />
                    SPL Token Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    Το βασικό πρόγραμμα για τη δημιουργία και διαχείριση tokens στο Solana.
                  </p>
                  <p className="text-sm">
                    <strong>Διεύθυνση:</strong> <code className="text-xs bg-muted p-1 rounded">TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA</code>
                  </p>
                  <p className="text-sm mt-2">
                    Χρησιμοποιείται για όλες τις λειτουργίες που σχετίζονται με tokens, όπως μεταφορές, εγκρίσεις, δημιουργία νέων tokens κ.λπ.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4" />
                    Memo Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    Επιτρέπει την προσθήκη σημειώσεων στις συναλλαγές στο Solana.
                  </p>
                  <p className="text-sm">
                    <strong>Διεύθυνση:</strong> <code className="text-xs bg-muted p-1 rounded">MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr</code>
                  </p>
                  <p className="text-sm mt-2">
                    Χρησιμοποιείται για την προσθήκη μεταδεδομένων σε συναλλαγές, όπως σημειώσεις για την προέλευση της συναλλαγής.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Cpu className="h-4 w-4" />
                    Associated Token Account Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    Διαχειρίζεται τους λογαριασμούς tokens που συνδέονται με ένα πορτοφόλι.
                  </p>
                  <p className="text-sm">
                    <strong>Διεύθυνση:</strong> <code className="text-xs bg-muted p-1 rounded">ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL</code>
                  </p>
                  <p className="text-sm mt-2">
                    Επιτρέπει τη δημιουργία και διαχείριση λογαριασμών token που συνδέονται με ένα συγκεκριμένο πορτοφόλι με ντετερμινιστικό τρόπο.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Cpu className="h-4 w-4" />
                    Metaplex Token Metadata Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    Προσθέτει μεταδεδομένα σε tokens στο Solana.
                  </p>
                  <p className="text-sm">
                    <strong>Διεύθυνση:</strong> <code className="text-xs bg-muted p-1 rounded">metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s</code>
                  </p>
                  <p className="text-sm mt-2">
                    Επιτρέπει την προσθήκη πληροφοριών όπως όνομα, σύμβολο, εικόνα και άλλα χαρακτηριστικά σε tokens και NFTs.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-muted p-4 rounded space-y-2 mt-4">
              <h4 className="font-medium">Σημαντική Σημείωση</h4>
              <p className="text-sm">
                Η πλατφόρμα μας αλληλεπιδρά με αυτά τα programs μέσω των κατάλληλων SDKs και βιβλιοθηκών.
                Οι συναλλαγές πάντα απαιτούν την έγκριση του χρήστη μέσω του συνδεδεμένου πορτοφολιού.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
