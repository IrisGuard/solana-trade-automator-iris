
import React from 'react';
import { Button } from '@/components/ui/button';
import { generateTestError } from '@/utils/errorTestUtils';

interface TestButtonProps {
  label: string;
  options?: {
    errorType: string;
    component?: string;
    details?: any;
    severity?: 'low' | 'medium' | 'high';
  };
}

export function TestButton({ label, options = { errorType: "general" } }: TestButtonProps) {
  const handleClick = () => {
    // Create different error messages based on error type
    let errorMessage = "Test error generated";
    
    switch (options.errorType) {
      case "js":
        if (options.details?.errorCode === 'JS001') {
          errorMessage = "ReferenceError: undefinedVariable is not defined";
        } else if (options.details?.errorCode === 'JS002') {
          errorMessage = "TypeError: Cannot read properties of null (reading 'length')";
        } else if (options.details?.errorCode === 'JS003') {
          errorMessage = "SyntaxError: Unexpected token ')'";
        }
        break;
        
      case "async":
        if (options.details?.errorCode === 'ASYNC001') {
          errorMessage = "Uncaught (in promise): Error: Promise rejected";
        } else if (options.details?.errorCode === 'ASYNC002') {
          errorMessage = "Error in async function: Operation failed";
        } else {
          errorMessage = "Async operation timeout";
        }
        break;
        
      case "ui":
        if (options.details?.errorCode === 'UI001') {
          errorMessage = "React render error: Invalid element type";
        } else if (options.details?.errorCode === 'UI002') {
          errorMessage = "Missing required props: 'data' is required";
        } else {
          errorMessage = "Error updating component state";
        }
        break;
        
      case "network":
        if (options.details?.status === 404) {
          errorMessage = "404 Error: Resource not found";
        } else if (options.details?.status === 500) {
          errorMessage = "500 Error: Internal server error";
        } else if (options.details?.status === 403) {
          errorMessage = "403 Error: Access forbidden";
        } else {
          errorMessage = "Network request failed: timeout";
        }
        break;
        
      default:
        errorMessage = "Generic test error";
    }
    
    // Generate the error
    generateTestError({
      message: errorMessage,
      errorType: options.errorType,
      component: options.component || 'TestButton',
      details: options.details,
      toastTitle: `${options.errorType.charAt(0).toUpperCase() + options.errorType.slice(1)} Error`,
      showToast: true,
      sendToChat: false
    });
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full justify-start text-left font-normal"
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
