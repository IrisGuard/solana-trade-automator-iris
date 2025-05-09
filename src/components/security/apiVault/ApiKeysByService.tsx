
import React from "react";
import { ApiKey } from "./types";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Copy, Eye, EyeOff, Trash } from "lucide-react";
import { copyToClipboard, getServiceIcon, maskKey } from "./utils";

interface ApiKeysByServiceProps {
  keysByService: Record<string, ApiKey[]>;
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
}

export const ApiKeysByService = ({ 
  keysByService,
  isKeyVisible, 
  toggleKeyVisibility, 
  deleteKey 
}: ApiKeysByServiceProps) => {
  if (Object.keys(keysByService).length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Δεν βρέθηκαν κλειδιά με τα τρέχοντα φίλτρα</p>
      </div>
    );
  }
  
  return (
    <>
      {Object.entries(keysByService).map(([service, keys]) => (
        <div key={service} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-xl">{getServiceIcon(service)}</div>
            <h3 className="font-semibold capitalize">{service}</h3>
            <div className="ml-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
              {keys.length}
            </div>
          </div>
          <div className="space-y-2 pl-8">
            {keys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{apiKey.name}</p>
                    {apiKey.expires && new Date(apiKey.expires) < new Date() && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Ληγμένο</span>
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
          </div>
        </div>
      ))}
    </>
  );
};
