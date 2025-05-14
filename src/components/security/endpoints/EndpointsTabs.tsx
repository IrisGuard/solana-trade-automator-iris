
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ApiEndpoint } from "@/types/api";
import { EndpointsList } from "./EndpointsList";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface EndpointsTabsProps {
  groupedEndpoints: Record<string, ApiEndpoint[]>;
  categories: string[];
  onEdit: (endpoint: ApiEndpoint) => void;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
  onAddNew: () => void;
}

export function EndpointsTabs({
  groupedEndpoints,
  categories,
  onEdit,
  onDelete,
  loading,
  onAddNew
}: EndpointsTabsProps) {
  return (
    <Tabs defaultValue={categories[0] || "all"} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button size="sm" onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Προσθήκη Endpoint
        </Button>
      </div>

      {categories.map((category) => (
        <TabsContent key={category} value={category} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints - {category}</CardTitle>
              <CardDescription>
                Διαχείριση των API endpoints για την κατηγορία {category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EndpointsList
                endpoints={groupedEndpoints[category] || []}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
