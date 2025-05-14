
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorOptionsProvider } from './ErrorOptionsContext';
import { BasicTestTab } from './BasicTestTab';
import { AdvancedTestTab } from './AdvancedTestTab';
import { ErrorTestPanelFooter } from './ErrorTestPanelFooter';

export function ErrorTestPanel() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Δοκιμή Συστήματος Σφαλμάτων</CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorOptionsProvider>
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Βασική Δοκιμή</TabsTrigger>
              <TabsTrigger value="advanced">Προχωρημένες Δοκιμές</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <BasicTestTab />
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <AdvancedTestTab />
            </TabsContent>
          </Tabs>
          
          <ErrorTestPanelFooter />
        </ErrorOptionsProvider>
      </CardContent>
    </Card>
  );
}
