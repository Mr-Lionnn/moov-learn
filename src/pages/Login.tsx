
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Sample users from Republic of Benin
const SAMPLE_USERS = [
  { id: 1, email: "adeline.agbodjan@moov.bj", password: "password123", name: "Adeline Agbodjan", role: "admin" },
  { id: 2, email: "kossi.dossou@moov.bj", password: "password123", name: "Kossi Dossou", role: "student" },
  { id: 3, email: "fatima.alassane@moov.bj", password: "password123", name: "Fatima Alassane", role: "student" },
  { id: 4, email: "rodrigue.hounkpatin@moov.bj", password: "password123", name: "Rodrigue Hounkpatin", role: "admin" },
  { id: 5, email: "aminata.bio@moov.bj", password: "password123", name: "Aminata Bio", role: "student" },
  { id: 6, email: "serge.kpohomou@moov.bj", password: "password123", name: "Serge Kpohomou", role: "student" },
  { id: 7, email: "christelle.adjovi@moov.bj", password: "password123", name: "Christelle Adjovi", role: "admin" },
  { id: 8, email: "olivier.tognon@moov.bj", password: "password123", name: "Olivier Tognon", role: "student" }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = SAMPLE_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${user.name}!`,
        });
        navigate("/");
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickLogin = (user: typeof SAMPLE_USERS[0]) => {
    localStorage.setItem('user', JSON.stringify(user));
    toast({
      title: "Connexion réussie",
      description: `Bienvenue, ${user.name}!`,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Network className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MoovLearn</h1>
          </div>
          <p className="text-gray-600">Plateforme de formation interne</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder aux formations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@moov.bj"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Login for Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Test rapide - Profils disponibles</CardTitle>
            <CardDescription className="text-xs">
              Cliquez sur un profil pour vous connecter rapidement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {SAMPLE_USERS.slice(0, 4).map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left text-xs"
                  onClick={() => handleQuickLogin(user)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-500">
                      {user.email} • {user.role === "admin" ? "Administrateur" : "Employé"}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
