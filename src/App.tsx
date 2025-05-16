
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <Routes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
