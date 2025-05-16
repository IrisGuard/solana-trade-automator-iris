
import React from 'react';
import { HealthStatusPopover } from './health-status/HealthStatusPopover';

export function HealthStatusIndicator() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <HealthStatusPopover />
    </div>
  );
}
