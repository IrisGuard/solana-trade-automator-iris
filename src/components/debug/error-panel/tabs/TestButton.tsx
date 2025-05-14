
import React from 'react';
import { Button } from "@/components/ui/button";
import { errorCollector } from '@/utils/error-handling/collector';

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
        errorCollector.captureError(error, {
          type,
          errorType: options.errorType,
          source: 'ErrorTestPanel',
          component: options.component || 'TestButton',
          details: options.details,
          message: options.message || `Error triggered by test button: ${label}`
        });

        // For test purposes, throw the error
        throw error;
      }
    } catch (error) {
      errorCollector.captureError(error as Error, {
        type,
        errorType: options.errorType,
        source: 'ErrorTestPanel',
        component: options.component || 'TestButton',
        message: `Error triggered by test button: ${label}`
      });
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
