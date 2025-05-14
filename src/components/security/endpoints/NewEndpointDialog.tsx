
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiEndpoint } from "@/components/security/apiVault/types";
import { toast } from "sonner";

interface NewEndpointDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (endpoint: ApiEndpoint) => void;
  editingEndpoint?: ApiEndpoint;
}

const DEFAULT_ENDPOINT: ApiEndpoint = {
  id: "",
  name: "",
  url: "",
  method: "GET",
  description: "",
  is_active: true,
  is_public: false
};

export function NewEndpointDialog({
  isOpen,
  onClose,
  onSave,
  editingEndpoint
}: NewEndpointDialogProps) {
  const [endpoint, setEndpoint] = useState<ApiEndpoint>(editingEndpoint || DEFAULT_ENDPOINT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens or editing endpoint changes
  React.useEffect(() => {
    if (isOpen) {
      setEndpoint(editingEndpoint || DEFAULT_ENDPOINT);
    }
  }, [isOpen, editingEndpoint]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEndpoint(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMethodChange = (value: string) => {
    setEndpoint(prev => ({
      ...prev,
      method: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEndpoint(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!endpoint.name || !endpoint.url) {
      toast.error("Όνομα και URL απαιτούνται");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate ID if it's a new endpoint
      const newEndpoint: ApiEndpoint = {
        ...endpoint,
        id: endpoint.id || `endpoint-${Date.now()}`
      };
      
      onSave(newEndpoint);
      toast.success(`Το endpoint ${editingEndpoint ? 'ενημερώθηκε' : 'δημιουργήθηκε'} επιτυχώς`);
      onClose();
    } catch (error) {
      console.error("Error saving endpoint:", error);
      toast.error("Σφάλμα κατά την αποθήκευση του endpoint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingEndpoint ? 'Επεξεργασία' : 'Νέο'} API Endpoint</DialogTitle>
          <DialogDescription>
            {editingEndpoint 
              ? 'Τροποποιήστε τις λεπτομέρειες του endpoint' 
              : 'Προσθέστε ένα νέο endpoint στη συλλογή σας'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Όνομα</Label>
              <Input
                id="name"
                name="name"
                value={endpoint.name}
                onChange={handleInputChange}
                placeholder="Όνομα endpoint"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                value={endpoint.url}
                onChange={handleInputChange}
                placeholder="https://api.example.com/endpoint"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="method">Μέθοδος</Label>
              <Select value={endpoint.method} onValueChange={handleMethodChange}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Επιλέξτε μέθοδο" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Περιγραφή</Label>
              <Textarea
                id="description"
                name="description"
                value={endpoint.description || ''}
                onChange={handleInputChange}
                placeholder="Προαιρετική περιγραφή του endpoint"
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Ενεργό</Label>
                <p className="text-sm text-muted-foreground">Το endpoint είναι διαθέσιμο για χρήση</p>
              </div>
              <Switch 
                id="is_active"
                checked={endpoint.is_active}
                onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_public">Δημόσιο</Label>
                <p className="text-sm text-muted-foreground">Το endpoint είναι προσβάσιμο χωρίς authentication</p>
              </div>
              <Switch 
                id="is_public"
                checked={endpoint.is_public}
                onCheckedChange={(checked) => handleSwitchChange('is_public', checked)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Ακύρωση
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Αποθήκευση...' : 'Αποθήκευση'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
