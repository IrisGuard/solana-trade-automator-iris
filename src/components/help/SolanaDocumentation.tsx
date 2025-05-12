
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ResourceLink = {
  url: string;
  title: string;
  description: string;
  category: string;
};

export function SolanaDocumentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Κατηγορίες πόρων
  const categories = [
    { id: "all", name: "Όλα" },
    { id: "clusters", name: "Clusters & Endpoints" },
    { id: "tokens", name: "SPL Tokens" },
    { id: "accounts", name: "Λογαριασμοί & Addresses" },
    { id: "programs", name: "Programs" },
    { id: "api", name: "APIs & Services" },
    { id: "development", name: "Development" },
  ];

  // Πόροι και σύνδεσμοι Solana
  const resources: ResourceLink[] = [
    {
      url: "https://solana.com/el/docs/references/clusters",
      title: "Solana Clusters",
      description: "Επίσημη τεκμηρίωση για τα διάφορα clusters του Solana (mainnet-beta, testnet, devnet)",
      category: "clusters"
    },
    {
      url: "https://www.comparenodes.com/library/public-endpoints/solana/",
      title: "Λίστα Public Endpoints",
      description: "Λίστα με διαθέσιμα public RPC endpoints για το Solana blockchain",
      category: "clusters"
    },
    {
      url: "https://solana.stackexchange.com/questions/6684/alchemy-endpoint-gives-wrong-wallet-balance",
      title: "Troubleshooting RPC Endpoints",
      description: "Αντιμετώπιση προβλημάτων με διάφορα RPC endpoints και λανθασμένα υπόλοιπα",
      category: "clusters"
    },
    {
      url: "https://spl.solana.com/token",
      title: "SPL Token Documentation",
      description: "Επίσημη τεκμηρίωση για το Solana Program Library (SPL) Token πρωτόκολλο",
      category: "tokens"
    },
    {
      url: "https://solana.com/el/docs/tokens",
      title: "Solana Tokens Guide",
      description: "Οδηγός για τα tokens στο Solana blockchain και πώς να δημιουργήσετε τα δικά σας",
      category: "tokens"
    },
    {
      url: "https://docs.rs/spl-associated-token-account/latest/spl_associated_token_account/",
      title: "Associated Token Account",
      description: "Τεκμηρίωση για το Associated Token Account Program του Solana",
      category: "accounts"
    },
    {
      url: "https://solana.stackexchange.com/questions/2107/what-is-the-difference-between-token-program-id-and-associated-token-account-pro",
      title: "Token Programs vs. Associated Token Accounts",
      description: "Διαφορές μεταξύ Token Program και Associated Token Account Program",
      category: "programs"
    },
    {
      url: "https://michaelhly.com/solana-py/spl/memo/instructions/",
      title: "SPL Memo Instructions",
      description: "Πληροφορίες για το SPL Memo Program και τις εντολές του",
      category: "programs"
    },
    {
      url: "https://github.com/solana-foundation/explorer/blob/master/app/utils/programs.ts",
      title: "Λίστα Γνωστών Programs",
      description: "Πηγαίος κώδικας από το Solana Explorer με τη λίστα γνωστών programs",
      category: "programs"
    },
    {
      url: "https://www.rareskills.io/post/solana-sysvar",
      title: "Solana Sysvar",
      description: "Επεξήγηση των Solana System Variables (Sysvar)",
      category: "development"
    },
    {
      url: "https://www.helius.dev/docs/api-reference/endpoints",
      title: "Helius API Reference",
      description: "Τεκμηρίωση για τα endpoints του Helius API για Solana",
      category: "api"
    },
    {
      url: "https://www.quicknode.com/docs/quicknode-sdk/Solana/Overview",
      title: "QuickNode SDK for Solana",
      description: "Τεκμηρίωση για το QuickNode SDK για το Solana blockchain",
      category: "api"
    },
    {
      url: "https://docs.moralis.com/web3-data-api/solana",
      title: "Moralis Solana API",
      description: "Τεκμηρίωση για το Moralis Web3 Data API για το Solana blockchain",
      category: "api"
    }
  ];
  
  // Φιλτράρισμα πόρων με βάση το search query και την επιλεγμένη κατηγορία
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Τεκμηρίωση και Αναφορές Solana</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Χρήσιμοι σύνδεσμοι και πόροι για την ανάπτυξη εφαρμογών στο Solana blockchain.
          Αυτοί οι σύνδεσμοι χρησιμοποιήθηκαν για την ανάπτυξη της πλατφόρμας και μπορούν
          να λειτουργήσουν ως αναφορά για μελλοντική ανάπτυξη.
        </p>

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Input
              placeholder="Αναζήτηση τεκμηρίωσης..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex flex-wrap">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="mb-1">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="py-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">
                    {resource.title}
                  </CardTitle>
                  <Badge variant="outline">
                    {categories.find(cat => cat.id === resource.category)?.name || resource.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground mb-3">
                  {resource.description}
                </p>
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(resource.url, "_blank")}
                  >
                    Άνοιγμα Συνδέσμου
                  </Button>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {resource.url}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Δεν βρέθηκαν αποτελέσματα για τα κριτήρια αναζήτησης.</p>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      <div className="text-sm text-muted-foreground">
        <p className="mb-2">Οι παραπάνω σύνδεσμοι παρέχονται ως αναφορά και ανήκουν στους αντίστοιχους ιδιοκτήτες τους.</p>
        <p>Η πλατφόρμα δεν φέρει ευθύνη για το περιεχόμενο των εξωτερικών συνδέσμων.</p>
      </div>
    </div>
  );
}
