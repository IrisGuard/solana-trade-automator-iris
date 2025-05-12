
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApiSettingsForm } from "./ApiSettingsForm";
import { ApiSettings } from "./types";

interface ApiSettingsCardProps {
  apiSettings: ApiSettings;
  setApiSettings: (settings: ApiSettings) => void;
  handleSaveApiSettings: () => void;
}

export function ApiSettingsCard({
  apiSettings,
  setApiSettings,
  handleSaveApiSettings
}: ApiSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Connection Settings</CardTitle>
        <CardDescription>Configure RPC and API endpoints</CardDescription>
      </CardHeader>
      <CardContent>
        <ApiSettingsForm 
          apiSettings={apiSettings}
          setApiSettings={setApiSettings}
          handleSaveApiSettings={handleSaveApiSettings}
        />
      </CardContent>
    </Card>
  );
}
