
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
import { User, Mail, Shield } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form login attempt with email:', email);
    
    // Check if this is a test user email
    const testUsers = localStorage.getItem('moov_test_users');
    if (testUsers) {
      const users = JSON.parse(testUsers);
      const testUser = users.find((u: any) => u.email === email);
      if (testUser) {
        console.log('Found test user:', testUser);
        login({
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role,
          department: testUser.department,
          teamId: testUser.teamId
        });
        navigate("/");
        return;
      }
    }
    
    // Fallback to mock user for any other email
    const mockUser = {
      id: 1,
      email: email,
      name: "Utilisateur Demo",
      role: "employee" as const,
      department: "IT"
    };
    
    console.log('Using mock user:', mockUser);
    login(mockUser);
    navigate("/");
  };

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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full moov-gradient text-white">
                Se connecter
              </Button>
            </form>
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
