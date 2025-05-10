
import React from "react";
import { Link } from "react-router-dom";

export function FooterSection() {
  return (
    <footer className="mt-12 pt-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-3">Solana Trade Automator</h3>
          <p className="text-sm text-muted-foreground">
            Αυτοματοποιημένο trading για το Solana blockchain,
            δημιουργημένο για traders όλων των επιπέδων.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-3">Σύνδεσμοι</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/bot-control" className="text-muted-foreground hover:text-foreground">Bot Control</Link></li>
            <li><Link to="/tokens" className="text-muted-foreground hover:text-foreground">Tokens</Link></li>
            <li><Link to="/security" className="text-muted-foreground hover:text-foreground">Security</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Επικοινωνία</h3>
          <p className="text-sm text-muted-foreground">
            Email: support@solanaautotrader.example<br />
            Twitter: @solanaautotrader<br />
            Discord: discord.gg/solanaautotrader
          </p>
        </div>
      </div>
      <p className="text-center text-muted-foreground text-sm pt-8 pb-2">
        &copy; {new Date().getFullYear()} Solana Trade Automator. Με επιφύλαξη παντός δικαιώματος.
      </p>
    </footer>
  );
}
