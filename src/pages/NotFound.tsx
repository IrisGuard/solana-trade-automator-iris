
import React from "react";
import { Link } from "@/lib/router-exports";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="bg-card border rounded-lg p-8 max-w-md w-full shadow-lg">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Η σελίδα δεν βρέθηκε</h1>
        
        <p className="text-muted-foreground mb-6">
          Η σελίδα που αναζητήσατε δεν υπάρχει ή μπορεί να έχει μετακινηθεί. 
          Παρακαλούμε ελέγξτε τη διεύθυνση URL ή επιστρέψτε στην αρχική σελίδα.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Αρχική Σελίδα
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="gap-2">
            <Link to="#" onClick={() => history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Επιστροφή
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
