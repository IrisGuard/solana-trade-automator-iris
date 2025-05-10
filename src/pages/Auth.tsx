
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard';
import { useAuthForms } from '@/hooks/useAuthForms';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    authError,
    passwordStrength,
    checkPasswordStrength,
    handleTabChange,
    handleSignIn,
    handleSignUp,
    loading
  } = useAuthForms();

  // Check for existing session directly with supabase client
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsCheckingSession(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        if (data?.session) {
          console.log("User is already logged in, redirecting to dashboard");
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <AuthCard
        onTabChange={handleTabChange}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
        authError={authError}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
        passwordStrength={passwordStrength}
        checkPasswordStrength={checkPasswordStrength}
      />
    </div>
  );
};

export default Auth;
