
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ChangeStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

export function ChangeStatusBadge({ status }: ChangeStatusBadgeProps) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Εκκρεμεί</Badge>;
    case 'approved':
      return <Badge className="bg-green-500 hover:bg-green-600">Εγκρίθηκε</Badge>;
    case 'rejected':
      return <Badge className="bg-red-500 hover:bg-red-600">Απορρίφθηκε</Badge>;
    default:
      return null;
  }
}
