
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Στατιστικά</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Συναλλαγές</CardTitle>
            <CardDescription>
              Σύνοψη συναλλαγών
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Συνδεθείτε για να δείτε τα στατιστικά των συναλλαγών σας.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trading Bot</CardTitle>
            <CardDescription>
              Απόδοση του trading bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Συνδεθείτε για να δείτε την απόδοση του trading bot.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Τιμές Tokens</CardTitle>
            <CardDescription>
              Τρέχουσες τιμές tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Συνδεθείτε για να δείτε τις τιμές των tokens.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
