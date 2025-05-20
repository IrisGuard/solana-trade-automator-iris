
import React, { useState } from 'react';
import { SiteBackupService } from '@/utils/site-protection/SiteBackupService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function PermanentRestoreButton() {
  const { t } = useTranslation();
  const [isRestoring, setIsRestoring] = useState(false);
  
  const handleRestore = () => {
    if (window.confirm(t('general.confirmRestore'))) {
      setIsRestoring(true);
      
      try {
        const success = SiteBackupService.restoreFromBackup();
        
        if (success) {
          toast.success(t('general.restoreSuccess'));
        } else {
          toast.error(t('general.restoreError'));
        }
      } catch (error) {
        console.error('Error during restore:', error);
        toast.error(t('general.restoreError'));
      } finally {
        setIsRestoring(false);
      }
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button 
        onClick={handleRestore}
        variant="destructive"
        disabled={isRestoring}
        className="flex items-center gap-2 px-4 py-2 shadow-lg"
      >
        <RefreshCw className={`size-4 ${isRestoring ? 'animate-spin' : ''}`} />
        {t('general.restore')}
      </Button>
    </div>
  );
}
