
import React, { MouseEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateVariousErrors, clearAllErrors } from '@/utils/errorTestUtils';
import { TestErrorOptions } from '@/utils/error-handling/types';

export function AdvancedTestTab() {
  // Handle error generation with proper typing
  const handleGenerateError = (options: TestErrorOptions) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    generateVariousErrors(options);
  };

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
              <div>
                <h3 className="text-lg font-medium mb-2">Standard JavaScript Errors</h3>
                <div className="grid gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'reference',
                      component: 'AdvancedErrorTests',
                      details: { severity: 'high', errorCode: 'JS001' }
                    })}
                    className="w-full"
                  >
                    Reference Error
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'type',
                      component: 'AdvancedErrorTests',
                      details: { severity: 'medium', errorCode: 'JS002' }
                    })}
                    className="w-full"
                  >
                    Type Error
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'syntax',
                      component: 'AdvancedErrorTests',
                      details: { severity: 'critical', errorCode: 'JS003' }
                    })}
                    className="w-full"
                  >
                    Syntax Error
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="async" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Async & Promise Errors</h3>
                <div className="grid gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'promise',
                      component: 'AsyncOperations',
                      details: { severity: 'high', errorCode: 'ASYNC001' }
                    })}
                    className="w-full"
                  >
                    Uncaught Promise Rejection
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'async',
                      component: 'AsyncOperations',
                      details: { severity: 'medium', errorCode: 'ASYNC002' }
                    })}
                    className="w-full"
                  >
                    Async Function Error
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'timeout',
                      component: 'AsyncOperations',
                      details: { severity: 'low', errorCode: 'ASYNC003' }
                    })}
                    className="w-full"
                  >
                    Operation Timeout
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ui" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">UI & Rendering Errors</h3>
                <div className="grid gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'render',
                      component: 'UIComponents',
                      details: { severity: 'critical', errorCode: 'UI001' }
                    })}
                    className="w-full"
                  >
                    React Render Error
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'prop',
                      component: 'UIComponents',
                      details: { severity: 'high', errorCode: 'UI002' }
                    })}
                    className="w-full"
                  >
                    Missing Required Props
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'state',
                      component: 'UIComponents',
                      details: { severity: 'medium', errorCode: 'UI003' }
                    })}
                    className="w-full"
                  >
                    State Update Error
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="network" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Network & API Errors</h3>
                <div className="grid gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'network',
                      component: 'APIService',
                      details: { severity: 'high', errorCode: 'NET001', status: 404 }
                    })}
                    className="w-full"
                  >
                    404 Not Found
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'network',
                      component: 'APIService',
                      details: { severity: 'critical', errorCode: 'NET002', status: 500 }
                    })}
                    className="w-full"
                  >
                    500 Server Error
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'network',
                      component: 'APIService',
                      details: { severity: 'medium', errorCode: 'NET003', status: 403 }
                    })}
                    className="w-full"
                  >
                    403 Forbidden
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateError({
                      errorType: 'timeout',
                      component: 'APIService',
                      details: { severity: 'low', errorCode: 'NET004' }
                    })}
                    className="w-full"
                  >
                    Network Timeout
                  </Button>
                </div>
              </div>
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
