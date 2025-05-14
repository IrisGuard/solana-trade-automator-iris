
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicTestTab } from "./BasicTestTab";
import { AdvancedTestTab } from "./AdvancedTestTab";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { errorCollector } from '@/utils/error-handling/collector';
import { Button } from "@/components/ui/button";

interface ErrorTestPanelProps {
  onGenerateError?: (error: Error) => void;
}

export function ErrorTestPanel({ onGenerateError }: ErrorTestPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [errorCount, setErrorCount] = useState<number>(0);

  // Ενημερώνει το μετρητή σφαλμάτων
  const updateErrorCount = () => {
    const allErrors = errorCollector.getErrors(); // Changed from getAllErrors to getErrors
    setErrorCount(allErrors.length);
  };

  // Κάθε φορά που αλλάζει η ενεργή καρτέλα, ενημερώνουμε το μετρητή
  React.useEffect(() => {
    updateErrorCount();
  }, [activeTab]);

  // Δημιουργεί ένα σφάλμα όταν κάνουμε κλικ στο κουμπί "Clear All Errors"
  const handleClearAllErrors = () => {
    errorCollector.clearErrors(); // Changed from clearAllErrors to clearErrors
    updateErrorCount();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Error Testing Panel</span>
          <span className="text-sm font-normal text-muted-foreground">
            Errors: {errorCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="mt-4">
            <BasicTestTab />
          </TabsContent>
          <TabsContent value="advanced" className="mt-4">
            <AdvancedTestTab />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={updateErrorCount}>
          Refresh Count
        </Button>
        <Button variant="destructive" onClick={handleClearAllErrors}>
          Clear All Errors
        </Button>
      </CardFooter>
    </Card>
  );
}
