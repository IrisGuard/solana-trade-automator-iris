
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsoleLogsViewer } from '../debug/ConsoleLogsViewer';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from "@/integrations/supabase/client";

interface ErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  timestamp: string;
}

interface DatabaseErrorLog {
  id: string;
  error_message: string;
  error_stack?: string;
  component?: string;
  source: string;
  url?: string;
  created_at: string;
  browser_info?: any;
  resolved: boolean;
  resolution_notes?: string;
}

export function ErrorLogsViewer() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [databaseErrors, setDatabaseErrors] = useState<DatabaseErrorLog[]>([]);
  const [selectedError, setSelectedError] = useState<ErrorLog | DatabaseErrorLog | null>(null);
  const [activeTab, setActiveTab] = useState<string>('errors');
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useLanguage();

  // Φόρτωση σφαλμάτων από το localStorage
  const loadLocalErrors = () => {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      setErrors(storedErrors);
    } catch (e) {
      console.error("Σφάλμα κατά τη φόρτωση των καταγεγραμμένων σφαλμάτων:", e);
      setErrors([]);
    }
  };

  // Φόρτωση σφαλμάτων από τη βάση δεδομένων
  const loadDatabaseErrors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      if (data) {
        setDatabaseErrors(data);
      }
    } catch (e) {
      console.error("Σφάλμα κατά τη φόρτωση των σφαλμάτων από τη βάση:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocalErrors();
    loadDatabaseErrors();
  }, []);

  // Εκκαθάριση όλων των σφαλμάτων
  const clearLocalErrors = () => {
    try {
      localStorage.setItem('app_errors', '[]');
      setErrors([]);
      setSelectedError(null);
    } catch (e) {
      console.error("Σφάλμα κατά την εκκαθάριση των σφαλμάτων:", e);
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

  // Σημειώνει ένα σφάλμα ως επιλυμένο
  const markAsResolved = async (id: string, notes: string = "") => {
    try {
      const { error } = await supabase
        .from('error_logs')
        .update({ 
          resolved: true,
          resolution_notes: notes || 'Επιλύθηκε από τον διαχειριστή'
        })
        .match({ id });

      if (error) {
        throw error;
      }

      // Ανανέωση της λίστας σφαλμάτων
      loadDatabaseErrors();
    } catch (e) {
      console.error("Σφάλμα κατά την ενημέρωση του σφάλματος:", e);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <span>{t("settings.errorMonitoring")}</span>
          {errors.length > 0 && activeTab === 'errors' && (
            <Badge variant="destructive" className="ml-2">
              {errors.length}
            </Badge>
          )}
          {databaseErrors.length > 0 && activeTab === 'database' && (
            <Badge variant="default" className="ml-2">
              {databaseErrors.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {t("settings.errorMonitoringDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="errors">{t("settings.applicationErrors")}</TabsTrigger>
            <TabsTrigger value="database">{t("settings.databaseErrors")}</TabsTrigger>
            <TabsTrigger value="console">{t("settings.consoleMessages")}</TabsTrigger>
          </TabsList>

          <TabsContent value="errors" className="space-y-4">
            {errors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("settings.noErrorsRecorded")}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium border-b">{t("settings.errorsList")}</div>
                  <ScrollArea className="h-60">
                    {errors.map((error, index) => (
                      <div 
                        key={index}
                        className={`p-2 border-b hover:bg-accent cursor-pointer ${selectedError === error ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedError(error)}
                      >
                        <div className="font-medium truncate">{error.message || t("settings.unknownError")}</div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(error.timestamp)}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium border-b">{t("settings.details")}</div>
                  <ScrollArea className="h-60 p-3">
                    {selectedError ? (
                      <>
                        <div className="mb-2">
                          <span className="font-medium">{t("settings.message")}:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{'message' in selectedError ? selectedError.message : selectedError.error_message}</div>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-medium">URL:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{'url' in selectedError ? selectedError.url : (selectedError.url || 'N/A')}</div>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-medium">{t("settings.timestamp")}:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">
                            {formatDate('timestamp' in selectedError ? selectedError.timestamp : selectedError.created_at)}
                          </div>
                        </div>
                        
                        {'stack' in selectedError && selectedError.stack && (
                          <div className="mb-2">
                            <span className="font-medium">Stack Trace:</span>
                            <div className="bg-muted p-2 rounded mt-1 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                              {selectedError.stack}
                            </div>
                          </div>
                        )}

                        {'error_stack' in selectedError && selectedError.error_stack && (
                          <div className="mb-2">
                            <span className="font-medium">Stack Trace:</span>
                            <div className="bg-muted p-2 rounded mt-1 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                              {selectedError.error_stack}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>{t("settings.selectErrorForDetails")}</p>
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
                onClick={loadLocalErrors}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> {t("settings.refresh")}
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearLocalErrors}
                disabled={errors.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" /> {t("settings.clear")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>{t("settings.loading")}</p>
              </div>
            ) : databaseErrors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("settings.noDatabaseErrorsRecorded")}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium border-b">{t("settings.databaseErrorsList")}</div>
                  <ScrollArea className="h-60">
                    {databaseErrors.map((error) => (
                      <div 
                        key={error.id}
                        className={`p-2 border-b hover:bg-accent cursor-pointer ${selectedError === error ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedError(error)}
                      >
                        <div className="flex items-center">
                          <div className="font-medium truncate flex-1">
                            {error.error_message.substring(0, 50)}{error.error_message.length > 50 ? '...' : ''}
                          </div>
                          <Badge variant={error.resolved ? "outline" : "secondary"} className="ml-2">
                            {error.resolved ? t("settings.resolved") : t("settings.unresolved")}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(error.created_at)}
                          </div>
                          <div>{error.source}</div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium border-b">{t("settings.details")}</div>
                  <ScrollArea className="h-60 p-3">
                    {'error_message' in selectedError && (
                      <>
                        <div className="mb-2">
                          <span className="font-medium">{t("settings.message")}:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{selectedError.error_message}</div>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-medium">{t("settings.source")}:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{selectedError.source}</div>
                        </div>
                        
                        {selectedError.url && (
                          <div className="mb-2">
                            <span className="font-medium">URL:</span>
                            <div className="bg-muted p-2 rounded mt-1 text-sm">{selectedError.url}</div>
                          </div>
                        )}
                        
                        {selectedError.component && (
                          <div className="mb-2">
                            <span className="font-medium">{t("settings.component")}:</span>
                            <div className="bg-muted p-2 rounded mt-1 text-sm">{selectedError.component}</div>
                          </div>
                        )}
                        
                        <div className="mb-2">
                          <span className="font-medium">{t("settings.timestamp")}:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{formatDate(selectedError.created_at)}</div>
                        </div>
                        
                        {selectedError.error_stack && (
                          <div className="mb-2">
                            <span className="font-medium">Stack Trace:</span>
                            <div className="bg-muted p-2 rounded mt-1 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                              {selectedError.error_stack}
                            </div>
                          </div>
                        )}

                        {!selectedError.resolved && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => markAsResolved(selectedError.id)}
                          >
                            {t("settings.markAsResolved")}
                          </Button>
                        )}

                        {selectedError.resolved && selectedError.resolution_notes && (
                          <div className="mt-2 p-2 bg-accent/50 rounded">
                            <span className="font-medium">{t("settings.resolutionNotes")}:</span>
                            <p className="text-sm mt-1">{selectedError.resolution_notes}</p>
                          </div>
                        )}
                      </>
                    )}
                    
                    {!selectedError && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>{t("settings.selectErrorForDetails")}</p>
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
                onClick={loadDatabaseErrors}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></span>
                    {t("settings.loading")}
                  </span>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" /> {t("settings.refresh")}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="console">
            <ConsoleLogsViewer />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
