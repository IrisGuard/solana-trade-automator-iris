
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { Loader2, Check, AlertCircle, Plus } from "lucide-react";
import { addHeliusEndpoints, addHeliusKey } from "@/utils/addHeliusEndpoints";
import { heliusKeyManager } from "@/services/solana/HeliusKeyManager";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form validation schema
const formSchema = z.object({
  apiKey: z
    .string()
    .min(36, { message: "API key should be at least 36 characters" })
    .regex(/^[0-9a-f-]+$/i, { message: "API key should be in UUID format" })
});

export function AddHeliusButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const { user } = useAuth();

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: ""
    }
  });

  React.useEffect(() => {
    // Check how many keys are already loaded
    const fetchKeyCount = async () => {
      await heliusKeyManager.initialize();
      setKeyCount(heliusKeyManager.getKeyCount());
    };
    
    fetchKeyCount();
  }, []);

  const handleAddHelius = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να προσθέσετε το Helius");
      return;
    }

    // Open dialog for API key input
    setShowDialog(true);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να προσθέσετε το Helius");
      return;
    }

    setIsAdding(true);
    try {
      // Προσθήκη των endpoints αν δεν έχουν ήδη προστεθεί
      await addHeliusEndpoints();
      
      // Προσθήκη του νέου κλειδιού
      await heliusKeyManager.addHeliusKey(data.apiKey, user.id);
      
      setIsAdded(true);
      setKeyCount(heliusKeyManager.getKeyCount());
      toast.success("Το κλειδί Helius προστέθηκε επιτυχώς!");
      setShowDialog(false);
    } catch (error) {
      console.error("Error adding Helius API key:", error);
      toast.error("Σφάλμα κατά την προσθήκη του κλειδιού");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Button
        variant={isAdded ? "outline" : "default"}
        onClick={handleAddHelius}
        disabled={isAdding || !user}
        className="gap-2"
      >
        {isAdding ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isAdded ? (
          <Check size={16} />
        ) : (
          <Plus size={16} />
        )}
        {isAdded 
          ? `${keyCount} Helius ${keyCount === 1 ? 'Κλειδί' : 'Κλειδιά'}`
          : keyCount > 0 
            ? `Προσθήκη άλλου Helius κλειδιού` 
            : "Προσθήκη Helius κλειδιού"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Προσθήκη Κλειδιού Helius API</DialogTitle>
            <DialogDescription>
              Εισάγετε το κλειδί API του Helius. Μπορείτε να αποκτήσετε ένα από το dashboard του Helius.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  disabled={isAdding}
                >
                  Ακύρωση
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <AlertCircle className="mr-2 h-4 w-4" />
                  )}
                  {isAdding ? "Προσθήκη..." : "Προσθήκη Κλειδιού"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
