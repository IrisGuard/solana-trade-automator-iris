
import React from "react";
import { ServiceInfo } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightCircle, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ServiceStatsProps {
  services: ServiceInfo[];
}

export const ServiceStats: React.FC<ServiceStatsProps> = ({ services }) => {
  // Calculate total keys
  const totalKeys = services.reduce((sum, service) => sum + service.count, 0);
  
  // Sort services by count (descending)
  const sortedServices = [...services].sort((a, b) => b.count - a.count);
  
  return (
    <div className="space-y-4">
      {totalKeys === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Database className="h-12 w-12 mb-2 opacity-20" />
          <p>Δεν υπάρχουν δεδομένα για τις υπηρεσίες</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedServices.map((service, index) => {
            const percentage = Math.round((service.count / totalKeys) * 100);
            const workingPercentage = 
              service.workingCount !== undefined && service.count > 0 
                ? Math.round((service.workingCount / service.count) * 100)
                : undefined;
                
            return (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowRightCircle className="h-4 w-4 text-primary" />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{service.count} κλειδιά</Badge>
                        <Badge variant="secondary">{percentage}%</Badge>
                      </div>
                    </div>
                    
                    <Progress value={percentage} className="h-2" />
                    
                    {workingPercentage !== undefined && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <span>Λειτουργικά: {service.workingCount} από {service.count}</span>
                        <span>{workingPercentage}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
