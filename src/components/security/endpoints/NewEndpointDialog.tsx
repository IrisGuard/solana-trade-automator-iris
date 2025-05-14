
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ApiEndpoint } from "@/types/api"; // Use consistent import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NewEndpointDialogProps {
  category: string;
  onAddEndpoint: (endpoint: ApiEndpoint) => void;
  onCancel: () => void;
}

export function NewEndpointDialog({ category, onAddEndpoint, onCancel }: NewEndpointDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  
  const handleSubmit = () => {
    if (!name || !url) {
      return;
    }
    
    const newEndpoint: ApiEndpoint = {
      id: crypto.randomUUID(),
      name,
      url,
      category, // Use the category prop
      is_active: true,
      is_public: isPublic,
      method: "GET", // Default method
    };
    
    onAddEndpoint(newEndpoint);
  };
  
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Endpoint</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter endpoint name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input 
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="is-public">Public Endpoint</Label>
            <Switch 
              id="is-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !url}>
            Add Endpoint
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
