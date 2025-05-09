
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface BotTemplateCardProps {
  title: string;
  description: string;
  features: string[];
}

export function BotTemplateCard({ title, description, features }: BotTemplateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full">Use Template</Button>
      </CardFooter>
    </Card>
  );
}
