
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { syncAllHeliusData } from '@/utils/syncHeliusKeys';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';

interface HeliusSyncComponentProps {
  onSync?: () => void;
}

export function HeliusSyncComponent({ onSync }: HeliusSyncComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSync = async () => {
    if (!user?.id) {
      toast.error('Δεν υπάρχει συνδεδεμένος χρήστης');
      return false;
    }

    setIsLoading(true);
    try {
      await syncAllHeliusData(user.id);
      toast.success('Συγχρονισμός Helius ολοκληρώθηκε');
      onSync?.();
      return true;
    } catch (error) {
      console.error('Helius sync error:', error);
      toast.error('Σφάλμα κατά τον συγχρονισμό Helius');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
      Συγχρονισμός Helius
    </Button>
  );
}
