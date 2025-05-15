
import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainLayout } from "./MainLayout";
import { HelpButton } from "../help/HelpButton";
import { ThemeProvider } from "@/providers/ThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <MainLayout>
          {children}
        </MainLayout>
      </div>
      <HelpButton />
    </div>
  );
}
