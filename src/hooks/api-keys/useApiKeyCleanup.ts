
import { useState } from '../../react-compatibility';
import { ApiIntegrationService } from '@/components/security/apiVault/ApiIntegrationService';
import { ApiKey } from '@/components/security/apiVault/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useApiKeyCleanup() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    checked: number;
    valid: number;
    removed: number;
  }>({
    checked: 0,
    valid: 0,
    removed: 0,
  });
  
  const { user } = useAuth();

  const validateAllKeys = async (apiKeys: ApiKey[]) => {
    if (!user || !user.id || isRunning) return null;
    
    setIsRunning(true);
    setResults({ checked: 0, valid: 0, removed: 0 });
    
    try {
      // First, get all keys from Supabase to ensure we have the latest data
      const storedKeys = await ApiIntegrationService.fetchKeysFromSupabase(user.id);
      
      let checked = 0;
      let valid = 0;
      let removed = 0;
      
      // Test each key
      for (const key of storedKeys) {
        checked++;
        setResults(prev => ({ ...prev, checked }));
        
        const isValid = await ApiIntegrationService.testApiKey(key);
        
        if (isValid) {
          valid++;
          setResults(prev => ({ ...prev, valid }));
        } else {
          // Delete invalid key
          const wasDeleted = await ApiIntegrationService.deleteApiKey(key.id, user.id);
          if (wasDeleted) {
            removed++;
            setResults(prev => ({ ...prev, removed }));
          }
        }
        
        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Show final results
      toast.success(`Ολοκληρώθηκε ο έλεγχος κλειδιών API: ${valid} έγκυρα, ${removed} αφαιρέθηκαν`);
      
      return { checked, valid, removed };
    } catch (err) {
      console.error('Error validating API keys:', err);
      toast.error('Σφάλμα κατά τον έλεγχο των κλειδιών API');
      return null;
    } finally {
      setIsRunning(false);
    }
  };

  return {
    validateAllKeys,
    isRunning,
    results
  };
}
