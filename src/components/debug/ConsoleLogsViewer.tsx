
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ConsoleLog {
  type: 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

export function ConsoleLogsViewer() {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ConsoleLog | null>(null);
  const { t } = useLanguage();

  const loadLogs = () => {
    try {
      const storedLogs = JSON.parse(localStorage.getItem('app_console_logs') || '[]');
      setLogs(storedLogs);
    } catch (e) {
      console.error("Σφάλμα κατά τη φόρτωση των console logs:", e);
      setLogs([]);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const clearLogs = () => {
    try {
      localStorage.setItem('app_console_logs', '[]');
      setLogs([]);
      setSelectedLog(null);
    } catch (e) {
      console.error("Σφάλμα κατά την εκκαθάριση των logs:", e);
    }
  };

  // Μορφοποίηση ημερομηνίας
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('el-GR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warn': return 'warning';
      case 'info': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border rounded-md">
        <div className="p-2 bg-muted font-medium border-b flex justify-between items-center">
          <span>{t("settings.consoleLogs")}</span>
          <Badge variant="outline">{logs.length}</Badge>
        </div>
        <ScrollArea className="h-60">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("settings.noLogsRecorded")}</p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div 
                key={index}
                className={`p-2 border-b hover:bg-accent cursor-pointer ${selectedLog === log ? 'bg-accent' : ''}`}
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(log.type)}>
                    {log.type}
                  </Badge>
                  <div className="font-medium truncate flex-1">{log.message.substring(0, 50)}{log.message.length > 50 ? '...' : ''}</div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(log.timestamp)}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
      
      <div className="border rounded-md">
        <div className="p-2 bg-muted font-medium border-b">{t("settings.details")}</div>
        <ScrollArea className="h-60 p-3">
          {selectedLog ? (
            <>
              <div className="mb-2">
                <span className="font-medium">{t("settings.type")}:</span>
                <div className="mt-1">
                  <Badge variant={getBadgeVariant(selectedLog.type)}>
                    {selectedLog.type}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-2">
                <span className="font-medium">{t("settings.message")}:</span>
                <div className="bg-muted p-2 rounded mt-1 text-sm">
                  {selectedLog.message}
                </div>
              </div>
              
              <div className="mb-2">
                <span className="font-medium">{t("settings.timestamp")}:</span>
                <div className="bg-muted p-2 rounded mt-1 text-sm">
                  {formatDate(selectedLog.timestamp)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("settings.selectLogForDetails")}</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex justify-between col-span-full">
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadLogs}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> {t("settings.refresh")}
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={clearLogs}
          disabled={logs.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" /> {t("settings.clear")}
        </Button>
      </div>
    </div>
  );
}
