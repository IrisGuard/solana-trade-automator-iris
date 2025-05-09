
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { ApiKey } from "./types";
import { toast } from "sonner";

interface ExportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKeys: ApiKey[];
}

export const ExportSheet = ({ open, onOpenChange, apiKeys }: ExportSheetProps) => {
  const handleExport = (format: 'json' | 'text') => {
    try {
      let exportData = '';
      
      if (format === 'json') {
        exportData = JSON.stringify(apiKeys, null, 2);
      } else if (format === 'text') {
        exportData = apiKeys.map(key => 
          `${key.name}|${key.key}|${key.service}|${key.description || ''}|${key.expires || ''}`
        ).join('\n');
      }
      
      const blob = new Blob([exportData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `api-keys-export-${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Τα κλειδιά εξήχθησαν με επιτυχία");
      onOpenChange(false);
    } catch (e) {
      console.error('Σφάλμα εξαγωγής:', e);
      toast.error("Σφάλμα κατά την εξαγωγή κλειδιών");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Εξαγωγή Κλειδιών API</SheetTitle>
          <SheetDescription>
            Επιλέξτε μορφή για την εξαγωγή των κλειδιών σας
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Διαθέσιμες μορφές:</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleExport('json')}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Εξαγωγή ως JSON
              </Button>
              <Button 
                onClick={() => handleExport('text')}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Εξαγωγή ως Text
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Κλείσιμο</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
