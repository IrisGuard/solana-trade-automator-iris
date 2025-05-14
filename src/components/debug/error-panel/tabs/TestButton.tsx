
import React from 'react';
import { Button } from "@/components/ui/button";
import { errorCollector } from '@/utils/error-handling/collector';

interface TestButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  type?: string; // Allow any string type for errors
  errorType?: string; // Allow any string type for error categorization
}

export const TestButton: React.FC<TestButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'default',
  size = 'default',
  type,
  errorType
}) => {
  const handleClick = () => {
    try {
      onClick();
    } catch (error) {
      errorCollector.captureError(error as Error, {
        type,
        errorType,
        source: 'ErrorTestPanel',
        component: 'TestButton',
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
