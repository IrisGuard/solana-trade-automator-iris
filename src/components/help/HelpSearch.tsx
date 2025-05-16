
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Bot, Lock, Wallet, Database, Settings, FileText, ExternalLink } from "lucide-react";
import { ResourceLink } from "./solana/types";
import { helpResources } from "./solana/resources";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

// Helper component for the Shield icon
const Shield = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

// Helper component for the ArrowsUpDown icon
const ArrowsUpDown = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </svg>
);

// Expanded resources for the platform-specific help items
const platformHelpResources = [
  {
    title: "Σύνδεση Πορτοφολιού Phantom",
    description: "Αναλυτικός οδηγός για τη σύνδεση του Phantom Wallet με την πλατφόρμα.",
    url: "/help#wallet-connection",
    category: "Πορτοφόλι",
    icon: <Wallet className="h-4 w-4" />
  },
  {
    title: "Δημιουργία Trading Bot",
    description: "Βήμα προς βήμα οδηγίες για την δημιουργία και παραμετροποίηση ενός Trading Bot.",
    url: "/help#create-bot",
    category: "Bots",
    icon: <Bot className="h-4 w-4" />
  },
  {
    title: "Διαχείριση API Κλειδιών",
    description: "Οδηγός για την ασφαλή αποθήκευση και διαχείριση των API κλειδιών στην κλειδοθήκη.",
    url: "/help#api-vault",
    category: "Ασφάλεια",
    icon: <Lock className="h-4 w-4" />
  },
  {
    title: "Στρατηγικές Trading",
    description: "Αναλυτική παρουσίαση των διαθέσιμων στρατηγικών trading και πώς να τις βελτιστοποιήσετε.",
    url: "/help#trading-strategies",
    category: "Trading",
    icon: <FileText className="h-4 w-4" />
  },
  {
    title: "Προστασία Συστήματος",
    description: "Πληροφορίες για τα συστήματα προστασίας και αυτόματης αποκατάστασης της εφαρμογής.",
    url: "/help#system-protection",
    category: "Ασφάλεια",
    icon: <Shield className="h-4 w-4" />
  },
  {
    title: "Ρυθμίσεις Ασφαλείας Συναλλαγών",
    description: "Οδηγός για τη διαμόρφωση των ρυθμίσεων ασφαλείας των συναλλαγών σας.",
    url: "/help#transaction-security",
    category: "Ασφάλεια",
    icon: <Settings className="h-4 w-4" />
  },
  {
    title: "Ανάλυση Δεδομένων & Αναφορές",
    description: "Πώς να χρησιμοποιήσετε τα εργαλεία ανάλυσης για τη βελτιστοποίηση των συναλλαγών σας.",
    url: "/help#data-analytics",
    category: "Analytics",
    icon: <Database className="h-4 w-4" />
  },
  {
    title: "Ανταλλαγή Tokens (Swapping)",
    description: "Οδηγός για την ανταλλαγή tokens με τις καλύτερες τιμές μέσω του Jupiter Aggregator.",
    url: "/help#token-swapping",
    category: "Trading",
    icon: <ArrowsUpDown className="h-4 w-4" />
  },
  {
    title: "Backtesting Στρατηγικών",
    description: "Πώς να χρησιμοποιήσετε το εργαλείο backtesting για τη δοκιμή των στρατηγικών σας.",
    url: "/help#backtesting",
    category: "Analytics",
    icon: <BookOpen className="h-4 w-4" />
  },
];

// Combine the resources
const allResources = [...helpResources, ...platformHelpResources];

export function HelpSearch() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Extract unique categories for filtering
  const categories = Array.from(new Set(allResources.map(resource => resource.category)));
  
  const handleSearch = () => {
    if (!searchTerm.trim() && !categoryFilter) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Apply search and category filters
    const results = allResources.filter(resource => {
      const termMatch = !searchTerm.trim() || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = !categoryFilter || resource.category === categoryFilter;
      
      return termMatch && categoryMatch;
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };
  
  // Handle search when category or term changes
  React.useEffect(() => {
    handleSearch();
  }, [categoryFilter]);
  
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-2">{t("help.searchResources")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("help.exploreResources")}
        </p>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Αναζήτηση οδηγών και πόρων..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4 mr-2" />
          Αναζήτηση
        </Button>
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={categoryFilter === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCategoryFilter(null)}
        >
          Όλες οι κατηγορίες
        </Badge>
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant={categoryFilter === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
      
      <div className="space-y-4 pt-2">
        {searchResults.length === 0 && (searchTerm.trim() !== "" || categoryFilter) ? (
          <p className="text-center text-muted-foreground py-8">
            {t("help.noResourcesFound")}
          </p>
        ) : searchResults.length > 0 ? (
          <>
            <div className="text-sm text-muted-foreground">
              {searchResults.length} {searchResults.length === 1 ? "αποτέλεσμα" : "αποτελέσματα"} 
              {categoryFilter && ` στην κατηγορία "${categoryFilter}"`}
              {searchTerm && ` για "${searchTerm}"`}
            </div>
            {searchResults.map((result, index) => (
              <div key={index} className="border rounded-md p-3 hover:bg-accent">
                <a 
                  href={result.url} 
                  target={result.url.startsWith("http") ? "_blank" : "_self"}
                  rel={result.url.startsWith("http") ? "noopener noreferrer" : ""}
                  className="block"
                >
                  <div className="flex items-center gap-2">
                    {result.icon && <div className="text-primary">{result.icon}</div>}
                    <h3 className="font-medium text-primary">{result.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs bg-muted inline-block px-2 py-0.5 rounded">
                      {result.category}
                    </div>
                    {result.url.startsWith("http") && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </a>
              </div>
            ))}
          </>
        ) : (
          // Show suggested resources when no search is performed
          <div className="space-y-4">
            <h4 className="font-medium">Προτεινόμενοι πόροι</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {platformHelpResources.slice(0, 6).map((resource, index) => (
                <div key={index} className="border rounded-md p-3 hover:bg-accent">
                  <a 
                    href={resource.url} 
                    className="block"
                  >
                    <div className="flex items-center gap-2">
                      {resource.icon && <div className="text-primary">{resource.icon}</div>}
                      <h3 className="font-medium text-primary text-sm">{resource.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
