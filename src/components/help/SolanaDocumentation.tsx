
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { ExternalLink } from "lucide-react";

export function SolanaDocumentation() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <Tabs defaultValue="docs">
          <TabsList className="mb-4">
            <TabsTrigger value="docs">Τεκμηρίωση</TabsTrigger>
            <TabsTrigger value="tutorials">Οδηγοί</TabsTrigger>
            <TabsTrigger value="tools">Εργαλεία</TabsTrigger>
          </TabsList>
          
          <TabsContent value="docs" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Επίσημη Τεκμηρίωση Solana</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Πλήρης τεκμηρίωση για το blockchain Solana.
                </p>
                <Link href="https://docs.solana.com/" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">SPL Token Τεκμηρίωση</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Πληροφορίες για το πρότυπο των Solana tokens.
                </p>
                <Link href="https://spl.solana.com/token" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Web3.js SDK</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Το επίσημο JavaScript API για αλληλεπίδραση με το Solana.
                </p>
                <Link href="https://solana-labs.github.io/solana-web3.js/" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Wallet Adapter</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Τεκμηρίωση για το React Wallet Adapter του Solana.
                </p>
                <Link href="https://github.com/solana-labs/wallet-adapter" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tutorials" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Εισαγωγή στο Solana</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ένας πλήρης οδηγός για αρχάριους στο Solana ecosystem.
                </p>
                <Link href="https://solana.com/developers" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Οδηγός για το Phantom Wallet</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Αναλυτικές οδηγίες για τη χρήση του Phantom Wallet.
                </p>
                <Link href="https://phantom.app/help" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Δημιουργία SPL Token</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Οδηγός για τη δημιουργία του δικού σας token στο Solana.
                </p>
                <Link href="https://solana.com/developers/guides/getstarted/create-token" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Trading στο Solana</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Οδηγός για την αγορά και πώληση tokens στο Solana.
                </p>
                <Link href="https://solana.com/ecosystem/exchange" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Solana Explorer</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Εργαλείο εξερεύνησης του Solana blockchain.
                </p>
                <Link href="https://explorer.solana.com/" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Solana Playground</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Online IDE για την ανάπτυξη προγραμμάτων στο Solana.
                </p>
                <Link href="https://beta.solpg.io/" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Jupiter Aggregator</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Το καλύτερο εργαλείο για swap tokens με τις καλύτερες τιμές.
                </p>
                <Link href="https://jup.ag/" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-medium mb-2">Solscan</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Εναλλακτικός εξερευνητής με περισσότερες λειτουργίες.
                </p>
                <Link href="https://solscan.io/" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-primary">
                  <span>Επίσκεψη</span> <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
