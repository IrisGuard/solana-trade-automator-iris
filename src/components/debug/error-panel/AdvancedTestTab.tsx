
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clearAllErrors } from '@/utils/errorTestUtils';
import { JavaScriptErrorsTab, AsyncErrorsTab, UIErrorsTab, NetworkErrorsTab } from './tabs';

export function AdvancedTestTab() {
  const handleClearAllErrors = () => {
    clearAllErrors();
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Error Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript" className="space-y-4">
            <TabsList>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="async">Async</TabsTrigger>
              <TabsTrigger value="ui">UI</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
            </TabsList>
            
            <TabsContent value="javascript" className="space-y-4">
              <JavaScriptErrorsTab />
            </TabsContent>
            
            <TabsContent value="async" className="space-y-4">
              <AsyncErrorsTab />
            </TabsContent>
            
            <TabsContent value="ui" className="space-y-4">
              <UIErrorsTab />
            </TabsContent>
            
            <TabsContent value="network" className="space-y-4">
              <NetworkErrorsTab />
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="destructive" 
              onClick={handleClearAllErrors}
            >
              Clear All Errors
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
