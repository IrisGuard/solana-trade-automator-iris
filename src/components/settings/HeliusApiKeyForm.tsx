
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { heliusKeyManager } from "@/services/helius/HeliusKeyManager";
import { useUser } from '@/hooks/useUser';

export function HeliusApiKeyForm() {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { user } = useUser();

  const validateKey = async () => {
    if (!apiKey) {
      toast.error("Please enter an API key");
      return;
    }
    
    setIsValidating(true);
    try {
      const isValidKey = await heliusKeyManager.validateApiKey(apiKey);
      setIsValid(isValidKey);
      
      if (isValidKey) {
        toast.success("API key is valid");
      } else {
        toast.error("API key is not valid");
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      setIsValid(false);
      toast.error("Failed to validate API key");
    } finally {
      setIsValidating(false);
    }
  };

  const saveKey = async () => {
    if (!apiKey) {
      toast.error("Please enter an API key");
      return;
    }
    
    if (!user?.id) {
      toast.error("Please log in to save API keys");
      return;
    }
    
    if (isValid === false) {
      toast.error("Cannot save invalid API key");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Check if key is valid if not already validated
      if (isValid === null) {
        const isValidKey = await heliusKeyManager.validateApiKey(apiKey);
        if (!isValidKey) {
          toast.error("API key is not valid");
          setIsValid(false);
          return;
        }
        setIsValid(true);
      }
      
      // Add key to database
      const { error } = await supabase.from('api_keys_storage').insert({
        user_id: user.id,
        name: 'Helius API Key',
        service: 'helius',
        key_value: apiKey,
        status: 'active',
        description: 'Added from settings page',
        is_encrypted: false
      });
      
      if (error) throw error;
      
      // Reload key manager
      await heliusKeyManager.forceReload();
      
      toast.success("API key saved successfully");
      setApiKey("");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Helius API Key</CardTitle>
        <CardDescription>
          Add your Helius API key to enable transaction history, token balances, and other Solana data features.
          You can get a Helius API key at <a href="https://dev.helius.xyz/dashboard/app" target="_blank" rel="noreferrer" className="text-primary underline">dev.helius.xyz</a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter your Helius API key"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={validateKey} 
                disabled={!apiKey || isValidating}
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Validate"
                )}
              </Button>
            </div>
            {isValid !== null && (
              <div className={`flex items-center mt-2 ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                {isValid ? (
                  <><CheckCircle className="h-4 w-4 mr-1" /> API key is valid</>
                ) : (
                  <><AlertCircle className="h-4 w-4 mr-1" /> API key is not valid</>
                )}
              </div>
            )}
          </div>
          
          <Button 
            onClick={saveKey} 
            disabled={isSubmitting || isValidating || !apiKey}
            className="w-full"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              "Save API Key"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
