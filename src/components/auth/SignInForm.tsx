
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  authError: string | null;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  loading,
  onSubmit,
  authError,
}) => {
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
          onChange={(e) => setPassword(e.target.value)}
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
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Γίνεται σύνδεση...' : 'Σύνδεση'}
      </Button>
    </form>
  );
};

export default SignInForm;
