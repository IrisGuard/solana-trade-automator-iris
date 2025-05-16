
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { KeyRound, Loader2, Check, X } from "lucide-react";
import { validateHeliusKey } from "@/utils/addHeliusEndpoints";

export function AddApiKeyForm() {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [service, setService] = useState("helius");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { user } = useAuth();

  const validateKey = async () => {
    if (!key.trim()) {
      toast.error("Παρακαλώ εισάγετε το κλειδί API");
      return;
    }

    setIsValidating(true);
    setIsValid(null);

    try {
      let validationResult = false;

      if (service === "helius") {
        validationResult = await validateHeliusKey(key);
      } else {
        // Default validation logic for other services
        validationResult = key.length > 8; // Simple validation
      }

      setIsValid(validationResult);

      if (validationResult) {
        toast.success("Το κλειδί API είναι έγκυρο");
      } else {
        toast.error("Το κλειδί API δεν είναι έγκυρο");
      }
    } catch (error) {
      console.error("Error validating key:", error);
      setIsValid(false);
      toast.error("Σφάλμα κατά την επικύρωση του κλειδιού");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να προσθέσετε κλειδί");
      return;
    }

    if (!name.trim()) {
      toast.error("Παρακαλώ εισάγετε όνομα για το κλειδί");
      return;
    }

    if (!key.trim()) {
      toast.error("Παρακαλώ εισάγετε το κλειδί API");
      return;
    }

    // Validate key if not already validated
    if (isValid !== true) {
      const shouldContinue = window.confirm("Το κλειδί δεν έχει επικυρωθεί. Θέλετε να συνεχίσετε;");
      if (!shouldContinue) return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('api_keys_storage')
        .insert({
          name: name.trim(),
          key_value: key.trim(),
          service,
          user_id: user.id,
          status: 'active',
          is_encrypted: false
        });

      if (error) throw error;

      toast.success("Το κλειδί API προστέθηκε επιτυχώς");
      setName("");
      setKey("");
      setIsValid(null);
    } catch (error) {
      console.error("Error adding API key:", error);
      toast.error("Σφάλμα κατά την προσθήκη του κλειδιού API");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Προσθήκη Νέου Κλειδιού API
        </CardTitle>
        <CardDescription>
          Συμπληρώστε τα στοιχεία του κλειδιού API που θέλετε να προσθέσετε
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key-name">Όνομα Κλειδιού</Label>
            <Input
              id="key-name"
              placeholder="π.χ. Helius Production API Key"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Υπηρεσία</Label>
            <Select value={service} onValueChange={setService} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε υπηρεσία" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="helius">Helius</SelectItem>
                <SelectItem value="solana">Solana RPC</SelectItem>
                <SelectItem value="other">Άλλο</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-value">Κλειδί API</Label>
            <div className="flex gap-2">
              <Input
                id="key-value"
                placeholder="Εισάγετε το κλειδί API..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={isSubmitting}
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={validateKey}
                disabled={isValidating || !key.trim()}
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isValid === true ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : isValid === false ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  "✓"
                )}
              </Button>
            </div>
            {isValid === true && (
              <p className="text-xs text-green-500">Το κλειδί είναι έγκυρο</p>
            )}
            {isValid === false && (
              <p className="text-xs text-red-500">Το κλειδί δεν είναι έγκυρο</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={isSubmitting}>
          Ακύρωση
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Αποθήκευση...
            </>
          ) : (
            "Αποθήκευση"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
