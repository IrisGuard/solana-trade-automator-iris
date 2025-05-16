
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Server, Wifi, Terminal, Database, RefreshCw, Trash2, CheckCircle2, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useErrorDashboard } from '@/hooks/useErrorDashboard';
import { ErrorSeverity } from '@/utils/error-handling/errorTypes';

export function ErrorDashboard() {
  const { t } = useTranslation();
  const { 
    applicationErrors, 
    networkErrors, 
    consoleErrors, 
    databaseErrors,
    clearErrors,
    refreshErrors,
    resolveError,
    totalErrors
  } = useErrorDashboard();
  
  const [selectedTab, setSelectedTab] = useState('application');
  const [selectedError, setSelectedError] = useState<any>(null);

  // Reset selected error when tab changes
  useEffect(() => {
    setSelectedError(null);
  }, [selectedTab]);

  const getBadgeVariant = (severity?: ErrorSeverity | string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getErrorsByCurrentTab = () => {
    switch (selectedTab) {
      case 'application':
        return applicationErrors;
      case 'network':
        return networkErrors;
      case 'console':
        return consoleErrors;
      case 'database':
        return databaseErrors;
      default:
        return [];
    }
  };

  const renderErrorList = (errors: any[]) => {
    if (errors.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          <Info className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>{t("errors.noErrorsFound")}</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 py-2">
        {errors.map((error, index) => (
          <div
            key={error.id || index}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedError === error ? 'bg-accent' : 'hover:bg-accent/50'
            }`}
            onClick={() => setSelectedError(error)}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-2 items-start">
                <Badge variant={getBadgeVariant(error.severity)} className="mt-0.5">
                  {error.severity || 'unknown'}
                </Badge>
                <div>
                  <div className="font-medium line-clamp-1">{error.message || 'Άγνωστο σφάλμα'}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {error.component || error.source || 'Άγνωστη πηγή'} • {new Date(error.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {error.resolved && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  {t("errors.resolved")}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("errors.errorDashboard")}</h2>
          <p className="text-muted-foreground">
            {t("errors.errorDashboardDescription")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm py-1.5">
            {totalErrors} {t("errors.totalErrors")}
          </Badge>
          <Button variant="outline" size="sm" onClick={refreshErrors}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("errors.refresh")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => clearErrors(selectedTab)}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t("errors.clearErrors")}
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="application">
            <AlertCircle className="h-4 w-4 mr-2" />
            {t("errors.application")}
            {applicationErrors.length > 0 && (
              <Badge variant="secondary" className="ml-2">{applicationErrors.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="network">
            <Wifi className="h-4 w-4 mr-2" />
            {t("errors.network")}
            {networkErrors.length > 0 && (
              <Badge variant="secondary" className="ml-2">{networkErrors.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="console">
            <Terminal className="h-4 w-4 mr-2" />
            {t("errors.console")}
            {consoleErrors.length > 0 && (
              <Badge variant="secondary" className="ml-2">{consoleErrors.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            {t("errors.database")}
            {databaseErrors.length > 0 && (
              <Badge variant="secondary" className="ml-2">{databaseErrors.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>{t("errors.errorList")}</CardTitle>
              <CardDescription>
                {t("errors.selectErrorForDetails")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {renderErrorList(getErrorsByCurrentTab())}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t("errors.details")}</CardTitle>
              <CardDescription>
                {selectedError 
                  ? t("errors.errorDetails") 
                  : t("errors.noErrorSelected")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedError ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">{t("errors.message")}</div>
                    <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                      {selectedError.message || t("errors.unknownError")}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">{t("errors.component")}</div>
                    <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                      {selectedError.component || selectedError.source || t("errors.unknown")}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">{t("errors.timestamp")}</div>
                    <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                      {new Date(selectedError.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  {selectedError.stack && (
                    <div>
                      <div className="text-sm font-medium">{t("errors.stackTrace")}</div>
                      <ScrollArea className="h-[120px] mt-1">
                        <div className="p-2 bg-muted rounded-md text-xs font-mono whitespace-pre overflow-auto">
                          {selectedError.stack}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  {!selectedError.resolved && (
                    <Button 
                      onClick={() => resolveError(selectedError)}
                      className="w-full mt-4"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {t("errors.markAsResolved")}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                  <Info className="h-12 w-12 mb-4 opacity-20" />
                  <p>{t("errors.selectErrorToViewDetails")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
