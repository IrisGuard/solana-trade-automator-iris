
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: "el" | "en") => {
    if (language !== newLang) {
      setLanguage(newLang);
      const langName = newLang === "el" ? "Ελληνικά" : "English";
      toast.success(newLang === "el" ? "Η γλώσσα άλλαξε σε Ελληνικά" : "Language changed to English");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Αλλαγή γλώσσας</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("el")} 
          className={language === "el" ? "bg-accent" : ""}
        >
          🇬🇷 Ελληνικά
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("en")} 
          className={language === "en" ? "bg-accent" : ""}
        >
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
