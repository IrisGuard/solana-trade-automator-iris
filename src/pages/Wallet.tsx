
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ArrowUpRight, 
  Send, 
  Download, 
  Plus, 
  Copy, 
  QrCode,
  Check,
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const Wallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [simulationMode, setSimulationMode] = useState(true);
  const [rpcStatus, setRpcStatus] = useState({
    total: 5,
    active: 3
  });

  // Mock wallet address
  const walletAddress = "sol8HKj6SJU79kfyaMKXf8XywMJc3BXUxWnKs6zHxE5vq2eHYheu4zGNz";
  
  // Function to handle wallet connection
  const connectWallet = () => {
    setWalletConnected(true);
    toast({
      title: "Πορτοφόλι συνδέθηκε",
      description: "Το πορτοφόλι Solana συνδέθηκε επιτυχώς."
    });
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setWalletConnected(false);
    toast({
      title: "Αποσύνδεση πορτοφολιού",
      description: "Το πορτοφόλι αποσυνδέθηκε επιτυχώς."
    });
  };

  // Function to copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Αντιγραφή επιτυχής",
      description: "Η διεύθυνση αντιγράφηκε στο πρόχειρο."
    });
  };

  // Toggle QR code visibility
  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  // Toggle simulation mode
  const toggleSimulationMode = () => {
    setSimulationMode(!simulationMode);
    toast({
      title: simulationMode ? "Λειτουργία πραγματικών συναλλαγών ενεργή" : "Λειτουργία προσομοίωσης ενεργή",
      description: simulationMode 
        ? "Προσοχή: Οι συναλλαγές θα εκτελούνται με πραγματικά κεφάλαια."
        : "Οι συναλλαγές θα εκτελούνται σε περιβάλλον προσομοίωσης."
    });
  };

  return (
    <div className="space-y-6">
      {!walletConnected ? (
        <Card className="text-center py-10">
          <CardContent className="pt-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Συνδέστε το πορτοφόλι Solana</h2>
            <p className="text-muted-foreground mb-6">
              Για να χρησιμοποιήσετε το Solana Maker Bot, πρέπει να συνδέσετε το πορτοφόλι σας.
            </p>
            <Button size="lg" onClick={connectWallet}>
              Σύνδεση Πορτοφολιού
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* RPC Status */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant={rpcStatus.active >= 3 ? "default" : "destructive"}>
                RPC Status: {rpcStatus.active}/{rpcStatus.total}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center mr-2">
                <Switch
                  checked={!simulationMode}
                  onCheckedChange={toggleSimulationMode}
                  id="simulation-mode"
                />
                <Label htmlFor="simulation-mode" className="ml-2">
                  {simulationMode ? "Λειτουργία Προσομοίωσης" : "Πραγματικές Συναλλαγές"}
                </Label>
              </div>
              <Button variant="outline" onClick={disconnectWallet} size="sm">
                Αποσύνδεση
              </Button>
            </div>
          </div>

          {simulationMode && (
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="py-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">
                  Λειτουργία Προσομοίωσης Ενεργή - Δεν εκτελούνται πραγματικές συναλλαγές
                </span>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="maker">Maker Bot</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overview tab content */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Συνολικό Υπόλοιπο</CardDescription>
                    <CardTitle className="text-3xl">$12,546.76</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-green-400 flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      <span>+5.25% αυτή την εβδομάδα</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>SOL Υπόλοιπο</CardDescription>
                    <CardTitle className="text-3xl">142.5 SOL</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      ≈ $10,687.50 @ $75 ανά SOL
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>USDC Υπόλοιπο</CardDescription>
                    <CardTitle className="text-3xl">1,859.26 USDC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Για αγορά νέων tokens
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Διαχείριση Πορτοφολιού</CardTitle>
                    <CardDescription>Αποστολή, λήψη και ανταλλαγή κρυπτονομισμάτων</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="flex flex-col items-center justify-center gap-2 h-20">
                        <Send size={18} />
                        <span className="text-xs">Αποστολή</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center justify-center gap-2 h-20">
                        <Download size={18} />
                        <span className="text-xs">Λήψη</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center justify-center gap-2 h-20">
                        <Plus size={18} />
                        <span className="text-xs">Αγορά</span>
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mt-4">Για αποστολή ή λήψη χρημάτων, βεβαιωθείτε ότι χρησιμοποιείτε τις σωστές διευθύνσεις Solana.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Διεύθυνση Πορτοφολιού</CardTitle>
                    <CardDescription>Η διεύθυνση Solana για το πορτοφόλι σας</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-3 rounded-md font-mono text-xs break-all">
                      {walletAddress}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={copyAddress}>
                        <Copy className="h-4 w-4 mr-2" />
                        Αντιγραφή
                      </Button>
                      <Button variant="outline" size="sm" onClick={toggleQRCode}>
                        <QrCode className="h-4 w-4 mr-2" />
                        {showQR ? 'Απόκρυψη QR' : 'Εμφάνιση QR Code'}
                      </Button>
                    </div>
                    {showQR && (
                      <div className="mt-4 bg-white p-4 rounded-md flex justify-center">
                        {/* Εδώ θα μπορούσε να υπάρχει ένα πραγματικό QR component */}
                        <div className="w-32 h-32 bg-gray-200 border border-gray-400 flex items-center justify-center text-black text-xs text-center">
                          QR Code του πορτοφολιού σας<br />
                          (προσομοίωση)
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Ιστορικό Συναλλαγών</CardTitle>
                    <CardDescription>Πρόσφατες συναλλαγές στο πορτοφόλι σας</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{i % 2 === 0 ? 'Αγορά SOL' : 'Πώληση SOL'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(Date.now() - i * 3600000).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${i % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {i % 2 === 0 ? '+0.5 SOL' : '-0.3 SOL'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {i % 2 === 0 ? '$37.50' : '$22.50'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      Προβολή Όλων των Συναλλαγών
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tokens" className="space-y-6">
              {/* Tokens tab content */}
              <Card>
                <CardHeader>
                  <CardTitle>Τα Tokens Μου</CardTitle>
                  <CardDescription>Διαχείριση και παρακολούθηση των tokens σας</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Solana", symbol: "SOL", balance: "142.5", value: "$10,687.50", change: "+5.25%" },
                      { name: "USD Coin", symbol: "USDC", balance: "1,859.26", value: "$1,859.26", change: "0.00%" },
                      { name: "Hypersonic Pepe", symbol: "HPEPE", balance: "1,500,000", value: "$150.00", change: "+12.5%" }
                    ].map((token, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            {token.symbol.substring(0, 1)}
                          </div>
                          <div>
                            <p className="font-medium">{token.name}</p>
                            <p className="text-sm text-muted-foreground">{token.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{token.balance}</p>
                          <p className="text-sm text-muted-foreground">{token.value}</p>
                        </div>
                        <div className="text-sm">
                          <span className={token.change.startsWith("+") ? "text-green-400" : token.change === "0.00%" ? "" : "text-red-400"}>
                            {token.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Προσθήκη Token
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Προσθήκη Νέου Token</CardTitle>
                  <CardDescription>Εισάγετε τη διεύθυνση του συμβολαίου token</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token-address">Διεύθυνση Token</Label>
                    <Input 
                      id="token-address"
                      placeholder="Π.χ. ToKEYyZ...JCAiiQz"
                    />
                  </div>
                  <Button>Προσθήκη Token</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maker" className="space-y-6">
              {/* Maker Bot tab content */}
              <Card>
                <CardHeader>
                  <CardTitle>Solana Maker Bot</CardTitle>
                  <CardDescription>Ρυθμίστε το bot για να ενισχύσετε τη δραστηριότητα του token σας</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!simulationMode && (
                    <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-4 mb-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                          <h4 className="font-semibold text-amber-500">Προσοχή: Λειτουργία πραγματικών συναλλαγών</h4>
                          <p className="text-sm">Το bot θα εκτελέσει πραγματικές συναλλαγές με το token σας.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Επιλογή Token</Label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {["SOL", "USDC", "HPEPE"].map((token, i) => (
                          <Button 
                            key={i} 
                            variant={token === "HPEPE" ? "default" : "outline"}
                            className="justify-start"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              {token.substring(0, 1)}
                            </div>
                            {token}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Παράμετροι Bot</h3>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="makers-count">Πλήθος Makers</Label>
                          <Input
                            id="makers-count"
                            type="number"
                            placeholder="100"
                            defaultValue="100"
                          />
                          <p className="text-xs text-muted-foreground">
                            Αριθμός εικονικών traders που θα προσομοιωθούν
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="spl-amount">Ποσότητα SPL Token</Label>
                          <Input
                            id="spl-amount"
                            type="number"
                            placeholder="100000"
                            defaultValue="100000"
                          />
                          <p className="text-xs text-muted-foreground">
                            Ελάχιστη απαίτηση: 100,000 tokens
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="min-delay">Ελάχιστη Καθυστέρηση (sec)</Label>
                          <Input
                            id="min-delay"
                            type="number"
                            placeholder="5"
                            defaultValue="5"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max-delay">Μέγιστη Καθυστέρηση (sec)</Label>
                          <Input
                            id="max-delay"
                            type="number"
                            placeholder="15"
                            defaultValue="15"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sol-amount">Ποσό SOL για Χρήση</Label>
                        <Input
                          id="sol-amount"
                          type="number"
                          placeholder="0.5"
                          defaultValue="0.5"
                        />
                        <p className="text-xs text-muted-foreground">
                          Ελάχιστη απαίτηση: 0.5 SOL για τέλη συναλλαγών
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="price-boost" />
                        <Label htmlFor="price-boost">Αυτόματη ενίσχυση τιμής</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="burn-tokens" />
                        <Label htmlFor="burn-tokens">Καταστροφή μικρών ποσοτήτων token ("burn")</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Επαναφορά Προεπιλογών</Button>
                  <Button>{simulationMode ? "Έναρξη Προσομοίωσης" : "Εκκίνηση Bot"}</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Παρακολούθηση Απόδοσης</CardTitle>
                  <CardDescription>Επιδόσεις του Maker Bot σε πραγματικό χρόνο</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Συναλλαγές</p>
                        <p className="text-2xl font-semibold">0</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Όγκος</p>
                        <p className="text-2xl font-semibold">0 HPEPE</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Ενίσχυση Τιμής</p>
                        <p className="text-2xl font-semibold text-green-400">+0.00%</p>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 mt-4">
                      <p className="font-medium mb-2">Κατάσταση Bot</p>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                        <span>Ανενεργό</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Το bot δεν είναι ενεργό. Πατήστε "Εκκίνηση" για να ξεκινήσετε.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Wallet;
