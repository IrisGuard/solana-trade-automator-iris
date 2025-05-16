
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, ChartBar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock performance data
const performanceData = [
  { day: "Δευ", profit: 1.2, trades: 5 },
  { day: "Τρι", profit: -0.8, trades: 3 },
  { day: "Τετ", profit: 2.4, trades: 8 },
  { day: "Πεμ", profit: 0.5, trades: 4 },
  { day: "Παρ", profit: 3.2, trades: 10 },
  { day: "Σαβ", profit: 1.8, trades: 6 },
  { day: "Κυρ", profit: -0.3, trades: 2 }
];

// Monthly stats
const monthlyStats = [
  { label: "Συνολικά κέρδη", value: "+12.5%", isPositive: true },
  { label: "Επιτυχημένες συναλλαγές", value: "76%", isPositive: true },
  { label: "Μέση απόδοση", value: "+1.8%", isPositive: true },
  { label: "Μέγιστη πτώση", value: "-2.4%", isPositive: false }
];

export function PerformanceMetricsCard() {
  // Calculate total profit for this period
  const totalProfit = performanceData.reduce((acc, item) => acc + item.profit, 0).toFixed(1);
  const isPositiveProfit = Number(totalProfit) >= 0;
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Απόδοση συναλλαγών
          </CardTitle>
          <CardDescription>
            Στατιστικά απόδοσης των τελευταίων 7 ημερών
          </CardDescription>
        </div>
        <Badge 
          variant={isPositiveProfit ? "default" : "destructive"}
          className="flex items-center gap-1"
        >
          {isPositiveProfit ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {isPositiveProfit ? "+" : ""}{totalProfit}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis 
                tickFormatter={(value) => `${value}%`} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, "Κέρδος"]}
                labelFormatter={(label) => `Ημέρα: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ r: 3, fill: "#8B5CF6", strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: "#8B5CF6", strokeWidth: 2, fill: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {monthlyStats.map((stat, index) => (
            <div key={index} className="rounded-lg border p-3">
              <div className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </div>
              <div className={`mt-1 flex items-center text-lg font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
