
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Η σελίδα δεν βρέθηκε</h1>
        <p className="text-muted-foreground">
          Η σελίδα που προσπαθήσατε να επισκεφτείτε δεν υπάρχει ή έχει μετακινηθεί.
        </p>
        <div className="pt-6">
          <Button asChild size="lg" className="mx-auto">
            <Link to="/">Επιστροφή στην αρχική</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
