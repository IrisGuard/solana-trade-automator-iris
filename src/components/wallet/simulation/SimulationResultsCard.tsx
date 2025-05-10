
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function SimulationResultsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
        <CardDescription>Performance metrics from simulations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Return", value: "+12.8%", positive: true },
            { label: "Max Drawdown", value: "-4.3%", positive: false },
            { label: "Win Rate", value: "68%", positive: true },
            { label: "Sharpe Ratio", value: "1.74", positive: true }
          ].map((stat, i) => (
            <Card key={i} className="border border-muted">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Latest Simulation</h4>
            <p className="text-sm text-muted-foreground">Run 2 hours ago</p>
          </div>
          
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <p>Strategy</p>
              <p className="font-medium">Grid Trading</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Trading Pair</p>
              <p className="font-medium">SOL/USDC</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Period</p>
              <p className="font-medium">Last Week</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Initial Capital</p>
              <p className="font-medium">1,000 USDC</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Final Capital</p>
              <p className="font-medium text-green-400">1,128 USDC</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Trades Executed</p>
              <p className="font-medium">47</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" className="w-full">View Detailed Report</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
