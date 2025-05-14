
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface ApiKeysListHeaderProps {
  onAddKey: () => void;
}

export function ApiKeysListHeader({ onAddKey }: ApiKeysListHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>API Κλειδιά</CardTitle>
        <CardDescription>
          Διαχείριση των API κλειδιών σας για διάφορες υπηρεσίες
        </CardDescription>
      </div>
      <Button onClick={onAddKey}>
        <Plus className="h-4 w-4 mr-2" />
        Προσθήκη
      </Button>
    </div>
  );
}
