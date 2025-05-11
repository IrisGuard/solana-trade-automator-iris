
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsProps {
  stats: {
    total: number;
    active: number;
    expired: number;
    revoked: number;
    working?: number;
    notWorking?: number;
  };
}

export const ApiKeyStats: React.FC<StatsProps> = ({ stats }) => {
  const workingPercentage = stats.total > 0 && stats.working !== undefined 
    ? Math.round((stats.working / stats.total) * 100) 
    : null;
    
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800 font-medium">Συνολικά</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-green-800 font-medium">Ενεργά</div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">{stats.expired}</div>
            <div className="text-sm text-amber-800 font-medium">Ληγμένα</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{stats.revoked}</div>
            <div className="text-sm text-red-800 font-medium">Ανακληθέντα</div>
          </CardContent>
        </Card>
      </div>
      
      {stats.working !== undefined && stats.notWorking !== undefined && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Κατάσταση λειτουργίας</h3>
              <span className="font-bold">{workingPercentage}%</span>
            </div>
            <Progress value={workingPercentage || 0} className="h-2" />
            
            <div className="flex justify-between mt-2 text-sm">
              <div>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                <span>Λειτουργικά: {stats.working}</span>
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                <span>Μη λειτουργικά: {stats.notWorking}</span>
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-1"></span>
                <span>Άγνωστα: {stats.total - (stats.working + stats.notWorking)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Κατανομή κατάστασης</h3>
          </div>
          <div className="h-8 rounded-md overflow-hidden flex">
            {stats.total > 0 ? (
              <>
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(stats.active / stats.total) * 100}%` }}
                ></div>
                <div 
                  className="bg-amber-400" 
                  style={{ width: `${(stats.expired / stats.total) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(stats.revoked / stats.total) * 100}%` }}
                ></div>
              </>
            ) : (
              <div className="bg-gray-200 w-full"></div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <div>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              <span>Ενεργά: {stats.active}</span>
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-amber-400 rounded-full mr-1"></span>
              <span>Ληγμένα: {stats.expired}</span>
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
              <span>Ανακληθέντα: {stats.revoked}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
