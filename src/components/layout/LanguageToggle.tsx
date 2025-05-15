
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { GlobeIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <GlobeIcon className="h-4 w-4" />
          <span className="sr-only">Αλλαγή γλώσσας</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border border-gray-800">
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className={`${language === "en" ? "bg-gray-800" : "hover:bg-gray-800"} text-gray-200`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("el")}
          className={`${language === "el" ? "bg-gray-800" : "hover:bg-gray-800"} text-gray-200`}
        >
          Ελληνικά
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
