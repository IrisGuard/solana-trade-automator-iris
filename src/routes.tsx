
import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import MainDashboard from "@/pages/MainDashboard";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<MainDashboard />} />
      <Route path="*" element={<MainDashboard />} />
    </RouterRoutes>
  );
}
