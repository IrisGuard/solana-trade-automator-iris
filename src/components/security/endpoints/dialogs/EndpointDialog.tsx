
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiEndpoint } from "@/utils/supabaseEndpoints";

interface EndpointDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint: ApiEndpoint | null;
  onSubmit: (data: ApiEndpoint) => Promise<void>;
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
}

export const EndpointDialog = ({
  isOpen,
  onOpenChange,
  endpoint,
  onSubmit,
  title,
  description,
  submitLabel,
  isLoading
}: EndpointDialogProps) => {
  const [formData, setFormData] = useState<ApiEndpoint>({
    name: "",
    url: "",
    category: "solana",
    is_active: true,
    is_public: true
  });

  // Reset form data when endpoint changes
  useEffect(() => {
    if (endpoint) {
      setFormData({
        name: endpoint.name,
        url: endpoint.url,
        category: endpoint.category || "solana",
        is_active: endpoint.is_active !== false,
        is_public: endpoint.is_public !== false
      });
    } else {
      setFormData({
        name: "",
        url: "",
        category: "solana",
        is_active: true,
        is_public: true
      });
    }
  }, [endpoint, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.url) {
      // Alert user of missing fields
      alert('Συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Name field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Όνομα
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          {/* URL field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          {/* Category field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Κατηγορία
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Επιλέξτε κατηγορία" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="dex">DEX</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Active state */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_active" className="text-right">
              Ενεργό
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">
                {formData.is_active ? 'Ενεργό' : 'Ανενεργό'}
              </Label>
            </div>
          </div>
          
          {/* Public state */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_public" className="text-right">
              Δημόσιο
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => setFormData({...formData, is_public: checked})}
              />
              <Label htmlFor="is_public">
                {formData.is_public ? 'Δημόσιο' : 'Ιδιωτικό'}
              </Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? `${submitLabel}...` : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
