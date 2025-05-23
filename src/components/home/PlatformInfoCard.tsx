
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PlatformInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Features</CardTitle>
        <CardDescription>Advanced trading automation for Solana</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Our platform provides professional-grade trading automation tools for the Solana ecosystem.
        </p>
        <div className="bg-muted p-3 rounded-lg">
          <h4 className="font-medium mb-2">Key Features</h4>
          <ul className="space-y-1 list-disc pl-5 text-sm">
            <li>Real-time portfolio tracking</li>
            <li>Automated trading strategies</li>
            <li>Advanced risk management</li>
            <li>Professional analytics dashboard</li>
            <li>Secure API key management</li>
          </ul>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/bot-control">
            Create Trading Bot
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
