
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, ArrowLeft, Users, Settings, BarChart3, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'team_chief':
        return 'Chef d\'Équipe';
      case 'team_responsible':
        return 'Responsable d\'Équipe';
      case 'team_member':
        return 'Membre d\'Équipe';
      case 'assistant':
        return 'Assistant';
      default:
        return 'Employé';
    }
  };

  const isManagerRole = (role: string) => {
    return ['admin', 'team_chief', 'team_responsible'].includes(role);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Mon Profil</CardTitle>
              <CardDescription>
                Informations de votre compte MoovLearn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <Badge variant={isManagerRole(user.role) ? "default" : "secondary"} className="mt-2">
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Nom complet</p>
                    <p className="text-gray-600">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Rôle</p>
                    <p className="text-gray-600">
                      {getRoleDisplayName(user.role)}
                    </p>
                  </div>
                </div>

                {user.department && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Département</p>
                      <p className="text-gray-600">{user.department}</p>
                    </div>
                  </div>
                )}

                {user.teamId && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Équipe</p>
                      <p className="text-gray-600">Équipe #{user.teamId}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin/Manager specific sections */}
          {isManagerRole(user.role) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Privilèges de Gestion</CardTitle>
                <CardDescription>
                  Fonctionnalités disponibles selon votre rôle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {user.role === 'admin' && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <Settings className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Administration Système</p>
                          <p className="text-gray-600">Gestion complète des utilisateurs et du système</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Analytics Avancés</p>
                          <p className="text-gray-600">Accès aux statistiques détaillées</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {(user.role === 'admin' || user.role === 'team_chief') && (
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Gestion d'Équipe</p>
                        <p className="text-gray-600">Gestion des membres et assignation de tâches</p>
                      </div>
                    </div>
                  )}
                  
                  {isManagerRole(user.role) && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Gestion des Fichiers</p>
                        <p className="text-gray-600">Accès et gestion des documents de formation</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
