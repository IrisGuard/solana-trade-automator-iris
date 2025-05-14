
import React, { MouseEvent } from 'react';
import { Button } from "@/components/ui/button";
import { triggerTestError } from '@/utils/errorTestUtils';
import { TestErrorOptions } from '@/utils/error-handling/collector/types';

interface TestButtonProps {
  label: string;
  options: TestErrorOptions;
  className?: string;
}

export function TestButton({ label, options, className = "w-full" }: TestButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    triggerTestError(options.errorType || 'js', options);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleClick}
      className={className}
    >
      {label}
    </Button>
  );
}
