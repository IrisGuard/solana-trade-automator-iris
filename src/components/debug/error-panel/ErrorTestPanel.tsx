
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { errorCollector } from "@/utils/error-handling/collector";
import { displayError } from "@/utils/error-handling/displayError";
import { useErrorReporting } from "@/hooks/useErrorReporting";

export function ErrorTestPanel() {
  const { reportError } = useErrorReporting();
  
  const generateSimpleError = () => {
    try {
      throw new Error("This is a test error");
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, {
          component: "ErrorTestPanel",
          severity: "low",
          details: { action: "generateSimpleError", test: true },
          showToast: true
        });
      }
    }
  };
  
  const generateComponentError = () => {
    try {
      throw new Error("Component rendering failed");
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, {
          component: "TestComponent",
          severity: "medium",
          details: { type: "render", location: "TestComponent.tsx:42" },
          showUI: true
        });
      }
    }
  };
  
  const generateNetworkError = () => {
    try {
      throw new Error("Network request failed: API endpoint not responding");
    } catch (error) {
      if (error instanceof Error) {
        displayError(error, {
          component: "APIService",
          source: "network",
          severity: "high",
          details: { url: "/api/data", method: "GET" },
          showToast: true,
          toastTitle: "Network Error"
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Handling Test Panel</CardTitle>
        <CardDescription>
          Generate test errors to verify error handling functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            Click the buttons below to generate test errors. These errors are safe and will be captured by the error handling system.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={generateSimpleError}>
            Generate Simple Error
          </Button>
          
          <Button variant="outline" onClick={generateComponentError}>
            Generate Component Error
          </Button>
          
          <Button variant="outline" onClick={generateNetworkError}>
            Generate Network Error
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
