
import React from 'react';
import { TestButton } from './TestButton';

export function NetworkErrorsTab() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Network & API Errors</h3>
      <div className="grid gap-2">
        <TestButton 
          label="404 Not Found"
          options={{
            errorType: "network",
            component: 'APIService',
            details: { severity: 'high', errorCode: 'NET001', status: 404 }
          }}
        />
        <TestButton 
          label="500 Server Error"
          options={{
            errorType: "network",
            component: 'APIService',
            details: { severity: 'critical', errorCode: 'NET002', status: 500 }
          }}
        />
        <TestButton 
          label="403 Forbidden"
          options={{
            errorType: "network",
            component: 'APIService',
            details: { severity: 'medium', errorCode: 'NET003', status: 403 }
          }}
        />
        <TestButton 
          label="Network Timeout"
          options={{
            errorType: "network", // Changed from "timeout" to "network"
            component: 'APIService',
            details: { severity: 'low', errorCode: 'NET004' }
          }}
        />
      </div>
    </div>
  );
}
