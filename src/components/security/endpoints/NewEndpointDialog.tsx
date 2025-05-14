
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiEndpoint } from "@/types/api";
import { toast } from "sonner";

interface NewEndpointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (endpoint: ApiEndpoint) => void;
  initialEndpoint?: ApiEndpoint;
}

export const NewEndpointDialog: React.FC<NewEndpointDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialEndpoint
}) => {
  const [name, setName] = useState(initialEndpoint?.name || "");
  const [url, setUrl] = useState(initialEndpoint?.url || "");
  const [category, setCategory] = useState(initialEndpoint?.category || "");
  
  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Παρακαλώ εισάγετε όνομα για το endpoint");
      return;
    }
    
    if (!url.trim()) {
      toast.error("Παρακαλώ εισάγετε URL για το endpoint");
      return;
    }
    
    if (!category.trim()) {
      toast.error("Παρακαλώ εισάγετε κατηγορία για το endpoint");
      return;
    }
    
    const endpoint: ApiEndpoint = {
      id: initialEndpoint?.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      url: url.trim(),
      category: category.trim(),
      is_active: initialEndpoint?.is_active !== undefined ? initialEndpoint.is_active : true,
      is_public: initialEndpoint?.is_public !== undefined ? initialEndpoint.is_public : false,
      created_at: initialEndpoint?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onSave(endpoint);
    onOpenChange(false);
    
    // Reset form
    setName("");
    setUrl("");
    setCategory("");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialEndpoint ? "Επεξεργασία Endpoint" : "Νέο Endpoint"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint-name">Όνομα Endpoint</Label>
            <Input 
              id="endpoint-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="π.χ. Solana RPC Mainnet"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endpoint-url">URL</Label>
            <Input 
              id="endpoint-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.mainnet-beta.solana.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endpoint-category">Κατηγορία</Label>
            <Input 
              id="endpoint-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="rpc, api, websocket, etc."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
          <Button onClick={handleSave}>{initialEndpoint ? "Αποθήκευση" : "Προσθήκη"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
