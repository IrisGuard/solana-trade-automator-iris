
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KeyRecoveryView } from "./apiVault/KeyRecoveryView";
import { Database } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function KeyRecoveryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ανάκτηση Κλειδιών API</h2>
        <Link to="/">
          <Button variant="outline">
            Επιστροφή στην Αρχική
          </Button>
        </Link>
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
    </div>
  );
}
