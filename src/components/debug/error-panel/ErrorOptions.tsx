
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useErrorOptions } from './ErrorOptionsContext';

export function ErrorOptions() {
  const {
    errorMessage,
    showToast,
    logToConsole,
    sendToChat,
    useCollector,
    setErrorMessage,
    setShowToast,
    setLogToConsole,
    setSendToChat,
    setUseCollector
  } = useErrorOptions();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="errorMessage">Μήνυμα Σφάλματος</Label>
        <Input 
          id="errorMessage" 
          value={errorMessage} 
          onChange={(e) => setErrorMessage(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex items-center">
          <input 
            type="checkbox"
            checked={showToast}
            onChange={() => setShowToast(!showToast)}
            className="mr-2"
          />
          Εμφάνιση Toast
        </label>
        <label className="inline-flex items-center">
          <input 
            type="checkbox"
            checked={logToConsole}
            onChange={() => setLogToConsole(!logToConsole)}
            className="mr-2"
          />
          Καταγραφή στην κονσόλα
        </label>
        <label className="inline-flex items-center">
          <input 
            type="checkbox"
            checked={sendToChat}
            onChange={() => setSendToChat(!sendToChat)}
            className="mr-2"
          />
          Αποστολή στο Chat
        </label>
        <label className="inline-flex items-center">
          <input 
            type="checkbox"
            checked={useCollector}
            onChange={() => setUseCollector(!useCollector)}
            className="mr-2"
          />
          Χρήση Collector
        </label>
      </div>
    </>
  );
}
