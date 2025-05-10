
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function BotStatusCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Κατάσταση Trading Bot</CardTitle>
        <CardDescription>Γρήγορη επισκόπηση και έλεγχος του bot σας</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-lg mb-4 text-center">
          <p className="mb-2">Το trading bot είναι ανενεργό</p>
          <Link to="/bot-control">
            <Button>
              Διαμόρφωση και Εκκίνηση Bot
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Κατάσταση:</div>
          <div className="text-right font-medium">Ανενεργό</div>
          <div>Τελευταία Δραστηριότητα:</div>
          <div className="text-right">Ποτέ</div>
          <div>Κέρδος/Ζημιά:</div>
          <div className="text-right">0 SOL</div>
        </div>
      </CardContent>
    </Card>
  );
}
