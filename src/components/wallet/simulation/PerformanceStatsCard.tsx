
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  positive: boolean;
}

export function StatCard({ label, value, positive }: StatCardProps) {
  return (
    <Card className="border border-muted">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`text-xl font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
