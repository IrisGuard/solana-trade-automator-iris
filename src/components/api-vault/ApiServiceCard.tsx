
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApiServiceCardProps {
  title: string;
  description: string;
  info: string;
  status: "active" | "partial" | "inactive";
  onManage: () => void;
}

export function ApiServiceCard({ title, description, info, status, onManage }: ApiServiceCardProps) {
  const statusColors = {
    active: "text-green-500",
    partial: "text-yellow-500",
    inactive: "text-gray-500"
  };
  
  const statusText = {
    active: "Ενεργό",
    partial: "Μερικό",
    inactive: "Ανενεργό"
  };

  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {info}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Κατάσταση: <span className={statusColors[status]}>{statusText[status]}</span>
          </span>
          <Button variant="outline" size="sm" onClick={onManage}>Διαχείριση</Button>
        </div>
      </CardContent>
    </Card>
  );
}
