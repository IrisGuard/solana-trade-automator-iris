
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { HeliusStatusMonitor } from '@/components/HeliusStatusMonitor';
import { HeliusSyncButton } from '@/components/HeliusSyncButton';

export function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {user && (
          <HeliusSyncButton />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Κατάσταση Συστήματος</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Σύνδεση χρήστη:</span>
                  <span className="text-green-500 font-medium">Ενεργή</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Συνδεθείτε για να δείτε την κατάσταση του λογαριασμού σας
              </div>
            )}
          </CardContent>
        </Card>
        
        <HeliusStatusMonitor />
      </div>
    </div>
  );
}
