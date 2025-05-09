
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthCardProps {
  onTabChange: () => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loading: boolean;
  authError: string | null;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  passwordStrength?: number;
  checkPasswordStrength?: (password: string) => number;
}

const AuthCard: React.FC<AuthCardProps> = ({
  onTabChange,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  authError,
  handleSignIn,
  handleSignUp,
  passwordStrength,
  checkPasswordStrength
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
          <Wallet className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Solana Trade Automator</CardTitle>
        <CardDescription>Συνδεθείτε ή δημιουργήστε λογαριασμό για να συνεχίσετε</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full" onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Σύνδεση</TabsTrigger>
            <TabsTrigger value="signup">Εγγραφή</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
              loading={loading}
              onSubmit={handleSignIn}
              authError={authError}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
              loading={loading}
              onSubmit={handleSignUp}
              authError={authError}
              passwordStrength={passwordStrength}
              checkPasswordStrength={checkPasswordStrength}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col justify-center gap-2">
        <p className="text-sm text-muted-foreground">
          Ασφαλής σύνδεση με το Supabase
        </p>
        <p className="text-xs text-muted-foreground">
          Συνδέοντας το πορτοφόλι σας μετά τη σύνδεση, αποδέχεστε τους όρους χρήσης της υπηρεσίας
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
