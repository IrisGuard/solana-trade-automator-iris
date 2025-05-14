
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBotForm } from "./create/CreateBotForm";

interface CreateBotCardProps {
  onCancel?: () => void;
}

export function CreateBotCard({ onCancel }: CreateBotCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Bot</CardTitle>
        <CardDescription>
          Configure a new trading bot with custom parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateBotForm onCancel={onCancel} />
      </CardContent>
    </Card>
  );
}
