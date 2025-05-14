
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApiEndpoint } from "@/components/security/apiVault/types";

interface NewEndpointDialogProps {
  category: string;
  onAddEndpoint: (endpoint: ApiEndpoint) => void;
  onCancel: () => void;
}

export function NewEndpointDialog({ category, onAddEndpoint, onCancel }: NewEndpointDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new endpoint
    const newEndpoint: ApiEndpoint = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      url,
      category,
      is_active: true,
      is_public: isPublic,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onAddEndpoint(newEndpoint);
  };
  
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Προσθήκη Νέου Endpoint</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Όνομα Endpoint</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="π.χ. Solana RPC Endpoint"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL Endpoint</Label>
            <Input 
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="is-public" className="cursor-pointer">Δημόσιο Endpoint</Label>
            <Switch 
              id="is-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            {isPublic 
              ? "Το endpoint θα είναι διαθέσιμο σε όλους τους χρήστες" 
              : "Το endpoint θα είναι διαθέσιμο μόνο σε εξουσιοδοτημένους χρήστες"}
          </p>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Ακύρωση
            </Button>
            <Button type="submit">
              Προσθήκη
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
