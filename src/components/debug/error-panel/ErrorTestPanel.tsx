
import React, { useState } from 'react';
import { displayError } from '@/utils/error-handling/displayError';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorOptionsContext } from './ErrorOptionsContext';
import { ErrorTestPanelFooter } from './ErrorTestPanelFooter';

export function ErrorTestPanel() {
  const [errorMessage, setErrorMessage] = useState<string>('Test error message');
  const [errorTitle, setErrorTitle] = useState<string>('Test Error');
  const [errorDescription, setErrorDescription] = useState<string>('This is a test error from the Error Test Panel.');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('medium');
  const [allErrorOptions, setAllErrorOptions] = useState({
    showToast: true,
    logToConsole: true,
    useCollector: true,
    component: "ErrorTestPanel",
    severity: "medium" as 'low' | 'medium' | 'high' | 'critical',
    source: 'test-panel'
  });
  
  const [simpleOptions, setSimpleOptions] = useState({
    showToast: true,
    logToConsole: true,
    useCollector: true
  });
  
  const handleSubmitSimpleError = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create an error with simple options
    const errorOptions = {
      title: errorTitle || "Test Error",
      description: errorDescription || "This is a test error from the Error Test Panel.",
      showToast: simpleOptions.showToast,
      logToConsole: simpleOptions.logToConsole,
      useCollector: simpleOptions.useCollector,
      component: "ErrorTestPanel",
      severity: selectedSeverity as 'low' | 'medium' | 'high' | 'critical'
    };
    
    displayError(new Error(errorMessage || "Test error message"), errorOptions);
  };
  
  const contextValue = {
    errorMessage,
    showToast: allErrorOptions.showToast,
    logToConsole: allErrorOptions.logToConsole,
    sendToChat: false,
    useCollector: allErrorOptions.useCollector,
    setErrorMessage,
    setShowToast: (show: boolean) => setAllErrorOptions(prev => ({ ...prev, showToast: show })),
    setLogToConsole: (log: boolean) => setAllErrorOptions(prev => ({ ...prev, logToConsole: log })),
    setSendToChat: () => {},
    setUseCollector: (use: boolean) => setAllErrorOptions(prev => ({ ...prev, useCollector: use }))
  };
  
  return (
    <ErrorOptionsContext.Provider value={contextValue}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Error Test Panel</h2>
        
        {/* Input fields for error message, title, and description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="error-message">Error Message</Label>
            <Input
              id="error-message"
              type="text"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="error-title">Error Title</Label>
            <Input
              id="error-title"
              type="text"
              value={errorTitle}
              onChange={(e) => setErrorTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="error-description">Error Description</Label>
            <Input
              id="error-description"
              type="text"
              value={errorDescription}
              onChange={(e) => setErrorDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="error-severity">Error Severity</Label>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger id="error-severity">
                <SelectValue placeholder="Select Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Simple Options */}
        <div className="border rounded-md p-4">
          <h3 className="text-md font-semibold mb-2">Simple Options</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-toast"
                checked={simpleOptions.showToast}
                onCheckedChange={(checked) => setSimpleOptions({ ...simpleOptions, showToast: checked })}
              />
              <Label htmlFor="show-toast">Show Toast</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="log-to-console"
                checked={simpleOptions.logToConsole}
                onCheckedChange={(checked) => setSimpleOptions({ ...simpleOptions, logToConsole: checked })}
              />
              <Label htmlFor="log-to-console">Log to Console</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="use-collector"
                checked={simpleOptions.useCollector}
                onCheckedChange={(checked) => setSimpleOptions({ ...simpleOptions, useCollector: checked })}
              />
              <Label htmlFor="use-collector">Use Collector</Label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <form onSubmit={handleSubmitSimpleError}>
          <Button type="submit" variant="default">
            Display Error
          </Button>
        </form>
        
        {/* Footer with Error Options Context */}
        <ErrorTestPanelFooter />
      </div>
    </ErrorOptionsContext.Provider>
  );
}
