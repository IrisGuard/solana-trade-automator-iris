
import React, { useState } from 'react';
import { useApiVault } from './hooks/useApiVault';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Key, Download, Copy, RefreshCw } from 'lucide-react';
import { ApiKey } from './types';
import { toast } from 'sonner';

export const KeyRecoveryView: React.FC = () => {
  const { 
    recoveredKeys, 
    recoveryLocations,
    isRecovering, 
    recoverySuccess,
    recoveryError,
    handleRecoverKeys
  } = useApiVault();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaths, setShowPaths] = useState(false);
  
  const filteredKeys = recoveredKeys.filter(key => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      key.name.toLowerCase().includes(lowerSearch) ||
      key.service.toLowerCase().includes(lowerSearch) ||
      key.key.toLowerCase().includes(lowerSearch) ||
      (key.source && key.source.toLowerCase().includes(lowerSearch))
    );
  });
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error("Αποτυχία αντιγραφής στο πρόχειρο"));
  };
  
  const exportKeysAsJson = () => {
    try {
      const jsonData = JSON.stringify(recoveredKeys, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recovered-api-keys.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Τα κλειδιά εξήχθησαν επιτυχώς");
    } catch (error) {
      console.error("Error exporting keys:", error);
      toast.error("Σφάλμα κατά την εξαγωγή των κλειδιών");
    }
  };

  return (
    <div className="space-y-4">
      {!recoverySuccess && !isRecovering && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Key className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">Ανακτήστε τα κλειδιά API σας</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Αυτό το εργαλείο θα σαρώσει όλες τις πιθανές τοποθεσίες αποθήκευσης στον περιηγητή σας,
            συμπεριλαμβανομένων εφαρμογών που δεν λειτουργούν πλέον (όπως το rork.app).
          </p>
          <Button 
            onClick={handleRecoverKeys} 
            disabled={isRecovering}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Ανάκτηση Κλειδιών
          </Button>
        </div>
      )}
      
      {isRecovering && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium mb-2">Γίνεται σάρωση για κλειδιά API...</h3>
          <p className="text-muted-foreground">
            Αυτή η διαδικασία μπορεί να διαρκέσει λίγα δευτερόλεπτα
          </p>
        </div>
      )}
      
      {recoveryError && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive font-medium">Σφάλμα κατά την ανάκτηση: {recoveryError}</p>
          </CardContent>
        </Card>
      )}
      
      {recoverySuccess && recoveredKeys.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-medium">
              Βρέθηκαν {recoveredKeys.length} κλειδιά σε {recoveryLocations.length} τοποθεσίες
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPaths(!showPaths)}
              >
                {showPaths ? "Απόκρυψη διαδρομών" : "Εμφάνιση διαδρομών"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportKeysAsJson}
                className="gap-1"
              >
                <Download className="h-4 w-4" />
                Εξαγωγή JSON
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση κλειδιών..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <ScrollArea className="h-[500px] rounded-md border">
            <div className="p-4 space-y-4">
              {showPaths && recoveryLocations.length > 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Τοποθεσίες που σαρώθηκαν:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {recoveryLocations.map((location, index) => (
                        <div key={`loc-${index}`} className="flex justify-between">
                          <span>{location.storageKey}</span>
                          <span className="font-medium">{location.count} κλειδιά</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            
              {filteredKeys.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Δεν βρέθηκαν κλειδιά που να ταιριάζουν με την αναζήτηση</p>
                </div>
              ) : (
                filteredKeys.map((key, index) => (
                  <KeyItem key={`key-${index}`} apiKey={key} />
                ))
              )}
            </div>
          </ScrollArea>
          
          <div className="flex justify-center gap-2">
            <Button 
              onClick={handleRecoverKeys}
              variant="outline" 
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Επανασάρωση
            </Button>
            <Button 
              onClick={() => copyToClipboard(
                JSON.stringify(recoveredKeys, null, 2),
                "Όλα τα κλειδιά αντιγράφηκαν στο πρόχειρο!"
              )}
              className="gap-1"
            >
              <Copy className="h-4 w-4" />
              Αντιγραφή Όλων
            </Button>
          </div>
        </div>
      )}
      
      {recoverySuccess && recoveredKeys.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <h3 className="text-xl font-medium mb-2">Δεν βρέθηκαν κλειδιά API</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Δεν βρέθηκαν αποθηκευμένα κλειδιά API στον περιηγητή σας.
          </p>
          <Button 
            onClick={handleRecoverKeys} 
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Επανασάρωση
          </Button>
        </div>
      )}
    </div>
  );
};

interface KeyItemProps {
  apiKey: ApiKey;
}

const KeyItem: React.FC<KeyItemProps> = ({ apiKey }) => {
  const [revealed, setRevealed] = useState(false);
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error("Αποτυχία αντιγραφής στο πρόχειρο"));
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">
              {apiKey.name || 'Χωρίς Όνομα'}
            </h4>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full capitalize">
              {apiKey.service || 'unknown'}
            </span>
          </div>
          
          <div>
            <div className="relative flex items-center">
              <div className="bg-muted p-2 rounded-md text-sm font-mono w-full overflow-x-auto">
                {revealed ? apiKey.key : '•'.repeat(Math.min(apiKey.key.length, 30))}
              </div>
              <div className="absolute right-1 flex gap-1">
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setRevealed(!revealed)}
                >
                  <Key className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(apiKey.key, "Το κλειδί αντιγράφηκε στο πρόχειρο!")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between text-xs text-muted-foreground">
            <div>
              {apiKey.createdAt && (
                <span>
                  Δημιουργήθηκε: {new Date(apiKey.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {apiKey.source && (
              <div title={apiKey.source}>
                Πηγή: {apiKey.source.length > 30 ? apiKey.source.substring(0, 30) + '...' : apiKey.source}
              </div>
            )}
          </div>
          
          {apiKey.description && (
            <div className="text-xs text-muted-foreground mt-1">
              {apiKey.description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
