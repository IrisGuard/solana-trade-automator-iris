
import React from 'react';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  // Απευθείας ανακατεύθυνση στην αρχική σελίδα
  return <Navigate to="/" replace />;
};

export default Auth;
