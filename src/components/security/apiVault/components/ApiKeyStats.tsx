
import React from "react";
import { Progress } from "@/components/ui/progress";
import { ApiKeyStats as ApiKeyStatsType, ServiceInfo } from "../types";
import { Card, CardContent } from "@/components/ui/card";

interface ApiKeyStatsProps {
  stats: ApiKeyStatsType;
  services?: ServiceInfo[];
}

export const ApiKeyStats: React.FC<ApiKeyStatsProps> = ({ stats, services }) => {
  const totalKeys = stats.total;
  const activePercent = totalKeys > 0 ? (stats.active / totalKeys) * 100 : 0;
  const expiredPercent = totalKeys > 0 ? (stats.expired / totalKeys) * 100 : 0;
  const revokedPercent = totalKeys > 0 ? (stats.revoked / totalKeys) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Στατιστικά κλειδιών API</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Συνολικά κλειδιά</span>
              <span className="font-medium">{totalKeys}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Ενεργά
                </span>
                <span className="font-medium">{stats.active} ({activePercent.toFixed(0)}%)</span>
              </div>
              <Progress 
                value={activePercent} 
                className="h-2 bg-muted" 
                indicatorColor="bg-green-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                  Ληγμένα
                </span>
                <span className="font-medium">{stats.expired} ({expiredPercent.toFixed(0)}%)</span>
              </div>
              <Progress 
                value={expiredPercent} 
                className="h-2 bg-muted" 
                indicatorColor="bg-amber-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  Ανακλημένα
                </span>
                <span className="font-medium">{stats.revoked} ({revokedPercent.toFixed(0)}%)</span>
              </div>
              <Progress 
                value={revokedPercent} 
                className="h-2 bg-muted" 
                indicatorColor="bg-red-500"
              />
            </div>
          </div>
          
          {services && services.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Κατανομή υπηρεσιών</h4>
              <div className="space-y-2">
                {services.map((service, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="font-medium">{service.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
