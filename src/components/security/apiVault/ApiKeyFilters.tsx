
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApiKeyFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterService: string;
  setFilterService: React.Dispatch<React.SetStateAction<string>>;
}

export const ApiKeyFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterService, 
  setFilterService 
}: ApiKeyFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Αναζήτηση κλειδιών..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select 
        value={filterService} 
        onValueChange={setFilterService}
      >
        <SelectTrigger className="sm:w-[180px]">
          <SelectValue placeholder="Όλες οι υπηρεσίες" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Όλες οι υπηρεσίες</SelectItem>
          <SelectItem value="supabase">Supabase</SelectItem>
          <SelectItem value="vercel">Vercel</SelectItem>
          <SelectItem value="solana">Solana</SelectItem>
          <SelectItem value="aws">AWS</SelectItem>
          <SelectItem value="github">GitHub</SelectItem>
          <SelectItem value="stripe">Stripe</SelectItem>
          <SelectItem value="openai">OpenAI</SelectItem>
          <SelectItem value="firebase">Firebase</SelectItem>
          <SelectItem value="other">Άλλες</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
