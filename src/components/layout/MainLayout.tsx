
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export function MainLayout() {
  const { isConnected } = useWalletConnection();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Outlet />
    </div>
  );
}
