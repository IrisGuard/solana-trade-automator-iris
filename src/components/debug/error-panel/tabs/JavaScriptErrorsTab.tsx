
import React from 'react';
import { TestButton } from './TestButton';

export function JavaScriptErrorsTab() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Standard JavaScript Errors</h3>
      <div className="grid gap-2">
        <TestButton 
          label="Reference Error"
          options={{
            errorType: "js", // Changed from "reference" to "js"
            component: 'AdvancedErrorTests',
            details: { severity: 'high', errorCode: 'JS001' }
          }}
        />
        <TestButton 
          label="Type Error"
          options={{
            errorType: "js", // Changed from "type" to "js"
            component: 'AdvancedErrorTests',
            details: { severity: 'medium', errorCode: 'JS002' }
          }}
        />
        <TestButton 
          label="Syntax Error"
          options={{
            errorType: "js", // Changed from "syntax" to "js"
            component: 'AdvancedErrorTests',
            details: { severity: 'critical', errorCode: 'JS003' }
          }}
        />
      </div>
    </div>
  );
}
