
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

export function ErrorTestPanel() {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Error Test Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Errors</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Errors</TabsTrigger>
            <TabsTrigger value="network">Network Errors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => console.error('Test error triggered from UI')}
              >
                Trigger Console Error
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { throw new Error('Uncaught UI Error'); }}
              >
                Trigger Uncaught Error
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => setTimeout(() => { throw new Error('Async Error'); }, 100)}
              >
                Trigger Async Error
              </Button>
              <Button 
                variant="outline" 
                onClick={() => Promise.reject(new Error('Promise Rejection'))}
              >
                Trigger Promise Rejection
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="network" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => fetch('/non-existent-endpoint')}
              >
                Trigger Network Error
              </Button>
              <Button 
                variant="outline" 
                onClick={() => fetch('/api/timeout', { signal: AbortSignal.timeout(100) })}
              >
                Trigger Timeout Error
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
