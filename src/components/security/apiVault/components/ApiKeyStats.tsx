
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ApiKeyStats as ApiKeyStatsType } from "../types";
import { AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";

interface ApiKeyStatsProps {
  stats: ApiKeyStatsType;
  services?: { name: string; count: number }[];
}

export const ApiKeyStats: React.FC<ApiKeyStatsProps> = ({ stats, services = [] }) => {
  // Calculate percentages
  const activePercentage = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;
  const expiredPercentage = stats.total > 0 ? (stats.expired / stats.total) * 100 : 0;
  const revokedPercentage = stats.total > 0 ? (stats.revoked / stats.total) * 100 : 0;
  
  // Working/not working percentages if available
  const workingPercentage = stats.total > 0 && stats.working !== undefined ? 
    (stats.working / stats.total) * 100 : undefined;
  const notWorkingPercentage = stats.total > 0 && stats.notWorking !== undefined ? 
    (stats.notWorking / stats.total) * 100 : undefined;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Στατιστικά κλειδιών</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ενεργά</span>
                </div>
                <div className="font-medium">{stats.active}</div>
              </div>
              <Progress value={activePercentage} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Ληγμένα</span>
                </div>
                <div className="font-medium">{stats.expired}</div>
              </div>
              <Progress value={expiredPercentage} className="h-2 bg-amber-100" indicatorClassName="bg-amber-500" />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Ανακλημένα</span>
                </div>
                <div className="font-medium">{stats.revoked}</div>
              </div>
              <Progress value={revokedPercentage} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
            </div>

            {workingPercentage !== undefined && notWorkingPercentage !== undefined && (
              <div className="grid gap-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span>Λειτουργικότητα</span>
                  </div>
                  <div className="font-medium">{stats.working} / {stats.notWorking}</div>
                </div>
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${workingPercentage}%` }} 
                    />
                    <div 
                      className="bg-gray-400 h-full" 
                      style={{ width: `${notWorkingPercentage}%` }} 
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center pt-2 pb-1">
              <div className="text-sm text-muted-foreground">Συνολικά κλειδιά</div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {services && services.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Υπηρεσίες</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-muted-foreground">{service.count} κλειδιά</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
