
import React from "react";
import { Link } from "react-router-dom";

export function FooterSection() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Solana Trade Automator</h3>
            <p className="text-muted-foreground mb-4">
              Αυτοματοποιημένο trading για το Solana blockchain,
              σχεδιασμένο για traders όλων των επιπέδων.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Σύνδεσμοι</h3>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-primary hover:underline">Dashboard</Link></li>
              <li><Link to="/bot-control" className="text-primary hover:underline">Bot Control</Link></li>
              <li><Link to="/tokens" className="text-primary hover:underline">Tokens</Link></li>
              <li><Link to="/help" className="text-primary hover:underline">Βοήθεια</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Επικοινωνία</h3>
            <ul className="space-y-2">
              <li>Email: <a href="mailto:support@solanaautotrader.example" className="text-primary hover:underline">support@solanaautotrader.example</a></li>
              <li>Twitter: <a href="https://twitter.com/solanaautotrade" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@solanaautotrade</a></li>
              <li>Discord: <a href="https://discord.gg/solanaautotrade" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">discord.gg/solanaautotrade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} Solana Trade Automator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
