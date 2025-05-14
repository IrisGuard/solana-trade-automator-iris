
import React from 'react';
import { Button } from '@/components/ui/button';
import { triggerTestError } from '@/utils/errorTestUtils';
import { ErrorOptions } from '@/utils/error-handling/types';

interface TestButtonProps {
  errorOptions?: ErrorOptions;
  options?: any; // For backward compatibility
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function TestButton({ errorOptions, options, label, variant = 'outline' }: TestButtonProps) {
  const handleClick = () => {
    // Use either errorOptions or options, with errorOptions taking precedence
    const testOptions = errorOptions || options || {};
    triggerTestError(testOptions);
  };

  return (
    <Button variant={variant} onClick={handleClick} className="w-full mb-2">
      {label}
    </Button>
  );
}
