
import React from 'react';
import { AppProviders } from './providers/AppProviders';
import { Routes } from './routes';
import './App.css';

function App() {
  return (
    <AppProviders>
      <Routes />
    </AppProviders>
  );
}

export default App;
