
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function RegisterHeliusKeysButton() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const registerAllKeys = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να εγγράψετε τα κλειδιά");
      return;
    }
    
    setIsLoading(true);
    try {
      // Απευθείας καταχώριση στον πίνακα api_keys_storage με το σωστό schema
      const keyEntries = [
        {
          name: "Helius API Key 1",
          key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
          service: "helius-key1",
          description: "Κλειδί Helius API #1",
          status: "active",
          user_id: user.id,
          is_encrypted: false
        },
        {
          name: "Helius API Key 2",
          key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
          service: "helius-key2",
          description: "Κλειδί Helius API #2",
          status: "active",
          user_id: user.id,
          is_encrypted: false
        },
        {
          name: "Helius API Key 3",
          key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
          service: "helius-key3",
          description: "Κλειδί Helius API #3",
          status: "active",
          user_id: user.id,
          is_encrypted: false
        },
        {
          name: "Helius API Key 4",
          key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
          service: "helius-key4",
          description: "Κλειδί Helius API #4",
          status: "active",
          user_id: user.id,
          is_encrypted: false
        },
        {
          name: "Helius API Key 5",
          key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
          service: "helius-key5",
          description: "Κλειδί Helius API #5",
          status: "active",
          user_id: user.id,
          is_encrypted: false
        },
        {
          name: "Helius API Key 6",
          key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
          service: "helius-key6",
          description: "Κλειδί Helius API #6",
          status: "active",
          user_id: user.id,
          is_encrypted: false
        },
        {
          name: "Helius RPC Endpoint",
          key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
          service: "helius-rpc",
          description: "Endpoint RPC Helius",
          status: "active",
          user_id: user.id,
          is_encrypted: false
        },
        {
          name: "Helius WebSocket",
          key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
          service: "helius-websocket",
          description: "WebSocket Helius",
          status: "active",
          user_id: user.id,
          is_encrypted: false
        }
      ];

      // Έλεγχος για υπάρχοντα κλειδιά
      const { data: existingKeys } = await supabase
        .from('api_keys_storage')
        .select('service')
        .eq('user_id', user.id);

      const existingServices = existingKeys?.map(k => k.service) || [];
      const keysToAdd = keyEntries.filter(k => !existingServices.includes(k.service));

      if (keysToAdd.length === 0) {
        toast.info("Όλα τα κλειδιά υπάρχουν ήδη");
        setIsLoading(false);
        return;
      }

      // Εισαγωγή των νέων κλειδιών
      const { error } = await supabase
        .from('api_keys_storage')
        .insert(keysToAdd);

      if (error) throw error;
      
      // Καταχώριση endpoints
      await registerEndpoints();
      
      toast.success(`Προστέθηκαν ${keysToAdd.length} κλειδιά επιτυχώς`);
    } catch (error) {
      console.error("Σφάλμα κατά την εγγραφή των κλειδιών:", error);
      toast.error("Σφάλμα κατά την εγγραφή των κλειδιών");
    } finally {
      setIsLoading(false);
    }
  };

  const registerEndpoints = async () => {
    try {
      const endpoints = [
        {
          name: "Helius Mainnet RPC",
          url: "https://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
          category: "helius",
          is_active: true,
          is_public: true
        },
        {
          name: "Helius API v0 Transactions",
          url: "https://api.helius.xyz/v0/transactions/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
          category: "helius",
          is_active: true,
          is_public: true
        },
        {
          name: "Helius API v0 Addresses",
          url: "https://api.helius.xyz/v0/addresses/{address}/transactions/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
          category: "helius",
          is_active: true,
          is_public: true
        },
        {
          name: "Helius Eclipse",
          url: "https://eclipse.helius-rpc.com/",
          category: "helius",
          is_active: true,
          is_public: true
        },
        {
          name: "Helius WebSocket",
          url: "wss://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
          category: "helius",
          is_active: true,
          is_public: true
        }
      ];

      // Έλεγχος για υπάρχοντα endpoints
      const { data: existingEndpoints } = await supabase
        .from('api_endpoints')
        .select('url')
        .eq('category', 'helius');

      const existingUrls = existingEndpoints?.map(e => e.url) || [];
      const endpointsToAdd = endpoints.filter(e => !existingUrls.includes(e.url));

      if (endpointsToAdd.length === 0) {
        console.log("Όλα τα endpoints υπάρχουν ήδη");
        return;
      }

      // Εισαγωγή των νέων endpoints
      const { error } = await supabase
        .from('api_endpoints')
        .insert(endpointsToAdd);

      if (error) throw error;
      
      console.log(`Προστέθηκαν ${endpointsToAdd.length} endpoints επιτυχώς`);
    } catch (error) {
      console.error("Σφάλμα κατά την εγγραφή των endpoints:", error);
    }
  };
  
  return (
    <Button 
      onClick={registerAllKeys}
      disabled={isLoading || !user}
      variant="default"
      size="sm"
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="h-4 w-4 text-white">+</span>
      )}
      Εγγραφή Όλων των Κλειδιών
    </Button>
  );
}
