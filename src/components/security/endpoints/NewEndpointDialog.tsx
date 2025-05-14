
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ApiEndpoint, NewEndpointDialogProps } from '../apiVault/types';
import { v4 as uuidv4 } from 'uuid';

export function NewEndpointDialog({ onAddEndpoint, onCancel }: NewEndpointDialogProps) {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [category, setCategory] = useState('general');

  const handleClose = () => {
    setOpen(false);
    onCancel();
  };

  const handleSubmit = () => {
    if (!name || !url) return;

    const newEndpoint: ApiEndpoint = {
      id: uuidv4(),
      name,
      url,
      method,
      category: category,
      requiresAuth
    };

    onAddEndpoint(newEndpoint);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Νέο Endpoint API</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Όνομα</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Εισάγετε όνομα για το endpoint"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/v1/data"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="method">Μέθοδος</Label>
              <Select value={method} onValueChange={(value) => setMethod(value as any)}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Επιλέξτε μέθοδο" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Κατηγορία</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Επιλέξτε κατηγορία" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Γενικά</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="requires-auth"
              checked={requiresAuth}
              onCheckedChange={setRequiresAuth}
            />
            <Label htmlFor="requires-auth">Απαιτεί Αυθεντικοποίηση</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Ακύρωση
          </Button>
          <Button onClick={handleSubmit}>Προσθήκη</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
