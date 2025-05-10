
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard';
import { useAuthForms } from '@/hooks/useAuthForms';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
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

  // Check for existing session without using the useAuth hook
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

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
