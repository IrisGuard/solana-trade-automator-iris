
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, Filter, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ApiKeyFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterService: string;
  setFilterService: (service: string) => void;
  showAdvancedFilters?: boolean;
  onToggleAdvancedFilters?: () => void;
  statusFilter?: string | null;
  setStatusFilter?: (status: string | null) => void;
  dateFilter?: 'all' | 'recent' | 'old' | 'custom';
  setDateFilter?: (filter: 'all' | 'recent' | 'old' | 'custom') => void;
}

export const ApiKeyFilters = ({
  searchTerm,
  setSearchTerm,
  filterService,
  setFilterService,
  showAdvancedFilters = false,
  onToggleAdvancedFilters = () => {},
  statusFilter = null,
  setStatusFilter = () => {},
  dateFilter = 'all',
  setDateFilter = () => {}
}: ApiKeyFiltersProps) => {
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(tempSearchTerm);
  };
  
  const clearSearch = () => {
    setTempSearchTerm("");
    setSearchTerm("");
  };

  const services = [
    { value: "all", label: "Όλες οι υπηρεσίες" },
    { value: "supabase", label: "Supabase" },
    { value: "solana", label: "Solana" },
    { value: "phantom", label: "Phantom" },
    { value: "solscan", label: "Solscan" },
    { value: "jupiter", label: "Jupiter" },
    { value: "helius", label: "Helius" },
    { value: "quicknode", label: "QuickNode" },
    { value: "vercel", label: "Vercel" },
    { value: "github", label: "GitHub" },
    { value: "stripe", label: "Stripe" },
    { value: "openai", label: "OpenAI" },
    { value: "firebase", label: "Firebase" },
    { value: "aws", label: "AWS" },
    { value: "google", label: "Google" },
    { value: "other", label: "Άλλο" }
  ];

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Αναζήτηση κλειδιών..."
            className="pl-8"
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
          />
          {tempSearchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Όλες οι υπηρεσίες" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Υπηρεσίες</SelectLabel>
              {services.map(service => (
                <SelectItem key={service.value} value={service.value}>
                  {service.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </form>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {searchTerm && <span>Αναζήτηση για: <strong>{searchTerm}</strong></span>}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Προχωρημένα φίλτρα</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Φίλτρα κλειδιών API</h4>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Κατάσταση</h5>
                <RadioGroup value={statusFilter || 'all'} onValueChange={setStatusFilter}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="filter-status-all" />
                    <Label htmlFor="filter-status-all">Όλα</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="filter-status-active" />
                    <Label htmlFor="filter-status-active">Ενεργά</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expired" id="filter-status-expired" />
                    <Label htmlFor="filter-status-expired">Ληγμένα</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="revoked" id="filter-status-revoked" />
                    <Label htmlFor="filter-status-revoked">Ανακλημένα</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Ημερομηνία δημιουργίας</h5>
                <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="filter-date-all" />
                    <Label htmlFor="filter-date-all">Όλες</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recent" id="filter-date-recent" />
                    <Label htmlFor="filter-date-recent">Πρόσφατα (30 ημέρες)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="old" id="filter-date-old" />
                    <Label htmlFor="filter-date-old">Παλαιότερα (>30 ημέρες)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <Button className="w-full" variant="outline" onClick={onToggleAdvancedFilters}>
                Εφαρμογή φίλτρων
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
