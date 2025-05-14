
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UseAuthFormsOptions {
  redirectTo?: string;
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
}

export function useAuthForms(options: UseAuthFormsOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { redirectTo = '/', onSuccess, onError } = options;
  
  const clearError = () => setFormError(null);
  
  const handleError = (error: Error | any) => {
    const message = error.message || 'An error occurred';
    setFormError(message);
    toast.error(message);
    if (onError) onError(error);
    return { error };
  };
  
  const handleSuccess = (user: any) => {
    clearError();
    if (onSuccess) onSuccess(user);
    if (redirectTo) navigate(redirectTo);
    return { user };
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      
      if (!email || !password) {
        return handleError(new Error('Email and password are required'));
      }
      
      // Mock Supabase response
      const response = await supabase.auth.signInWithPassword({ email, password });
      
      if (response.error) {
        return handleError(response.error);
      }
      
      toast.success('Logged in successfully');
      return handleSuccess(response.data.user);
    } catch (error) {
      return handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      
      if (!email || !password) {
        return handleError(new Error('Email and password are required'));
      }
      
      if (password.length < 6) {
        return handleError(new Error('Password must be at least 6 characters'));
      }
      
      // Mock Supabase response
      const response = await supabase.auth.signUp({ 
        email, 
        password, 
        options: {
          emailRedirectTo: window.location.origin
        } 
      });
      
      if (response.error) {
        return handleError(response.error);
      }
      
      toast.success('Signed up successfully');
      return handleSuccess(response.data.user);
    } catch (error) {
      return handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    formError,
    signIn,
    signUp,
    clearError,
  };
}
