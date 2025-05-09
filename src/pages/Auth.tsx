
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    
    try {
      const { success, error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
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
    
    // Validate password strength
    if (password.length < 6) {
      setAuthError('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες');
      return;
    }
    
    try {
      const { success, error } = await signUp(email, password);
      
      if (error) {
        if (error.message.includes('already registered')) {
          setAuthError('Αυτό το email χρησιμοποιείται ήδη. Παρακαλώ δοκιμάστε να συνδεθείτε.');
        } else {
          setAuthError(error.message);
        }
        return;
      }
      
      if (success) {
        // Η μετάβαση στο dashboard γίνεται αυτόματα μέσω του useEffect όταν ενημερωθεί το user
        console.log('Signup successful!');
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setAuthError('Παρουσιάστηκε ένα απρόσμενο σφάλμα κατά την εγγραφή.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
