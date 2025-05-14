
import React from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChangeStatusBadge } from './ChangeStatusBadge';
import type { PendingChange } from '@/types/changeApproval';

interface ChangeItemProps {
  change: PendingChange;
  isAdmin: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ChangeItem({ change, isAdmin, onApprove, onReject }: ChangeItemProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-medium">
            Αλλαγή στον πίνακα: {change.table_name}
          </CardTitle>
          <CardDescription>
            Υποβλήθηκε: {formatDate(change.submitted_at)}
          </CardDescription>
        </div>
        <ChangeStatusBadge status={change.status} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <h4 className="font-medium">ID Εγγραφής</h4>
            <p className="text-sm text-muted-foreground">{change.record_id}</p>
          </div>
          <div>
            <h4 className="font-medium">Προτεινόμενες Αλλαγές</h4>
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 text-sm text-white overflow-auto">
              {JSON.stringify(change.changes_json, null, 2)}
            </pre>
          </div>
          {change.comments && (
            <div>
              <h4 className="font-medium">Σχόλια</h4>
              <p className="text-sm text-muted-foreground">{change.comments}</p>
            </div>
          )}
          {change.reviewed_at && (
            <div>
              <h4 className="font-medium">Ημερομηνία Αξιολόγησης</h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(change.reviewed_at)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      {isAdmin && change.status === 'pending' && (
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="destructive" 
            onClick={() => onReject(change.id)}
          >
            Απόρριψη
          </Button>
          <Button 
            variant="default"
            onClick={() => onApprove(change.id)}
          >
            Έγκριση
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
