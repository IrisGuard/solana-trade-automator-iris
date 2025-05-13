
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsoleLogsViewer } from '../debug/ConsoleLogsViewer';

interface ErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  timestamp: string;
}

export function ErrorLogsViewer() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [activeTab, setActiveTab] = useState<string>('errors');

  // Φόρτωση σφαλμάτων από το localStorage
  const loadErrors = () => {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      setErrors(storedErrors);
    } catch (e) {
      console.error("Σφάλμα κατά τη φόρτωση των καταγεγραμμένων σφαλμάτων:", e);
      setErrors([]);
    }
  };

  useEffect(() => {
    loadErrors();
  }, []);

  // Εκκαθάριση όλων των σφαλμάτων
  const clearErrors = () => {
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <span>Παρακολούθηση Σφαλμάτων</span>
          {errors.length > 0 && activeTab === 'errors' && (
            <Badge variant="destructive" className="ml-2">
              {errors.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Προβολή και διαχείριση των σφαλμάτων και των μηνυμάτων της κονσόλας για εύκολη αποσφαλμάτωση
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="errors">Σφάλματα Εφαρμογής</TabsTrigger>
            <TabsTrigger value="console">Μηνύματα Κονσόλας</TabsTrigger>
          </TabsList>

          <TabsContent value="errors" className="space-y-4">
            {errors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Δεν έχουν καταγραφεί σφάλματα</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium border-b">Λίστα Σφαλμάτων</div>
                  <ScrollArea className="h-60">
                    {errors.map((error, index) => (
                      <div 
                        key={index}
                        className={`p-2 border-b hover:bg-accent cursor-pointer ${selectedError === error ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedError(error)}
                      >
                        <div className="font-medium truncate">{error.message || "Άγνωστο σφάλμα"}</div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(error.timestamp)}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="border rounded-md">
                  <div className="p-2 bg-muted font-medium border-b">Λεπτομέρειες</div>
                  <ScrollArea className="h-60 p-3">
                    {selectedError ? (
                      <>
                        <div className="mb-2">
                          <span className="font-medium">Μήνυμα:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{selectedError.message}</div>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-medium">URL:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{selectedError.url}</div>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-medium">Χρονοσφραγίδα:</span>
                          <div className="bg-muted p-2 rounded mt-1 text-sm">{formatDate(selectedError.timestamp)}</div>
                        </div>
                        
                        {selectedError.stack && (
                          <div className="mb-2">
                            <span className="font-medium">Stack Trace:</span>
                            <div className="bg-muted p-2 rounded mt-1 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                              {selectedError.stack}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Επιλέξτε ένα σφάλμα για προβολή λεπτομερειών</p>
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
                onClick={loadErrors}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Ανανέωση
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearErrors}
                disabled={errors.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Εκκαθάριση
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
