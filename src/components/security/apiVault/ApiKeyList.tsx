
import React from "react";
import { ApiKey } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Copy, Eye, EyeOff, Trash } from "lucide-react";
import { copyToClipboard, getServiceIcon, maskKey } from "./utils";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
}

export const ApiKeyList = ({ 
  apiKeys, 
  isKeyVisible, 
  toggleKeyVisibility, 
  deleteKey 
}: ApiKeyListProps) => {
  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Δεν βρέθηκαν κλειδιά με τα τρέχοντα φίλτρα</p>
      </div>
    );
  }
  
  return (
    <>
      {apiKeys.map((apiKey) => (
        <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getServiceIcon(apiKey.service)}</div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{apiKey.name}</p>
                {apiKey.status === "expired" && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Ληγμένο
                  </Badge>
                )}
                {apiKey.status === "revoked" && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    Ανακληθέν
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-sm bg-secondary p-1 px-2 rounded flex-1 min-w-0 truncate">
                  {isKeyVisible[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                </code>
                <button 
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                  className="text-muted-foreground hover:text-foreground"
                  title={isKeyVisible[apiKey.id] ? "Απόκρυψη" : "Εμφάνιση"}
                >
                  {isKeyVisible[apiKey.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {apiKey.description && (
                <p className="text-sm text-muted-foreground truncate">{apiKey.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(apiKey.key)}
              title="Αντιγραφή"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  title="Διαγραφή"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Διαγραφή Κλειδιού</AlertDialogTitle>
                  <AlertDialogDescription>
                    Είστε βέβαιοι ότι θέλετε να διαγράψετε το κλειδί "{apiKey.name}";<br />
                    Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteKey(apiKey.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Διαγραφή
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </>
  );
};
