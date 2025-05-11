
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ApiKeyStats as ApiKeyStatsType } from '../types';

interface ApiKeyStatsProps {
  stats: ApiKeyStatsType;
}

export const ApiKeyStats: React.FC<ApiKeyStatsProps> = ({ stats }) => {
  const statBoxes = [
    { name: 'Συνολικά', value: stats.total, color: 'bg-blue-100 text-blue-800' },
    { name: 'Ενεργά', value: stats.active, color: 'bg-green-100 text-green-800' },
    { name: 'Ληγμένα', value: stats.expired, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Ανακληθέντα', value: stats.revoked, color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Στατιστικά Κλειδιών</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statBoxes.map((box) => (
          <Card key={box.name} className="overflow-hidden border">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-bold mb-1 ${box.color.split(' ')[1]}`}>
                {box.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {box.name}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="pt-4">
        <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
          <div 
            className="bg-green-500 h-full flex items-center justify-center text-white text-xs"
            style={{ width: `${(stats.active / Math.max(stats.total, 1)) * 100}%` }}
          >
            {stats.active > 0 && `${Math.round((stats.active / Math.max(stats.total, 1)) * 100)}%`}
          </div>
          <div 
            className="bg-yellow-500 h-full flex items-center justify-center text-white text-xs"
            style={{ width: `${(stats.expired / Math.max(stats.total, 1)) * 100}%` }}
          >
            {stats.expired > 0 && `${Math.round((stats.expired / Math.max(stats.total, 1)) * 100)}%`}
          </div>
          <div 
            className="bg-red-500 h-full flex items-center justify-center text-white text-xs"
            style={{ width: `${(stats.revoked / Math.max(stats.total, 1)) * 100}%` }}
          >
            {stats.revoked > 0 && `${Math.round((stats.revoked / Math.max(stats.total, 1)) * 100)}%`}
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Ενεργά
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
            Ληγμένα
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            Ανακληθέντα
          </div>
        </div>
      </div>
    </div>
  );
};
