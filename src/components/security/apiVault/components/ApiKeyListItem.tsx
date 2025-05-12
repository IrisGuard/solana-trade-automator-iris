
import React from "react";
import { ApiKey } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { KeyStatusBadge } from "./status/KeyStatusBadge";
import { KeyActionsMenu } from "./key-actions/KeyActionsMenu";
import { KeyVisibilityToggle } from "./key-actions/KeyVisibilityToggle";
import { KeyValueDisplay } from "./key-display/KeyValueDisplay";
import { KeyHeader } from "./key-display/KeyHeader";
import { formatRelativeDate } from "../utils/dateUtils";

interface ApiKeyListItemProps {
  apiKey: ApiKey;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onDeleteRequest: () => void;
  onEditKey?: () => void;
  onTestKey?: () => Promise<boolean>;
}

export const ApiKeyListItem: React.FC<ApiKeyListItemProps> = ({
  apiKey,
  isVisible,
  onToggleVisibility,
  onDeleteRequest,
  onEditKey,
  onTestKey
}) => {
  const formattedDate = formatRelativeDate(apiKey.createdAt);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <KeyHeader 
              name={apiKey.name}
              service={apiKey.service}
              status={apiKey.status}
              date={formattedDate}
            />
            
            <div className="flex items-center gap-1">
              <KeyStatusBadge status={apiKey.status} />
              
              <KeyActionsMenu 
                keyValue={apiKey.key}
                onEditKey={onEditKey}
                onDeleteRequest={onDeleteRequest}
                onTestKey={onTestKey}
              />
            </div>
          </div>

          <div className="pt-1 border-t mt-2">
            <div className="flex items-center justify-between text-sm">
              <KeyValueDisplay 
                keyValue={apiKey.key} 
                isVisible={isVisible}
              />
              
              <KeyVisibilityToggle
                isVisible={isVisible}
                onToggleVisibility={onToggleVisibility}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
