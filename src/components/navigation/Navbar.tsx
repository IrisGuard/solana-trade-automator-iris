
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useUser } from '@/hooks/useUser';

export function Navbar() {
  const { user } = useUser();

  return (
    <nav className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <span>SolTrader</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Αρχική
            </Link>
            <Link to="/wallet" className="text-sm font-medium transition-colors hover:text-primary">
              Πορτοφόλι
            </Link>
            <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Σύνδεση
              </Button>
            </Link>
          ) : (
            <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !rounded-md !h-9 !px-4" />
          )}
        </div>
      </div>
    </nav>
  );
}
