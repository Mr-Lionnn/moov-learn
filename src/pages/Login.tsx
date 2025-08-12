
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { testDataService } from "@/services/testDataService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, AlertTriangle, Lock, Building, Users, MapPin } from "lucide-react";
import { emailSchema, passwordSchema, loginRateLimiter, sanitizeText, generateCSRFToken } from "@/utils/security";
import { useToast } from "@/hooks/use-toast";
import UserProfilesDisplay from "@/components/UserProfilesDisplay";
import PasswordChangeModal from "@/components/PasswordChangeModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate inputs
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);
    
    if (!emailValidation.success || !passwordValidation.success) {
      setErrors({
        email: emailValidation.error?.issues[0]?.message,
        password: passwordValidation.error?.issues[0]?.message
      });
      setIsLoading(false);
      return;
    }

    // Check rate limiting
    const sanitizedEmail = sanitizeText(email.toLowerCase());
    if (loginRateLimiter.isBlocked(sanitizedEmail)) {
      setErrors({ general: "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes." });
      setIsLoading(false);
      return;
    }

    // Record login attempt
    loginRateLimiter.recordAttempt(sanitizedEmail);
    
    console.log('Form login attempt with email:', sanitizedEmail);
    
    // Simulate network delay for security
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check if this is a test user email
      const testUsers = localStorage.getItem('moov_test_users');
      if (testUsers) {
        const users = JSON.parse(testUsers);
        const testUser = users.find((u: any) => u.email === email);
        if (testUser) {
          console.log('Found test user:', testUser);
          loginRateLimiter.reset(sanitizedEmail); // Reset on successful login
          login({
            id: testUser.id,
            email: testUser.email,
            name: testUser.name,
            role: testUser.role,
            department: testUser.department,
            teamId: testUser.teamId
          });
          toast({
            title: "Connexion réussie",
            description: `Bienvenue, ${testUser.name}!`
          });
          navigate("/");
          return;
        }
      }
      
      // Fallback to mock user for any other email
      const mockUser = {
        id: 1,
        email: sanitizedEmail,
        name: "Utilisateur Demo",
        role: "employee" as const,
        department: "IT"
      };
      
      console.log('Using mock user:', mockUser);
      loginRateLimiter.reset(sanitizedEmail); // Reset on successful login
      login(mockUser);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans Moov-Learn!"
      });
      navigate("/");
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: "Erreur de connexion. Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
  };

  const [showProfiles, setShowProfiles] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  if (showProfiles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => setShowProfiles(false)}
            >
              ← Retour à la connexion
            </Button>
          </div>
          <UserProfilesDisplay />
        </div>
      </div>
    );
  }

  if (showPasswordChange) {
    return <PasswordChangeModal onClose={() => setShowPasswordChange(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-7xl space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Moov-Learn</h1>
          <p className="text-sm sm:text-base text-gray-600">Plateforme d'apprentissage d'entreprise</p>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="hidden" name="csrf_token" value={generateCSRFToken()} />
              
              {errors.general && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.general}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full moov-gradient text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowProfiles(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Voir les Profils de Test
              </Button>
              
              <Button
                variant="default"
                className="w-full moov-gradient text-white"
                onClick={() => setShowPasswordChange(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Modifier le Mot de Passe
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Moov-Learn. Plateforme de formation d'entreprise.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
