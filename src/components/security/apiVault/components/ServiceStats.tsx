
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ServiceInfo } from '../types';
import { getServiceIcon } from '../utils';

interface ServiceStatsProps {
  services: ServiceInfo[];
}

export const ServiceStats: React.FC<ServiceStatsProps> = ({ services }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Σύνοψη Υπηρεσιών</h3>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Υπηρεσία</TableHead>
                <TableHead className="text-right">Κλειδιά</TableHead>
                <TableHead className="text-right">Λειτουργικά</TableHead>
                <TableHead className="text-right">Ποσοστό</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Δεν βρέθηκαν υπηρεσίες
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.name}>
                    <TableCell className="flex items-center gap-2">
                      <span className="text-lg">{getServiceIcon(service.name)}</span>
                      <span className="capitalize">{service.name}</span>
                    </TableCell>
                    <TableCell className="text-right">{service.count}</TableCell>
                    <TableCell className="text-right">{service.workingCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(service.workingCount / Math.max(service.count, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span>
                          {Math.round((service.workingCount / Math.max(service.count, 1)) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
