import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Mail, Lock, User, Phone, Calendar, Building, Users, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { signIn, signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    dateOfBirth: "",
    role: "employee",
    team: "none",
    site: "none",
    department: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!loginEmail || !loginPassword) {
      setErrors({ login: "Veuillez remplir tous les champs" });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        setErrors({ login: error.message });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans Moov-Learn!"
      });
      navigate("/");
    } catch (error) {
      setErrors({ login: "Erreur de connexion. Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      setErrors({ signup: "Veuillez remplir tous les champs obligatoires" });
      setIsLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setErrors({ signup: "Les mots de passe ne correspondent pas" });
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setErrors({ signup: "Le mot de passe doit contenir au moins 6 caractères" });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signupData.email, signupData.password, signupData);
      
      if (error) {
        setErrors({ signup: error.message });
        return;
      }

      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte."
      });
    } catch (error) {
      setErrors({ signup: "Erreur lors de l'inscription. Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moov-Learn</h1>
          <p className="text-gray-600">Plateforme d'apprentissage d'entreprise</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Authentification</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {errors.login && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.login}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  {errors.signup && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.signup}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nom complet *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Nom Prénom"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                          className="pl-10"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="+33 6 12 34 56 78"
                          value={signupData.phone}
                          onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="pl-10"
                        disabled={isLoading}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mot de passe *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          className="pl-10"
                          disabled={isLoading}
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirmer *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="••••••••"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                          className="pl-10"
                          disabled={isLoading}
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-birthday">Date de naissance</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-birthday"
                          type="date"
                          value={signupData.dateOfBirth}
                          onChange={(e) => setSignupData({...signupData, dateOfBirth: e.target.value})}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-role">Rôle</Label>
                      <Select 
                        value={signupData.role} 
                        onValueChange={(value) => setSignupData({...signupData, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employé</SelectItem>
                          <SelectItem value="team_member">Membre d'équipe</SelectItem>
                          <SelectItem value="team_responsible">Responsable d'équipe</SelectItem>
                          <SelectItem value="team_chief">Chef d'équipe</SelectItem>
                          <SelectItem value="assistant">Assistant</SelectItem>
                          <SelectItem value="instructor">Instructeur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-department">Département</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-department"
                        type="text"
                        placeholder="ex: IT, Marketing, RH..."
                        value={signupData.department}
                        onChange={(e) => setSignupData({...signupData, department: e.target.value})}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Création..." : "Créer le compte"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>© 2024 Moov-Learn. Plateforme de formation d'entreprise.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;