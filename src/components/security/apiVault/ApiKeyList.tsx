
import React, { useState } from "react";
import { ApiKey } from "./types";
import { Eye, EyeOff, MoreHorizontal, Edit, Trash2, Copy, ExternalLink, CheckCircle, XCircle, Clock, AlertCircle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
  onEditKey?: (key: ApiKey) => void;
  onTestKey?: (key: ApiKey) => Promise<boolean>;
}

export const ApiKeyList = ({
  apiKeys,
  isKeyVisible,
  toggleKeyVisibility,
  deleteKey,
  onEditKey,
  onTestKey
}: ApiKeyListProps) => {
  const [testingKeys, setTestingKeys] = useState<Record<string, boolean>>({});

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Το κλειδί αντιγράφηκε στο πρόχειρο");
  };

  const handleTestKey = async (key: ApiKey) => {
    if (!onTestKey) return;

    setTestingKeys(prev => ({ ...prev, [key.id]: true }));
    try {
      const isWorking = await onTestKey(key);
      if (isWorking) {
        toast.success("Το κλειδί λειτουργεί κανονικά");
      } else {
        toast.error("Το κλειδί δεν λειτουργεί");
      }
    } catch (error) {
      toast.error("Σφάλμα κατά τον έλεγχο του κλειδιού");
      console.error("Error testing key:", error);
    } finally {
      setTestingKeys(prev => ({ ...prev, [key.id]: false }));
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "expired":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "revoked":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "active":
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "expired":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
            Ληγμένο
          </Badge>
        );
      case "revoked":
        return (
          <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
            Ανακλημένο
          </Badge>
        );
      case "active":
      default:
        return (
          <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
            Ενεργό
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: el
      });
    } catch (e) {
      return "Άγνωστη ημερομηνία";
    }
  };

  if (apiKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
        <Key className="h-12 w-12 mb-2 opacity-20" />
        <p>Δεν βρέθηκαν κλειδιά API</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <TooltipProvider>
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(apiKey.status)}
                    <h3 className="font-medium text-sm">{apiKey.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusBadge(apiKey.status)}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Επιλογές κλειδιού</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleCopyKey(apiKey.key)} className="gap-2">
                          <Copy className="h-4 w-4" />
                          <span>Αντιγραφή κλειδιού</span>
                        </DropdownMenuItem>
                        {onEditKey && (
                          <DropdownMenuItem onClick={() => onEditKey(apiKey)} className="gap-2">
                            <Edit className="h-4 w-4" />
                            <span>Επεξεργασία</span>
                          </DropdownMenuItem>
                        )}
                        {onTestKey && (
                          <DropdownMenuItem 
                            onClick={() => handleTestKey(apiKey)}
                            disabled={testingKeys[apiKey.id]} 
                            className="gap-2"
                          >
                            {testingKeys[apiKey.id] ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                <span>Έλεγχος...</span>
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-4 w-4" />
                                <span>Έλεγχος κλειδιού</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deleteKey(apiKey.id)} 
                          className="text-red-600 focus:text-red-600 gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Διαγραφή</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {apiKey.service}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(apiKey.createdAt)}
                  </span>
                </div>

                <div className="pt-1 border-t mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-mono text-xs truncate max-w-[85%] pr-2">
                      {isKeyVisible[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {isKeyVisible[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isKeyVisible[apiKey.id] ? "Απόκρυψη κλειδιού" : "Εμφάνιση κλειδιού"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TooltipProvider>
    </div>
  );
};
