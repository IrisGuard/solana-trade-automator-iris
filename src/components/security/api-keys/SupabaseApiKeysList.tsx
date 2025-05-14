
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Key, Loader2 } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  service: string;
  created_at: string;
  status: string;
}

interface SupabaseApiKeysListProps {
  userId: string;
}

export function SupabaseApiKeysList({ userId }: SupabaseApiKeysListProps) {
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchApiKeys();
  }, [userId]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would fetch API keys from Supabase here
      // For now, using mock data
      setTimeout(() => {
        setApiKeys([
          {
            id: '1',
            name: 'Helius API Key',
            service: 'Helius',
            created_at: new Date().toISOString(),
            status: 'active'
          },
          {
            id: '2',
            name: 'CoinGecko API Key',
            service: 'CoinGecko',
            created_at: new Date().toISOString(),
            status: 'active'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setLoading(false);
    }
  };

  const handleAddKey = () => {
    console.log("Add API key");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Κλειδιά</CardTitle>
          <CardDescription>
            Διαχείριση των API κλειδιών σας για διάφορες υπηρεσίες
          </CardDescription>
        </div>
        <Button onClick={handleAddKey}>
          <Plus className="h-4 w-4 mr-2" />
          Προσθήκη
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-6">
            <Key className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">Δεν υπάρχουν API κλειδιά</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Προσθέστε API κλειδιά για να συνδεθείτε με εξωτερικές υπηρεσίες
            </p>
            <Button onClick={handleAddKey}>
              <Plus className="h-4 w-4 mr-2" />
              Προσθήκη κλειδιού
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <div className="font-medium">{key.name}</div>
                  <div className="text-sm text-muted-foreground">Υπηρεσία: {key.service}</div>
                  <div className="text-xs text-muted-foreground">Δημιουργήθηκε: {formatDate(key.created_at)}</div>
                </div>
                <Button variant="outline" size="sm">Διαχείριση</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
