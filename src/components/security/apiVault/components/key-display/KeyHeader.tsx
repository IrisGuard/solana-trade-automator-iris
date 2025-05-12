
import React from "react";
import { Badge } from "@/components/ui/badge";
import { KeyStatusIcon } from "../status/KeyStatusIcon";

interface KeyHeaderProps {
  name: string;
  service: string;
  status?: string;
  date: string;
}

export const KeyHeader: React.FC<KeyHeaderProps> = ({ 
  name, 
  service, 
  status,
  date
}) => {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <KeyStatusIcon status={status} />
          <h3 className="font-medium text-sm">{name}</h3>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <Badge variant="secondary" className="text-xs">
          {service}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {date}
        </span>
      </div>
    </>
  );
};
