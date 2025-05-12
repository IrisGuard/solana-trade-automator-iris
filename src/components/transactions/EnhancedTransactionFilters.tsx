
import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EnhancedTransactionFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  tokenFilter: string;
  setTokenFilter: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  uniqueTokens: string[];
}

export function EnhancedTransactionFilters({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  tokenFilter,
  setTokenFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  uniqueTokens
}: EnhancedTransactionFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <Input
            placeholder="Αναζήτηση συναλλαγής..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Τύπος συναλλαγής" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι οι τύποι</SelectItem>
            <SelectItem value="buy">Αγορά</SelectItem>
            <SelectItem value="sell">Πώληση</SelectItem>
            <SelectItem value="swap">Ανταλλαγή</SelectItem>
            <SelectItem value="transfer">Μεταφορά</SelectItem>
          </SelectContent>
        </Select>

        {/* Token Filter */}
        <Select value={tokenFilter} onValueChange={setTokenFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Επιλογή Token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλα τα tokens</SelectItem>
            {uniqueTokens.map((token) => (
              <SelectItem key={token} value={token}>
                {token}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Date Range - Start */}
        <div className="flex-1 min-w-[200px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, "d MMMM yyyy", { locale: el })
                ) : (
                  <span>Από ημερομηνία</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range - End */}
        <div className="flex-1 min-w-[200px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(endDate, "d MMMM yyyy", { locale: el })
                ) : (
                  <span>Έως ημερομηνία</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => (startDate ? date < startDate : false)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear filters */}
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery("");
            setTypeFilter("all");
            setTokenFilter("all");
            setStartDate(undefined);
            setEndDate(undefined);
          }}
        >
          Καθαρισμός φίλτρων
        </Button>
      </div>
    </div>
  );
}
