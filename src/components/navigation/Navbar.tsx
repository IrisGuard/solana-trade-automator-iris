
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { Button } from '../ui/button';
import { Home, Wallet, BarChart2, Settings } from 'lucide-react';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SolWallet</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
              <Home className="mr-1 h-4 w-4" />
              Αρχική
            </Link>
            <Link to="/wallet" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
              <Wallet className="mr-1 h-4 w-4" />
              Πορτοφόλι
            </Link>
            <Link to="/dashboard" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
              <BarChart2 className="mr-1 h-4 w-4" />
              Στατιστικά
            </Link>
            <Link to="/settings" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
              <Settings className="mr-1 h-4 w-4" />
              Ρυθμίσεις
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link to="/auth">Σύνδεση</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
