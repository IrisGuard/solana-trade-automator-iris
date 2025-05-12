
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Help() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Βοήθεια & Υποστήριξη</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Χρειάζεστε βοήθεια με την πλατφόρμα; Δείτε τα παρακάτω:</p>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Συχνές Ερωτήσεις</h3>
              <p>Δείτε απαντήσεις στις πιο συχνές ερωτήσεις των χρηστών μας.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Επικοινωνία</h3>
              <p>Στείλτε μας email στο support@solanatrader.com</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Οδηγοί Χρήσης</h3>
              <p>Δείτε αναλυτικούς οδηγούς για τη χρήση της πλατφόρμας.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
