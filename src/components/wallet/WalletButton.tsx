
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export function WalletButton() {
  return (
    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
      <Wallet className="h-4 w-4" />
    </Button>
  );
}
