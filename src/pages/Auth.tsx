
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import AuthCard from '@/components/auth/AuthCard';
import { useAuthForms } from '@/hooks/useAuthForms';

const Auth = () => {
  const { user } = useAuth();
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

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
