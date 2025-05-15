
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoginRequiredCardProps {
  onLogin?: () => void;
}

export function LoginRequiredCard({ onLogin }: LoginRequiredCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Απαιτείται Σύνδεση</CardTitle>
        <CardDescription>
          Παρακαλώ συνδεθείτε για να διαχειριστείτε τα API κλειδιά σας
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <Button onClick={onLogin}>Σύνδεση</Button>
      </CardContent>
    </Card>
  );
}
