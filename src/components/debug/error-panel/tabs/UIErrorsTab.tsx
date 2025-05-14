
import React from 'react';
import { TestButton } from './TestButton';

export function UIErrorsTab() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">UI & Rendering Errors</h3>
      <div className="grid gap-2">
        <TestButton 
          label="React Render Error"
          options={{
            errorType: "ui", // Changed from "render" to "ui"
            component: 'UIComponents',
            details: { severity: 'critical', errorCode: 'UI001' }
          }}
        />
        <TestButton 
          label="Missing Required Props"
          options={{
            errorType: "ui", // Changed from "prop" to "ui"
            component: 'UIComponents',
            details: { severity: 'high', errorCode: 'UI002' }
          }}
        />
        <TestButton 
          label="State Update Error"
          options={{
            errorType: "ui", // Changed from "state" to "ui"
            component: 'UIComponents',
            details: { severity: 'medium', errorCode: 'UI003' }
          }}
        />
      </div>
    </div>
  );
}
