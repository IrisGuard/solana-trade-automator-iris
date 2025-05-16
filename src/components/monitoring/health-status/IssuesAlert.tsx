
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface IssuesAlertProps {
  issues: string[];
  status: 'critical' | 'warning' | 'healthy';
}

export function IssuesAlert({ issues, status }: IssuesAlertProps) {
  if (issues.length === 0) {
    return null;
  }
  
  return (
    <Alert variant={status === 'critical' ? 'destructive' : 'default'} className="mt-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <p className="font-medium">Εντοπίστηκαν {issues.length} ζητήματα</p>
        <ul className="mt-2 text-xs list-disc list-inside">
          {issues.slice(0, 3).map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
          {issues.length > 3 && (
            <li>...και {issues.length - 3} ακόμα</li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
