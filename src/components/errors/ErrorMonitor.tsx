
import React, { useState, useEffect } from 'react';
import { errorManager } from '@/utils/error-handling/ErrorManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ErrorMonitor() {
  const [errors, setErrors] = useState<any[]>([]);
  
  useEffect(() => {
    // Initial load
    setErrors(errorManager.getRecentErrors());
    
    // Set up interval to check for new errors
    const intervalId = setInterval(() => {
      setErrors(errorManager.getRecentErrors());
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Define badge colors based on error level
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'destructive';
      case 'WARNING': return 'warning';
      case 'INFO': return 'secondary';
      default: return 'outline';
    }
  };

  // Show empty state if no errors
  if (errors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Monitor</CardTitle>
          <CardDescription>No errors detected</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The system is running normally. Any detected errors will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Monitor</CardTitle>
        <CardDescription>
          Showing {errors.length} detected error{errors.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md border">
          <div className="p-4 space-y-4">
            {errors.map((error, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={getBadgeVariant(error.level)} className="capitalize">
                    {error.level.toLowerCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(error.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="font-semibold text-foreground">
                    {error.message}
                  </span>
                </div>
                
                <div className="flex space-x-2 text-xs">
                  <Badge variant="outline" className="capitalize">
                    {error.source}
                  </Badge>
                  {error.autoResolved && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Auto-resolved
                    </Badge>
                  )}
                </div>
                
                {error.stackTrace && (
                  <details className="mt-2">
                    <summary className="text-xs text-muted-foreground cursor-pointer">
                      Stack trace
                    </summary>
                    <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                      {error.stackTrace}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
