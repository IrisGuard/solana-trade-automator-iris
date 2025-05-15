
import React from 'react';
import { Button } from "@/components/ui/button";
import { errorCollector } from '@/utils/error-handling/collector';
import type { ErrorOptions } from '@/utils/error-handling/collector/types';

interface TestButtonProps {
  label: string;
  options?: {
    errorType?: string;
    component?: string;
    details?: any;
    message?: string;
    simulateDelay?: number;
  };
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  type?: string;
}

export const TestButton: React.FC<TestButtonProps> = ({
  label,
  options = {},
  onClick,
  disabled = false,
  variant = 'default',
  size = 'default',
  type
}) => {
  const handleClick = () => {
    try {
      if (onClick) {
        onClick();
      } else {
        // Generate error based on options
        const error = new Error(options.message || `Test error: ${label}`);
        
        // Create error options object that matches the type
        const errorOptions: ErrorOptions = {
          component: options.component || 'TestButton',
          source: 'ErrorTestPanel',
          details: options.details,
          errorType: options.errorType
        };
        
        // Add message to the error itself, not to the options
        error.message = options.message || `Error triggered by test button: ${label}`;
        
        errorCollector.captureError(error, errorOptions);

        // For test purposes, throw the error
        throw error;
      }
    } catch (error) {
      const errorOptions: ErrorOptions = {
        component: options.component || 'TestButton',
        source: 'ErrorTestPanel',
        errorType: options.errorType
      };
      
      errorCollector.captureError(error as Error, errorOptions);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className="w-full mb-2"
    >
      {label}
    </Button>
  );
};
