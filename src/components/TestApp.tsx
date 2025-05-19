
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
import { fetchWithApiKey } from "@/utils/apiKeyFetcher";
import { makeApiRequest } from "@/utils/apiRequestHandler";

// Free API endpoints for testing
const FREE_ENDPOINTS = [
  {
    name: "Solscan Token Info",
    url: "https://public-api.solscan.io/token/meta?tokenAddress=So11111111111111111111111111111111111111112",
    service: "solscan"
  },
  {
    name: "Solana Balance",
    url: "https://api.mainnet-beta.solana.com",
    method: "POST",
    body: {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: ["vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"]
    },
    service: "solana"
  },
  {
    name: "SOL Price",
    url: "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    service: "coingecko"
  }
];

export function TestApp() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("direct");

  // Test a free API endpoint directly
  const testDirectApi = async (endpoint: typeof FREE_ENDPOINTS[0], index: number) => {
    const id = `${endpoint.name}-${index}`;
    setIsLoading(prev => ({ ...prev, [id]: true }));
    setErrors(prev => ({ ...prev, [id]: "" }));
    
    try {
      const method = endpoint.method || "GET";
      const options: RequestInit = { 
        method,
        headers: { "Content-Type": "application/json" }
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(endpoint.url, options);
      const data = await response.json();
      
      setResults(prev => ({ ...prev, [id]: data }));
      toast.success(`Successfully called ${endpoint.name}`);
    } catch (error) {
      console.error(`Error testing ${endpoint.name}:`, error);
      setErrors(prev => ({ ...prev, [id]: error instanceof Error ? error.message : "Unknown error" }));
      toast.error(`Failed to call ${endpoint.name}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Test using the fetchWithApiKey utility
  const testWithApiKey = async (endpoint: typeof FREE_ENDPOINTS[0], index: number) => {
    const id = `${endpoint.name}-${index}`;
    setIsLoading(prev => ({ ...prev, [id]: true }));
    setErrors(prev => ({ ...prev, [id]: "" }));
    
    try {
      let data;
      if (endpoint.method === "POST" && endpoint.body) {
        data = await fetchWithApiKey(endpoint.url, endpoint.service, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(endpoint.body)
        });
      } else {
        data = await fetchWithApiKey(endpoint.url, endpoint.service);
      }
      
      setResults(prev => ({ ...prev, [id]: data }));
      toast.success(`Successfully called ${endpoint.name} with API key`);
    } catch (error) {
      console.error(`Error testing ${endpoint.name} with API key:`, error);
      setErrors(prev => ({ ...prev, [id]: error instanceof Error ? error.message : "Unknown error" }));
      toast.error(`Failed to call ${endpoint.name} with API key`);
    } finally {
      setIsLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Test using the makeApiRequest utility
  const testMakeApiRequest = async (endpoint: typeof FREE_ENDPOINTS[0], index: number) => {
    const id = `${endpoint.name}-${index}`;
    setIsLoading(prev => ({ ...prev, [id]: true }));
    setErrors(prev => ({ ...prev, [id]: "" }));
    
    try {
      const options: any = { 
        endpoint: endpoint.service,
        method: endpoint.method || "GET",
      };
      
      if (endpoint.body) {
        options.body = endpoint.body;
      }
      
      const data = await makeApiRequest(endpoint.url, options);
      
      // Store the result in Supabase
      await storeResult(endpoint, data);
      
      setResults(prev => ({ ...prev, [id]: data }));
      toast.success(`Successfully called ${endpoint.name} with makeApiRequest`);
    } catch (error) {
      console.error(`Error testing ${endpoint.name} with makeApiRequest:`, error);
      setErrors(prev => ({ ...prev, [id]: error instanceof Error ? error.message : "Unknown error" }));
      toast.error(`Failed to call ${endpoint.name} with makeApiRequest`);
    } finally {
      setIsLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Store the API response in the Supabase table
  const storeResult = async (endpoint: typeof FREE_ENDPOINTS[0], data: any) => {
    try {
      // Extract an address from the URL or use a default
      let address = "default";
      
      if (endpoint.url.includes("tokenAddress=")) {
        address = endpoint.url.split("tokenAddress=")[1].split("&")[0];
      } else if (endpoint.body && Array.isArray(endpoint.body.params)) {
        // Try to extract from params if it's a JSON-RPC call
        address = endpoint.body.params[0];
      }
      
      const { error } = await supabase.from('solscan_data').insert({
        data_type: endpoint.name,
        address: address,
        response: data
      });
      
      if (error) {
        console.error("Error storing data in Supabase:", error);
        toast.error("Failed to save response to database");
        return;
      }
      
      toast.success("Response saved to database");
    } catch (error) {
      console.error("Error storing data in Supabase:", error);
      toast.error("Failed to save response to database");
    }
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">API Testing Tool</h1>
        <p className="text-muted-foreground">
          Test different free API endpoints using various methods
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="direct">Direct API Call</TabsTrigger>
          <TabsTrigger value="apikey">With API Key</TabsTrigger>
          <TabsTrigger value="apihandler">API Request Handler</TabsTrigger>
        </TabsList>
        
        <TabsContent value="direct" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Direct API Testing</AlertTitle>
            <AlertDescription>
              Testing API endpoints directly without using any middleware or utilities
            </AlertDescription>
          </Alert>
          
          {FREE_ENDPOINTS.map((endpoint, index) => (
            <Card key={`direct-${index}`}>
              <CardHeader>
                <CardTitle>{endpoint.name}</CardTitle>
                <CardDescription>
                  <span className="flex items-center gap-2">
                    {endpoint.url.split('?')[0]} <ExternalLink className="h-4 w-4" />
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errors[`${endpoint.name}-${index}`] && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {errors[`${endpoint.name}-${index}`]}
                    </AlertDescription>
                  </Alert>
                )}
                {results[`${endpoint.name}-${index}`] && (
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs">
                      {JSON.stringify(results[`${endpoint.name}-${index}`], null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => testDirectApi(endpoint, index)} 
                  disabled={isLoading[`${endpoint.name}-${index}`]}
                >
                  {isLoading[`${endpoint.name}-${index}`] ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : 'Test Endpoint'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="apikey" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Key Testing</AlertTitle>
            <AlertDescription>
              Testing API endpoints with the fetchWithApiKey utility that automatically adds API keys
            </AlertDescription>
          </Alert>
          
          {FREE_ENDPOINTS.map((endpoint, index) => (
            <Card key={`apikey-${index}`}>
              <CardHeader>
                <CardTitle>{endpoint.name}</CardTitle>
                <CardDescription>
                  <span className="flex items-center gap-2">
                    {endpoint.url.split('?')[0]} <ExternalLink className="h-4 w-4" />
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errors[`${endpoint.name}-${index}`] && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {errors[`${endpoint.name}-${index}`]}
                    </AlertDescription>
                  </Alert>
                )}
                {results[`${endpoint.name}-${index}`] && (
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs">
                      {JSON.stringify(results[`${endpoint.name}-${index}`], null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => testWithApiKey(endpoint, index)} 
                  disabled={isLoading[`${endpoint.name}-${index}`]}
                >
                  {isLoading[`${endpoint.name}-${index}`] ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : 'Test With API Key'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="apihandler" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Request Handler Testing</AlertTitle>
            <AlertDescription>
              Testing API endpoints using the makeApiRequest utility with rate limiting and caching
            </AlertDescription>
          </Alert>
          
          {FREE_ENDPOINTS.map((endpoint, index) => (
            <Card key={`apihandler-${index}`}>
              <CardHeader>
                <CardTitle>{endpoint.name}</CardTitle>
                <CardDescription>
                  <span className="flex items-center gap-2">
                    {endpoint.url.split('?')[0]} <ExternalLink className="h-4 w-4" />
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errors[`${endpoint.name}-${index}`] && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {errors[`${endpoint.name}-${index}`]}
                    </AlertDescription>
                  </Alert>
                )}
                {results[`${endpoint.name}-${index}`] && (
                  <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs">
                      {JSON.stringify(results[`${endpoint.name}-${index}`], null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => testMakeApiRequest(endpoint, index)} 
                  disabled={isLoading[`${endpoint.name}-${index}`]}
                >
                  {isLoading[`${endpoint.name}-${index}`] ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : 'Test With makeApiRequest'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
