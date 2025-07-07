
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Moov-Learn</h1>
          <p className="text-gray-600">Plateforme d'apprentissage d'entreprise</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Login Form */}
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

          {/* Available Test Logins */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Comptes de Test Disponibles</h2>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {testDataService.getTestUsers().map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-sm">{user.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'team_chief' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              <Shield className="h-3 w-3 mr-1" />
                              {user.role === 'admin' ? 'Admin' : 
                               user.role === 'team_chief' ? 'Chef Équipe' : 'Employé'}
                            </Badge>
                            {user.department && (
                              <Badge variant="outline" className="text-xs">
                                {user.department}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          console.log('Direct login as test user:', user);
                          login({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            department: user.department,
                            teamId: user.teamId
                          });
                          navigate("/");
                        }}
                        className="moov-gradient text-white"
                      >
                        Connexion
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Moov-Learn. Plateforme de formation d'entreprise.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
