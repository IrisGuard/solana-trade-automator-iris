
import React from 'react';
import { TestButton } from './TestButton';

export function AsyncErrorsTab() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Async & Promise Errors</h3>
      <div className="grid gap-2">
        <TestButton 
          label="Uncaught Promise Rejection"
          options={{
            errorType: 'promise',
            component: 'AsyncOperations',
            details: { severity: 'high', errorCode: 'ASYNC001' }
          }}
        />
        <TestButton 
          label="Async Function Error"
          options={{
            errorType: 'async',
            component: 'AsyncOperations',
            details: { severity: 'medium', errorCode: 'ASYNC002' }
          }}
        />
        <TestButton 
          label="Operation Timeout"
          options={{
            errorType: 'timeout',
            component: 'AsyncOperations',
            details: { severity: 'low', errorCode: 'ASYNC003' }
          }}
        />
      </div>
    </div>
  );
}
