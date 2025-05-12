
import React from "react";
import { ApiKeyStatsPanel } from "./ApiKeyStatsPanel";

interface StatsProps {
  stats: {
    total: number;
    active: number;
    expired: number;
    revoked: number;
    working?: number;
    notWorking?: number;
  };
  services?: {
    name: string;
    count: number;
  }[];
}

export const ApiKeyStats: React.FC<StatsProps> = ({ stats, services = [] }) => {
  return <ApiKeyStatsPanel stats={stats} services={services} />;
};
