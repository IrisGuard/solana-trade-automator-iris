
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KeyRecoveryView } from "./apiVault/KeyRecoveryView";
import { Home } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function KeyRecoveryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Λειτουργικά Κλειδιά API</h2>
        <Link to="/">
          <Button variant="outline" className="gap-1">
            <Home className="h-4 w-4" />
            Επιστροφή στην Αρχική
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Κλειδιά API</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <KeyRecoveryView />
        </CardContent>
      </Card>
    </div>
  );
}
