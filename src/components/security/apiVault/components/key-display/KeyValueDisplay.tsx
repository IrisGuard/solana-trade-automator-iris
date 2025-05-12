
import React from "react";

interface KeyValueDisplayProps {
  keyValue: string;
  isVisible: boolean;
}

export const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({ 
  keyValue, 
  isVisible 
}) => {
  return (
    <div className="font-mono text-xs truncate max-w-[85%] pr-2">
      {isVisible ? keyValue : '••••••••••••••••••••••••••••••••'}
    </div>
  );
};
