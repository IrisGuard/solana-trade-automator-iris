import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  PieChart, 
  Key, 
  ShieldCheck, 
  AlertTriangle, 
  Ban 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ApiKeyStats, ServiceInfo } from "../types";

interface StatsProps {
  stats: ApiKeyStats;
  services?: ServiceInfo[];
}

export const ApiKeyStatsPanel: React.FC<StatsProps> = ({ stats, services = [] }) => {
  // Sort services by count in descending order
  const sortedServices = [...services].sort((a, b) => b.count - a.count);
  
  // Calculate percentages for active, expired, revoked
  const activePercent = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;
  const expiredPercent = stats.total > 0 ? Math.round((stats.expired / stats.total) * 100) : 0;
  const revokedPercent = stats.total > 0 ? Math.round((stats.revoked / stats.total) * 100) : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Συνολικά" 
          value={stats.total} 
          icon={<Key className="h-5 w-5 text-blue-500" />} 
          bgColor="bg-blue-50" 
          borderColor="border-blue-200" 
          textColor="text-blue-600"
        />
        <StatCard 
          title="Ενεργά" 
          value={stats.active} 
          icon={<ShieldCheck className="h-5 w-5 text-green-500" />} 
          bgColor="bg-green-50" 
          borderColor="border-green-200" 
          textColor="text-green-600"
        />
        <StatCard 
          title="Ληγμένα" 
          value={stats.expired} 
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} 
          bgColor="bg-amber-50" 
          borderColor="border-amber-200" 
          textColor="text-amber-600"
        />
        <StatCard 
          title="Ανακληθέντα" 
          value={stats.revoked} 
          icon={<Ban className="h-5 w-5 text-red-500" />} 
          bgColor="bg-red-50" 
          borderColor="border-red-200" 
          textColor="text-red-600"
        />
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="overview">
            <PieChart className="h-4 w-4 mr-2" />
            Επισκόπηση
          </TabsTrigger>
          <TabsTrigger value="services">
            <BarChart3 className="h-4 w-4 mr-2" />
            Υπηρεσίες
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Κατανομή κατάστασης</h3>
              
              <div className="space-y-4">
                <StatusBar 
                  label="Ενεργά" 
                  count={stats.active} 
                  percentage={activePercent} 
                  color="bg-green-500" 
                />
                <StatusBar 
                  label="Ληγμένα" 
                  count={stats.expired} 
                  percentage={expiredPercent} 
                  color="bg-amber-500" 
                />
                <StatusBar 
                  label="Ανακληθέντα" 
                  count={stats.revoked} 
                  percentage={revokedPercent} 
                  color="bg-red-500" 
                />
              </div>
              
              <div className="h-8 rounded-md overflow-hidden flex mt-6">
                {stats.total > 0 ? (
                  <>
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${activePercent}%` }}
                    ></div>
                    <div 
                      className="bg-amber-400" 
                      style={{ width: `${expiredPercent}%` }}
                    ></div>
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${revokedPercent}%` }}
                    ></div>
                  </>
                ) : (
                  <div className="bg-gray-200 w-full"></div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="pt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Κατανομή υπηρεσιών</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Υπηρεσία</TableHead>
                    <TableHead className="text-right">Πλήθος</TableHead>
                    <TableHead className="text-right">Ποσοστό</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedServices.map(service => {
                    const percentage = stats.total > 0 
                      ? Math.round((service.count / stats.total) * 100) 
                      : 0;
                    
                    return (
                      <TableRow key={service.name}>
                        <TableCell className="capitalize font-medium">{service.name}</TableCell>
                        <TableCell className="text-right">{service.count}</TableCell>
                        <TableCell className="text-right">{percentage}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  bgColor, 
  borderColor, 
  textColor 
}) => (
  <Card className={`${bgColor} border-${borderColor}`}>
    <CardContent className="p-4 flex justify-between items-center">
      <div>
        <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
        <div className={`text-sm font-medium ${textColor}`}>{title}</div>
      </div>
      <div>{icon}</div>
    </CardContent>
  </Card>
);

interface StatusBarProps {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  label, 
  count, 
  percentage, 
  color 
}) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="font-medium">{label}</span>
      <span>{count} <span className="text-muted-foreground">({percentage}%)</span></span>
    </div>
    <Progress value={percentage} className={`h-2 ${color}`} indicatorColor={color} />
  </div>
);
