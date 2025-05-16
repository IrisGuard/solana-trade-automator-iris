
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  name: string;
  value: number;
  month: string;
}

interface PortfolioChartProps {
  chartData: ChartDataPoint[];
}

export function PortfolioChart({ chartData }: PortfolioChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Απόδοση Χαρτοφυλακίου</CardTitle>
        <CardDescription>
          Η απόδοση του χαρτοφυλακίου σας τους τελευταίους 7 μήνες (σε SOL)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                label={{ 
                  value: 'Μήνας', 
                  position: 'insideBottom', 
                  offset: -15 
                }} 
              />
              <YAxis 
                label={{ 
                  value: 'Αξία (SOL)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { textAnchor: 'middle' } 
                }} 
              />
              <Tooltip 
                formatter={(value: any) => [`${value} SOL`, 'Αξία']}
                labelFormatter={(label) => {
                  const dataPoint = chartData.find(item => item.name === label);
                  return dataPoint ? dataPoint.month : label;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                name="Αξία"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
