
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface SupabaseApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  created_at: string;
}

interface SupabaseApiKeysListProps {
  userId: string; // Add userId to props interface
}

export const SupabaseApiKeysList = ({ userId }: SupabaseApiKeysListProps) => {
  const [apiKeys, setApiKeys] = useState<SupabaseApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("api_keys_storage")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      setApiKeys(data || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchApiKeys();
    }
  }, [userId]);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from("api_keys_storage")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setApiKeys((prev) => prev.filter((key) => key.id !== id));
      toast.success("API key deleted successfully");
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    }
  };

  const filteredKeys = apiKeys.filter((key) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      key.name.toLowerCase().includes(searchLower) ||
      key.service.toLowerCase().includes(searchLower)
    );
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("API key copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy API key");
      });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supabase API Keys</CardTitle>
          <CardDescription>
            Manage your Supabase API keys securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Supabase API Keys</CardTitle>
          <CardDescription>
            Manage your Supabase API keys securely
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={fetchApiKeys}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Key
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-4">No API keys found</p>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First API Key
            </Button>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keys..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {filteredKeys.map((key) => (
                <div
                  key={key.id}
                  className="border rounded-md p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{key.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{key.service}</span>
                        <span>•</span>
                        <span>
                          {new Date(key.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="relative bg-muted p-2 rounded font-mono text-sm flex items-center">
                    <code className="flex-1 overflow-x-auto">
                      {!!visibleKeys[key.id]
                        ? key.key
                        : "•".repeat(20)}
                    </code>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleKeyVisibility(key.id)}
                      >
                        {visibleKeys[key.id] ? (
                          <span className="sr-only">Hide</span>
                        ) : (
                          <span className="sr-only">Show</span>
                        )}
                        👁️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard(key.key)}
                      >
                        <span className="sr-only">Copy</span>
                        📋
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteApiKey(key.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

