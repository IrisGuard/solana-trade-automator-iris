
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Copy, Key, Plus, RefreshCw, Trash } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  expiresAt?: Date;
  lastUsed?: Date;
}

export function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Development API Key",
      key: "sk_dev_1234567890abcdef1234567890abcdef",
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: "2",
      name: "Production API Key",
      key: "sk_prod_abcdef1234567890abcdef1234567890",
      created: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      lastUsed: new Date()
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKey, setShowNewKey] = useState<{ name: string, key: string } | null>(null);
  
  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: `sk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}`,
        created: new Date()
      };
      
      setApiKeys(prev => [...prev, newKey]);
      setNewKeyName("");
      setIsCreating(false);
      setShowNewKey({ name: newKey.name, key: newKey.key });
      
      toast.success("API key created successfully");
    }, 1000);
  };
  
  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast.success("API key deleted successfully");
  };
  
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                API keys allow secure access to the Solana Trading Platform API.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Development Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Give your key a descriptive name to identify its purpose
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCreateKey} 
                disabled={isCreating || !newKeyName.trim()}
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Key"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {showNewKey && (
        <Alert className="bg-green-50 border-green-200">
          <Key className="h-4 w-4 text-green-500" />
          <AlertDescription className="space-y-2">
            <p className="font-medium">API Key created successfully</p>
            <div className="bg-black/5 p-4 rounded-md space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Name:</span>
                <p className="font-medium">{showNewKey.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">API Key:</span>
                <div className="flex items-center gap-2">
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {showNewKey.key}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleCopyKey(showNewKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-sm text-red-500 font-medium">
              Make sure to copy your API key now. You won't be able to see it again!
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowNewKey(null)}
            >
              I've saved my key
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                {apiKey.name}
                {apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date() ? (
                  <Badge variant="outline" className="text-red-500 border-red-200">Expired</Badge>
                ) : (
                  <Badge variant="success">Active</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Created on {formatDate(apiKey.created)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center space-x-2">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {apiKey.key.substring(0, 12)}...
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopyKey(apiKey.key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                {apiKey.expiresAt && (
                  <div>
                    <span className="font-medium">Expires:</span>{" "}
                    {formatDate(apiKey.expiresAt)}
                  </div>
                )}
                {apiKey.lastUsed && (
                  <div>
                    <span className="font-medium">Last used:</span>{" "}
                    {formatDate(apiKey.lastUsed)}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteKey(apiKey.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete Key
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {apiKeys.length === 0 && (
          <div className="text-center py-10 border rounded-lg bg-muted/30">
            <Key className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No API Keys</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't created any API keys yet
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Create First Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    API keys allow secure access to the Solana Trading Platform API.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-first">Key Name</Label>
                    <Input
                      id="name-first"
                      placeholder="e.g., Development Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Give your key a descriptive name to identify its purpose
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateKey} 
                    disabled={isCreating || !newKeyName.trim()}
                  >
                    {isCreating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Creating...
                      </>
                    ) : (
                      "Create Key"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      
      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-2">API Keys Security</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              Keep your API keys secure. Never share them or commit them to version control.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              If you suspect a key has been compromised, delete it immediately and create a new one.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              For production use, consider using keys with expiration dates.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
