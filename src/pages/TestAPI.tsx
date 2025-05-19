
import React from "react";
import { TestApp } from "@/components/TestApp";
import { PageHeader } from "@/components/layout/PageHeader";

export default function TestAPI() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="API Testing"
        description="Test various API integration methods"
      />
      <TestApp />
    </div>
  );
}
