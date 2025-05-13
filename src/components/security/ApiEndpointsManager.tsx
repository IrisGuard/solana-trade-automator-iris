
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Plus, Edit, Trash2, RefreshCw, Globe, Check } from "lucide-react";
import { toast } from "sonner";
import { ApiEndpoint, fetchApiEndpoints, addApiEndpoint, updateApiEndpoint, deleteApiEndpoint, importEndpointsFromEnv } from "@/utils/supabaseEndpoints";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/SupabaseAuthProvider";

export function ApiEndpointsManager() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [formData, setFormData] = useState<ApiEndpoint>({
    name: "",
    url: "",
    category: "solana",
    is_active: true,
    is_public: true
  });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    setLoading(true);
    try {
      const data = await fetchApiEndpoints();
      setEndpoints(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL Αντιγράφηκε');
    
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  const handleImportFromEnv = async () => {
    setLoading(true);
    try {
      await importEndpointsFromEnv();
      await loadEndpoints();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.url) {
      toast.error('Συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }

    setLoading(true);
    try {
      if (selectedEndpoint && isEditDialogOpen) {
        await updateApiEndpoint(selectedEndpoint.id!, formData);
      } else {
        await addApiEndpoint(formData);
      }
      
      await loadEndpoints();
      resetForm();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setFormData({
      name: endpoint.name,
      url: endpoint.url,
      category: endpoint.category || "solana",
      is_active: endpoint.is_active !== false,
      is_public: endpoint.is_public !== false
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το endpoint;')) {
      setLoading(true);
      try {
        await deleteApiEndpoint(id);
        await loadEndpoints();
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      category: "solana",
      is_active: true,
      is_public: true
    });
    setSelectedEndpoint(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Group endpoints by category
  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const category = endpoint.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(endpoint);
    return acc;
  }, {} as Record<string, ApiEndpoint[]>);

  const categories = Object.keys(groupedEndpoints).sort();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Endpoints Manager</CardTitle>
          <CardDescription>
            Διαχείριση των API endpoints της εφαρμογής
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportFromEnv}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Εισαγωγή από ENV
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Προσθήκη
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0] || "solana"} className="w-full">
          <TabsList className="mb-4 overflow-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
                <Badge variant="outline" className="ml-2">
                  {groupedEndpoints[category].length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Όνομα</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="w-[120px]">Κατάσταση</TableHead>
                      <TableHead className="text-right w-[150px]">Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedEndpoints[category].map((endpoint) => (
                      <TableRow key={endpoint.id}>
                        <TableCell className="font-medium">{endpoint.name}</TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[300px]">
                          {endpoint.url}
                        </TableCell>
                        <TableCell>
                          {endpoint.is_active ? 
                            <Badge variant="success">Ενεργό</Badge> : 
                            <Badge variant="secondary">Ανενεργό</Badge>
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(endpoint.url)}
                            >
                              {copiedUrl === endpoint.url ? 
                                <Check className="h-4 w-4" /> : 
                                <Copy className="h-4 w-4" />
                              }
                            </Button>
                            {user && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(endpoint)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => endpoint.id && handleDelete(endpoint.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {groupedEndpoints[category].length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Globe className="h-12 w-12 mb-2 opacity-50" />
                            <p>Δεν υπάρχουν endpoints σε αυτή την κατηγορία</p>
                            <Button 
                              variant="link"
                              onClick={handleAddNew}
                              className="mt-2"
                            >
                              Προσθήκη νέου endpoint
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}

          {endpoints.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Globe className="h-16 w-16 mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-medium">Δεν υπάρχουν API endpoints</h3>
              <p className="text-muted-foreground max-w-md mt-2 mb-4">
                Προσθέστε API endpoints για να συνδεθείτε με εξωτερικές υπηρεσίες
              </p>
              <div className="flex gap-3">
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Προσθήκη endpoint
                </Button>
                <Button variant="outline" onClick={handleImportFromEnv}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Εισαγωγή από ENV
                </Button>
              </div>
            </div>
          )}
        </Tabs>

        {/* Add Endpoint Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Προσθήκη νέου API endpoint</DialogTitle>
              <DialogDescription>
                Συμπληρώστε τα στοιχεία του νέου API endpoint
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
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
              <Button type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Αποθήκευση...' : 'Αποθήκευση'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Endpoint Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Επεξεργασία API endpoint</DialogTitle>
              <DialogDescription>
                Τροποποιήστε τα στοιχεία του API endpoint
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Όνομα
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="edit-url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
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
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-is_active" className="text-right">
                  Ενεργό
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="edit-is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="edit-is_active">
                    {formData.is_active ? 'Ενεργό' : 'Ανενεργό'}
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-is_public" className="text-right">
                  Δημόσιο
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="edit-is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData({...formData, is_public: checked})}
                  />
                  <Label htmlFor="edit-is_public">
                    {formData.is_public ? 'Δημόσιο' : 'Ιδιωτικό'}
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Ενημέρωση...' : 'Ενημέρωση'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
