
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceIcon } from "../utils";
import { Progress } from "@/components/ui/progress";
import { ServiceInfo } from "../types";

interface ServiceStatsProps {
  services: ServiceInfo[];
}

export const ServiceStats: React.FC<ServiceStatsProps> = ({ services }) => {
  // Υπολογισμός συνολικών κλειδιών και λειτουργικών
  const totalKeys = services.reduce((sum, service) => sum + service.count, 0);
  const totalWorkingKeys = services.reduce((sum, service) => sum + (service.workingCount || 0), 0);
  
  // Ταξινόμηση υπηρεσιών με βάση τον αριθμό των κλειδιών
  const sortedServices = [...services].sort((a, b) => b.count - a.count);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Σύνοψη Υπηρεσιών</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-2 mb-4 grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{services.length}</div>
              <div className="text-sm text-muted-foreground">Υπηρεσίες</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalKeys}</div>
              <div className="text-sm text-muted-foreground">Κλειδιά</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalWorkingKeys}</div>
              <div className="text-sm text-muted-foreground">Λειτουργικά</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {sortedServices.map(service => {
          const workingPercentage = service.count > 0 
            ? Math.round(((service.workingCount || 0) / service.count) * 100) 
            : 0;
            
          return (
            <Card key={service.name}>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="text-xl mr-2">{getServiceIcon(service.name)}</div>
                  <h3 className="font-medium capitalize">{service.name}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Σύνολο κλειδιών</div>
                    <div className="text-xl font-bold">{service.count}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Λειτουργικά</div>
                    <div className="text-xl font-bold">
                      {service.workingCount || 0}
                      <span className="text-sm font-normal ml-1">
                        ({workingPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Λειτουργικότητα</span>
                    <span>{workingPercentage}%</span>
                  </div>
                  <Progress value={workingPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
