
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Calendar, Download } from "lucide-react";

// Sample data - in a real app, this would come from your backend
const performanceData = [
  { date: '2023-05-01', value: 100, trades: 0, roi: 0 },
  { date: '2023-05-02', value: 102, trades: 2, roi: 2 },
  { date: '2023-05-03', value: 105, trades: 1, roi: 2.94 },
  { date: '2023-05-04', value: 103, trades: 3, roi: -1.9 },
  { date: '2023-05-05', value: 106, trades: 2, roi: 2.91 },
  { date: '2023-05-06', value: 110, trades: 1, roi: 3.77 },
  { date: '2023-05-07', value: 114, trades: 2, roi: 3.64 },
  { date: '2023-05-08', value: 112, trades: 1, roi: -1.75 },
  { date: '2023-05-09', value: 118, trades: 2, roi: 5.36 },
  { date: '2023-05-10', value: 122, trades: 1, roi: 3.39 },
];

const tradeHistory = [
  { id: '1', date: '2023-05-10 14:32', type: 'buy', token: 'SOL', amount: 2.5, price: 48.75, status: 'completed' },
  { id: '2', date: '2023-05-09 10:15', type: 'sell', token: 'SOL', amount: 1.2, price: 49.50, status: 'completed' },
  { id: '3', date: '2023-05-08 18:22', type: 'buy', token: 'RAY', amount: 15, price: 3.25, status: 'completed' },
  { id: '4', date: '2023-05-07 09:45', type: 'sell', token: 'RAY', amount: 10, price: 3.45, status: 'completed' },
  { id: '5', date: '2023-05-06 22:10', type: 'buy', token: 'SOL', amount: 1.8, price: 47.20, status: 'completed' },
];

export function PerformanceHistoryCard() {
  const [timeRange, setTimeRange] = React.useState("week");

  // Calculate overall metrics
  const overallROI = performanceData[performanceData.length - 1].value - performanceData[0].value;
  const overallROIPercent = ((performanceData[performanceData.length - 1].value / performanceData[0].value) - 1) * 100;
  const totalTrades = performanceData.reduce((sum, item) => sum + item.trades, 0);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-2">
          <div>
            <CardTitle>Ιστορικό Απόδοσης</CardTitle>
            <CardDescription>Παρακολούθηση απόδοσης του Trading Bot</CardDescription>
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Επιλογή περιόδου" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Ημέρα</SelectItem>
              <SelectItem value="week">Εβδομάδα</SelectItem>
              <SelectItem value="month">Μήνας</SelectItem>
              <SelectItem value="year">Έτος</SelectItem>
              <SelectItem value="all">Συνολικά</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="performance">
        <div className="px-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="performance">Απόδοση</TabsTrigger>
            <TabsTrigger value="trades">Συναλλαγές</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="performance">
          <CardContent className="pt-2 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground mb-1">Συνολικό ROI</div>
                <div className="flex items-center">
                  <span className="text-xl font-bold">{overallROI.toFixed(2)}</span>
                  <span className={`ml-2 flex items-center ${overallROI >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {overallROI >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(overallROIPercent).toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground mb-1">Συναλλαγές</div>
                <div className="text-xl font-bold">{totalTrades}</div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground mb-1">Τρέχουσα Αξία</div>
                <div className="text-xl font-bold">{performanceData[performanceData.length - 1].value.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any) => [`${value}`, '']}
                    labelFormatter={(label) => `Ημερομηνία: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Αξία" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="roi" 
                    name="ROI %" 
                    stroke="#82ca9d" 
                    strokeDasharray="5 5"
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="trades">
          <CardContent className="pt-2 px-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Ημερομηνία</th>
                    <th className="text-left p-2">Τύπος</th>
                    <th className="text-left p-2">Token</th>
                    <th className="text-right p-2">Ποσότητα</th>
                    <th className="text-right p-2">Τιμή</th>
                    <th className="text-right p-2">Κατάσταση</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((trade) => (
                    <tr key={trade.id} className="border-b">
                      <td className="p-2">{trade.date}</td>
                      <td className="p-2 capitalize">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${trade.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="p-2">{trade.token}</td>
                      <td className="p-2 text-right">{trade.amount}</td>
                      <td className="p-2 text-right">${trade.price}</td>
                      <td className="p-2 text-right">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <Button variant="outline" size="sm" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Προσαρμογή Ημερομηνιών</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          <span>Εξαγωγή Δεδομένων</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
