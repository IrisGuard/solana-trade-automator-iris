
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface SaveSettingsProps {
  onSave: () => void;
}

export function SaveSettings({ onSave }: SaveSettingsProps) {
  return (
    <div className="mt-4">
      <Label className="text-sm text-muted-foreground mb-2 block">
        Σημείωση: Αυτές οι ρυθμίσεις θα εφαρμοστούν όταν η πλατφόρμα περάσει σε πλήρη λειτουργία
      </Label>
      
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox id="disclaimer" />
        <Label htmlFor="disclaimer" className="text-sm">
          Κατανοώ ότι η απενεργοποίηση των λειτουργιών ασφαλείας μπορεί να αυξήσει το ρίσκο
        </Label>
      </div>
      
      <Button onClick={onSave} className="w-full">
        Αποθήκευση Ρυθμίσεων
      </Button>
    </div>
  );
}
