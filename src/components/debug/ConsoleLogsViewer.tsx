
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Clock, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LogRecord {
  type: 'error' | 'warn' | 'info';
  message: string;
  timestamp: string | Date;
}

export function ConsoleLogsViewer() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'error' | 'warn'>('all');

  // Φόρτωση logs από το localStorage
  const loadLogs = () => {
    try {
      const storedLogs = JSON.parse(localStorage.getItem('app_console_logs') || '[]');
      setLogs(storedLogs);
    } catch (e) {
      console.error("Σφάλμα κατά τη φόρτωση των καταγεγραμμένων logs:", e);
      setLogs([]);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Εκκαθάριση όλων των logs
  const clearLogs = () => {
    try {
      localStorage.setItem('app_console_logs', '[]');
      setLogs([]);
      setSelectedLog(null);
    } catch (e) {
      console.error("Σφάλμα κατά την εκκαθάριση των logs:", e);
    }
  };

  // Φιλτραρισμένα logs με βάση την επιλεγμένη καρτέλα
  const filteredLogs = activeTab === 'all' 
    ? logs 
    : logs.filter(log => log.type === activeTab);

  // Μορφοποίηση ημερομηνίας
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return new Intl.DateTimeFormat('el-GR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch (e) {
      return String(dateString);
    }
  };

  // Επιλογή εικονιδίου με βάση τον τύπο του log
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info':
        return <Info className="h-4 w-4 text-info" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <span>Καταγραφή Console Logs</span>
          {logs.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {logs.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Παρακολούθηση και διαχείριση των μηνυμάτων της κονσόλας για εύκολη αποσφαλμάτωση
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'error' | 'warn')}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Όλα</TabsTrigger>
            <TabsTrigger value="error" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Σφάλματα
            </TabsTrigger>
            <TabsTrigger value="warn" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Προειδοποιήσεις
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Δεν έχουν καταγραφεί μηνύματα κονσόλας</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium border-b">Λίστα Μηνυμάτων</div>
                  <ScrollArea className="h-60">
                    {filteredLogs.map((log, index) => (
                      <div 
                        key={index}
                        className={`p-2 border-b hover:bg-accent cursor-pointer ${selectedLog === log ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <div className="font-medium truncate flex items-center gap-1">
                          {getLogIcon(log.type)}
                          <span className="max-w-[85%] truncate">{log.message || "Άγνωστο μήνυμα"}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(log.timestamp)}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium border-b">Λεπτομέρειες</div>
                  <ScrollArea className="h-60 p-3">
                    {selectedLog ? (
                      <>
                        <div className="mb-2">
                          <span className="font-medium">Τύπος:</span>
                          <div className="flex items-center gap-2 bg-muted p-2 rounded mt-1 text-sm">
                            {getLogIcon(selectedLog.type)}
                            <span>
                              {selectedLog.type === 'error' ? 'Σφάλμα' : 
                               selectedLog.type === 'warn' ? 'Προειδοποίηση' : 'Πληροφορία'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-medium">Μήνυμα:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{selectedLog.message}</div>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-medium">Χρονοσφραγίδα:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{formatDate(selectedLog.timestamp)}</div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Επιλέξτε ένα μήνυμα για προβολή λεπτομερειών</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadLogs}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Ανανέωση
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={clearLogs}
          disabled={logs.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Εκκαθάριση
        </Button>
      </CardFooter>
    </Card>
  );
}
