
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Clock, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface LogRecord {
  type: 'error' | 'warn' | 'info';
  message: string;
  timestamp: string | Date;
}

export function ConsoleLogsViewer() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'error' | 'warn'>('all');
  const { t } = useLanguage();

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          {t("settings.consoleLogMonitoring")}
          {logs.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {filteredLogs.length}
            </Badge>
          )}
        </h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={activeTab === 'all' ? 'bg-muted' : ''}
            onClick={() => setActiveTab('all')}
          >
            {t("settings.all")}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={`flex items-center gap-1 ${activeTab === 'error' ? 'bg-muted' : ''}`}
            onClick={() => setActiveTab('error')}
          >
            <AlertCircle className="h-3 w-3" />
            {t("settings.errors")}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={`flex items-center gap-1 ${activeTab === 'warn' ? 'bg-muted' : ''}`}
            onClick={() => setActiveTab('warn')}
          >
            <AlertTriangle className="h-3 w-3" />
            {t("settings.warnings")}
          </Button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          <p>{t("settings.noConsoleMessagesRecorded")}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-md">
            <div className="p-2 bg-muted font-medium border-b">{t("settings.messagesList")}</div>
            <ScrollArea className="h-60">
              {filteredLogs.map((log, index) => (
                <div 
                  key={index}
                  className={`p-2 border-b hover:bg-accent cursor-pointer ${selectedLog === log ? 'bg-accent' : ''}`}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="font-medium truncate flex items-center gap-1">
                    {getLogIcon(log.type)}
                    <span className="max-w-[85%] truncate">{log.message || t("settings.unknownMessage")}</span>
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
            <div className="p-2 bg-muted font-medium border-b">{t("settings.details")}</div>
            <ScrollArea className="h-60 p-3">
              {selectedLog ? (
                <>
                  <div className="mb-2">
                    <span className="font-medium">{t("settings.type")}:</span>
                    <div className="flex items-center gap-2 bg-muted p-2 rounded mt-1 text-sm">
                      {getLogIcon(selectedLog.type)}
                      <span>
                        {selectedLog.type === 'error' ? t("settings.error") : 
                         selectedLog.type === 'warn' ? t("settings.warning") : t("settings.information")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="font-medium">{t("settings.message")}:</span>
                    <div className="bg-muted p-2 rounded mt-1 text-sm">{selectedLog.message}</div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="font-medium">{t("settings.timestamp")}:</span>
                    <div className="bg-muted p-2 rounded mt-1 text-sm">{formatDate(selectedLog.timestamp)}</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t("settings.selectMessageForDetails")}</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}

      <div className="flex justify-between">
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
