
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  authError: string | null;
  passwordStrength?: number;
  checkPasswordStrength?: (password: string) => number;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  loading,
  onSubmit,
  authError,
  passwordStrength = 0,
  checkPasswordStrength
}) => {
  const getPasswordStrengthText = () => {
    if (!password) return "";
    return password.length >= 6 ? "Αποδεκτός" : "Πολύ μικρός";
  };
  
  const getPasswordStrengthColor = () => {
    if (!password) return "bg-gray-200";
    return password.length >= 6 ? "bg-green-500" : "bg-red-500";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (checkPasswordStrength) {
      checkPasswordStrength(newPassword);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2 relative">
        <Input 
          type={showPassword ? "text" : "password"}
          placeholder="Κωδικός" 
          value={password} 
          onChange={handlePasswordChange}
          required 
          className="pr-10"
        />
        <button 
          type="button" 
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        
        {password && (
          <>
            <div className="mt-2">
              <Progress value={password.length >= 6 ? 100 : (password.length * 100 / 6)} className={`h-1.5 ${getPasswordStrengthColor()}`} />
            </div>
            <div className="flex justify-between text-xs">
              <span>Ισχύς κωδικού: {getPasswordStrengthText()}</span>
            </div>
          </>
        )}
        
        <p className="text-xs text-muted-foreground">
          Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Γίνεται εγγραφή...' : 'Εγγραφή'}
      </Button>
    </form>
  );
};

export default SignUpForm;
