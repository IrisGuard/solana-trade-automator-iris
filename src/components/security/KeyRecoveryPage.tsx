
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KeyRecoveryView } from "./apiVault/KeyRecoveryView";
import { Database, Home, Key, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function KeyRecoveryPage() {
  const handleAddDemoKeys = () => {
    // Εισαγωγή της λειτουργίας από το αρχείο utilities
    import('./apiVault/utils/diagnosticUtils').then(module => {
      module.injectDemoKeys(30);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ανάκτηση Κλειδιών API</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleAddDemoKeys}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Προσθήκη 30 Κλειδιών
          </Button>
          <Link to="/">
            <Button variant="outline" className="gap-1">
              <Home className="h-4 w-4" />
              Επιστροφή στην Αρχική
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Εργαλείο Ανάκτησης Κλειδιών API</CardTitle>
          </div>
          <CardDescription>
            Βρείτε και ανακτήστε κλειδιά API που είναι αποθηκευμένα στον περιηγητή σας, 
            συμπεριλαμβανομένων από εφαρμογές που δεν λειτουργούν πλέον (όπως το rork.app)
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <KeyRecoveryView />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>Οδηγίες Χρήσης</CardTitle>
          </div>
          <CardDescription>
            Πώς να χρησιμοποιήσετε το εργαλείο ανάκτησης κλειδιών
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">1. Σάρωση για κλειδιά</h3>
              <p className="text-sm text-muted-foreground">
                Πατήστε το κουμπί "Ανάκτηση" για να σαρώσετε τον περιηγητή σας για αποθηκευμένα κλειδιά API.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">2. Βαθιά Σάρωση</h3>
              <p className="text-sm text-muted-foreground">
                Αν δεν βρεθούν κλειδιά με την απλή σάρωση, χρησιμοποιήστε την "Βαθιά Σάρωση" για πιο εκτεταμένη αναζήτηση.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">3. Προσθήκη Δοκιμαστικών Κλειδιών</h3>
              <p className="text-sm text-muted-foreground">
                Για δοκιμή του εργαλείου, μπορείτε να προσθέσετε δοκιμαστικά κλειδιά πατώντας το κουμπί "Προσθήκη 30 Κλειδιών".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
