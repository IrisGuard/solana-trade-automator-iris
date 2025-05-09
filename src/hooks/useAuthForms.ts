
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { toast } from 'sonner';
import zxcvbn from 'zxcvbn';

export const useAuthForms = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();

  // Ενημερώνει την ισχύ του κωδικού όταν αλλάζει
  const checkPasswordStrength = (pwd: string) => {
    if (!pwd) {
      setPasswordStrength(0);
      return 0;
    }
    
    const result = zxcvbn(pwd);
    setPasswordStrength(result.score);
    return result.score;
  };

  // Clear error when switching tabs
  const handleTabChange = () => {
    setAuthError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }
    
    try {
      const { success, error } = await signIn(email, password);
      
      if (error) {
        console.error("Sign in error:", error);
        if (error.message?.includes('Invalid login credentials')) {
          setAuthError('Λάθος email ή κωδικός πρόσβασης.');
        } else {
          setAuthError(error.message);
        }
        return;
      }
      
      if (success) {
        console.log('Login successful, redirecting...');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setAuthError('Παρουσιάστηκε ένα απρόσμενο σφάλμα κατά τη σύνδεση.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }
    
    // Έλεγχος ισχύος κωδικού
    const strength = checkPasswordStrength(password);
    if (password.length < 8) {
      setAuthError('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες');
      return;
    }
    
    if (strength < 3) {
      setAuthError('Ο κωδικός είναι πολύ αδύναμος. Παρακαλώ χρησιμοποιήστε συνδυασμό πεζών/κεφαλαίων, αριθμών και συμβόλων.');
      return;
    }
    
    try {
      const { success, error } = await signUp(email, password);
      
      if (error) {
        console.error("Sign up error:", error);
        if (error.message?.includes('already registered')) {
          setAuthError('Αυτό το email χρησιμοποιείται ήδη. Παρακαλώ δοκιμάστε να συνδεθείτε.');
        } else {
          setAuthError(error.message);
        }
        return;
      }
      
      if (success) {
        console.log('Signup successful!');
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setAuthError('Παρουσιάστηκε ένα απρόσμενο σφάλμα κατά την εγγραφή.');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    authError,
    setAuthError,
    passwordStrength,
    checkPasswordStrength,
    handleTabChange,
    handleSignIn,
    handleSignUp,
    loading
  };
};
