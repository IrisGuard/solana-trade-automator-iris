
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Twitter, Github } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function FooterSection() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-background/95 border-t py-8 px-4">
      <div className="container mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold mb-4">Solana Trade Automator</h3>
          <p className="text-sm text-muted-foreground">
            Αυτοματοποιημένο trading για το Solana blockchain, σχεδιασμένο για traders όλων των επιπέδων.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Σύνδεσμοι</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="text-primary hover:underline">Dashboard</Link>
            </li>
            <li>
              <Link to="/bot-control" className="text-primary hover:underline">Bot Control</Link>
            </li>
            <li>
              <Link to="/tokens" className="text-primary hover:underline">Tokens</Link>
            </li>
            <li>
              <Link to="/security" className="text-primary hover:underline">Ασφάλεια</Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Επικοινωνία</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span>Email:</span>
              <a href="mailto:support@solanaautotrader.example" className="text-primary hover:underline flex items-center">
                support@solanaautotrader.example
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span>Twitter:</span>
              <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                @solanaautotrader
                <Twitter className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span>Discord:</span>
              <a href="https://discord.gg/example" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                discord.gg/solanaautotrader
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Solana Trade Automator. Με επιφύλαξη παντός δικαιώματος.</p>
      </div>
    </footer>
  );
}
