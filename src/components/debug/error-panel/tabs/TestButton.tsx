
import React from 'react';
import { Button } from '@/components/ui/button';
import { triggerTestError } from '@/utils/errorTestUtils';
import { ErrorOptions } from '@/utils/error-handling/types';

interface TestButtonProps {
  errorOptions?: ErrorOptions;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function TestButton({ errorOptions, label, variant = 'outline' }: TestButtonProps) {
  const handleClick = () => {
    triggerTestError(errorOptions);
  };

  return (
    <Button variant={variant} onClick={handleClick} className="w-full mb-2">
      {label}
    </Button>
  );
}
