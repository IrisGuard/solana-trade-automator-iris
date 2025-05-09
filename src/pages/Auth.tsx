
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp, loading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Clear error when switching tabs
  const handleTabChange = () => {
    setAuthError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const { success, error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
    }
    if (success) navigate('/dashboard');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    // Validate password strength
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }
    
    const { success, error } = await signUp(email, password);
    if (error) {
      setAuthError(error.message);
    } else if (success) {
      toast.info('Παρακαλώ ελέγξτε το email σας για να επιβεβαιώσετε την εγγραφή σας');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Solana Trade Automator</CardTitle>
          <CardDescription>Συνδεθείτε ή δημιουργήστε λογαριασμό για να συνεχίσετε</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Σύνδεση</TabsTrigger>
              <TabsTrigger value="signup">Εγγραφή</TabsTrigger>
            </TabsList>
            
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="Email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Input 
                    type="password" 
                    placeholder="Κωδικός" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Γίνεται σύνδεση...' : 'Σύνδεση'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Input 
                    type="password" 
                    placeholder="Κωδικός" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Γίνεται εγγραφή...' : 'Εγγραφή'}
                </Button>
              </form>
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
    </div>
  );
};

export default Auth;
