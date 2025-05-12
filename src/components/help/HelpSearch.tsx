
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type SearchResult = {
  title: string;
  description: string;
  category: string;
  relevance: number;
};

export function HelpSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Προσομοίωση αναζήτησης
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Προσομοίωση καθυστέρησης αναζήτησης
    setTimeout(() => {
      // Προσομοιώνουμε κάποια αποτελέσματα αναζήτησης
      const dummyResults: SearchResult[] = [
        {
          title: "Σύνδεση πορτοφολιού Phantom",
          description: "Οδηγίες για τη σύνδεση του πορτοφολιού Phantom στην πλατφόρμα.",
          category: "Wallet",
          relevance: 0.95
        },
        {
          title: "Προσθήκη API κλειδιού",
          description: "Διαδικασία προσθήκης νέου API κλειδιού στο API Vault.",
          category: "Ασφάλεια",
          relevance: 0.85
        },
        {
          title: "Ρύθμιση παραμέτρων του bot",
          description: "Οδηγίες για τη ρύθμιση των παραμέτρων του trading bot.",
          category: "Trading Bot",
          relevance: 0.80
        },
        {
          title: "Προβολή ιστορικού συναλλαγών",
          description: "Πώς να προβάλετε και να φιλτράρετε το ιστορικό συναλλαγών σας.",
          category: "Συναλλαγές",
          relevance: 0.75
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(dummyResults);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Αναζητήστε βοήθεια, εντολές, οδηγίες..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleSearch}>Αναζήτηση</Button>
      </div>

      {isSearching ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Αναζήτηση...</p>
        </div>
      ) : (
        <>
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div key={idx} className="border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{result.title}</h3>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">{result.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Δεν βρέθηκαν αποτελέσματα για "{searchQuery}".</p>
              <p className="text-sm text-muted-foreground mt-2">Δοκιμάστε άλλους όρους αναζήτησης ή περιηγηθείτε στον οδηγό πλατφόρμας.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Εισάγετε κάποιον όρο αναζήτησης για να βρείτε βοήθεια σχετικά με την πλατφόρμα.</p>
              <p className="text-sm text-muted-foreground mt-2">Μπορείτε να αναζητήσετε εντολές, λειτουργίες ή οδηγίες χρήσης.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
