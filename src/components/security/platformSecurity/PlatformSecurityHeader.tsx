
import React from "react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlatformSecurityHeaderProps {
  expanded: boolean;
  onToggle: () => void;
}

export function PlatformSecurityHeader({ expanded, onToggle }: PlatformSecurityHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <CardTitle>Κύριες Ρυθμίσεις Ασφαλείας Πλατφόρμας</CardTitle>
      </div>
      <Button variant="ghost" size="sm" onClick={onToggle}>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </div>
  );
}
