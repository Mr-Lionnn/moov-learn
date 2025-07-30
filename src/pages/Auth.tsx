import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Phone, Calendar, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Auth = () => {
  // Create properly configured Supabase client
  const supabase = createClient(
    "https://fxsztiaxjmqniiqdrjoi.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4c3p0aWF4am1xbmlpcWRyam9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjk4MjAsImV4cCI6MjA2NTgwNTgyMH0.Ax8OjnbwnEf9E3b1F9X6pBtOX2pn91e59F8UEsWk1nk",
    {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  );
  
  const { user, signIn, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    date_of_birth: '',
    role: 'student',
    team: '',
    site: '',
    department: ''
  });

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });
      if (error) {
        console.error('Login Error Details:', {
          code: error.code,
          message: error.message,
          status: error.status,
          fullError: error
        });
        toast({
          title: "Erreur de connexion",
          description: `${error.message || 'Une erreur inconnue s\'est produite'}
            ${error.code ? `\nCode d'erreur: ${error.code}` : ''}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté"
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Unexpected Login Error:', error);
      toast({
        title: "Erreur",
        description: `Erreur inattendue : ${error.message || JSON.stringify(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password match validation
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    
    // Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(signupData.password)) {
      toast({
        title: "Mot de passe invalide",
        description: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: signupData.full_name,
            phone: signupData.phone,
            date_of_birth: signupData.date_of_birth,
            role: signupData.role,
            team: signupData.team,
            site: signupData.site,
            department: signupData.department
          }
        }
      });
      
      // Detailed error logging
      if (error) {
        console.error('Signup Error Details:', {
          code: error.code,
          message: error.message,
          status: error.status,
          fullError: error
        });
        
        // Specific error handling for common signup scenarios
        let errorMessage = 'Une erreur d\'inscription s\'est produite';
        switch (error.code) {
          case 'user_already_exists':
            errorMessage = 'Un utilisateur avec cet email existe déjà';
            break;
          case 'invalid_email':
            errorMessage = 'L\'adresse email est invalide';
            break;
          case 'password_too_short':
            errorMessage = 'Le mot de passe est trop court';
            break;
          default:
            errorMessage = error.message || 'Une erreur inconnue s\'est produite';
        }
        toast({
          title: "Erreur d'inscription",
          description: `${errorMessage}${error.code ? `\nCode d'erreur: ${error.code}` : ''}`,
          variant: "destructive"
        });
        return;
      }
      
      // Successful signup handling
      if (data.user) {
        console.log('Signup successful:', data.user);
        toast({
          title: "Inscription réussie",
          description: "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception."
        });
        
        // Optionally navigate or show additional instructions
        if (data.user.email_confirmed_at) {
          navigate('/');
        } else {
          // Prompt user to check email for confirmation
          toast({
            title: "Confirmation requise",
            description: "Veuillez confirmer votre email en cliquant sur le lien envoyé.",
            variant: "default"
          });
        }
      }
    } catch (error: any) {
      console.error('Unexpected Signup Error:', error);
      toast({
        title: "Erreur",
        description: `Erreur de connexion au serveur : ${error.message || JSON.stringify(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">MoovLearn</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Nom complet"
                        className="pl-10"
                        value={signupData.full_name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, full_name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Téléphone"
                        className="pl-10"
                        value={signupData.phone}
                        onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select value={signupData.role} onValueChange={(value) => setSignupData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Étudiant</SelectItem>
                        <SelectItem value="instructor">Instructeur</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Département</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="department"
                        type="text"
                        placeholder="Département"
                        className="pl-10"
                        value={signupData.department}
                        onChange={(e) => setSignupData(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;