import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, User, Mail, Shield, Building, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { testDataService } from "@/services/testDataService";

const UserProfilesDisplay = () => {
  const { toast } = useToast();
  const testUsers = testDataService.getTestUsers();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${type} copié dans le presse-papiers`
    });
  };

  const getRoleInfo = (role: string) => {
    const roleMap = {
      admin: {
        name: "Administrateur",
        description: "Accès complet à tous les modules, gestion des utilisateurs et création de contenu",
        permissions: ["Gestion complète", "Création de contenu", "Analytics avancés", "Gestion des utilisateurs"],
        color: "bg-red-100 text-red-800"
      },
      team_chief: {
        name: "Chef d'Équipe",
        description: "Gestion d'équipe, attribution de tâches et suivi des performances",
        permissions: ["Gestion d'équipe", "Attribution de tâches", "Accès aux fichiers", "Analytics équipe"],
        color: "bg-purple-100 text-purple-800"
      },
      team_responsible: {
        name: "Responsable d'Équipe",
        description: "Attribution de tâches, gestion des membres et accès aux ressources",
        permissions: ["Attribution de tâches", "Accès aux fichiers", "Gestion des membres"],
        color: "bg-blue-100 text-blue-800"
      },
      team_member: {
        name: "Membre d'Équipe",
        description: "Accès aux formations, téléchargement de fichiers et suivi des tâches",
        permissions: ["Accès aux fichiers", "Upload de fichiers", "Visualisation des tâches"],
        color: "bg-green-100 text-green-800"
      },
      assistant: {
        name: "Assistant",
        description: "Support et aide, édition limitée et tâches de support",
        permissions: ["Accès aux fichiers", "Édition limitée", "Tâches de support"],
        color: "bg-yellow-100 text-yellow-800"
      },
      employee: {
        name: "Employé",
        description: "Accès de base aux formations et téléchargement de ressources",
        permissions: ["Accès aux fichiers", "Téléchargement de fichiers"],
        color: "bg-gray-100 text-gray-800"
      }
    };
    return roleMap[role as keyof typeof roleMap] || roleMap.employee;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Profils de Test Disponibles</h2>
        <p className="text-gray-600">
          Utilisez ces comptes pour tester les différents niveaux d'accès de la plateforme
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Shield className="h-4 w-4" />
            <span className="font-medium">Accès Simplifié</span>
          </div>
          <p className="text-sm text-blue-700">
            <strong>Mot de passe universel :</strong> Utilisez n'importe quel mot de passe (minimum 6 caractères) avec ces emails.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {testUsers.map((user) => {
          const roleInfo = getRoleInfo(user.role);
          
          return (
            <Card key={user.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{user.name}</CardTitle>
                    <Badge className={`text-xs ${roleInfo.color} mb-2`}>
                      {roleInfo.name}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {roleInfo.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Login Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900 font-mono">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user.email, "Email")}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-4 w-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Mot de passe</p>
                      <p className="text-sm text-gray-500">N'importe quel mot de passe (6+ caractères)</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("password123", "Mot de passe suggéré")}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Department and Team Info */}
                <div className="space-y-2">
                  {user.department && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Département:</span>
                      <span className="font-medium">{user.department}</span>
                    </div>
                  )}
                  {user.teamId && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Équipe ID:</span>
                      <span className="font-medium">#{user.teamId}</span>
                    </div>
                  )}
                </div>

                {/* Permissions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Permissions principales :</p>
                  <div className="flex flex-wrap gap-1">
                    {roleInfo.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quick Login Button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => copyToClipboard(user.email, "Email de connexion")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Copier l'Email
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Instructions de Connexion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">📝 Étapes de connexion :</h4>
              <ol className="text-sm space-y-1 text-gray-600">
                <li>1. Copiez l'email du profil souhaité</li>
                <li>2. Collez-le dans le champ email</li>
                <li>3. Tapez n'importe quel mot de passe (6+ caractères)</li>
                <li>4. Cliquez sur "Se connecter"</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">🔑 Exemples de mots de passe :</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <code className="bg-gray-100 px-1 rounded">password123</code></li>
                <li>• <code className="bg-gray-100 px-1 rounded">test2024</code></li>
                <li>• <code className="bg-gray-100 px-1 rounded">demo123</code></li>
                <li>• <code className="bg-gray-100 px-1 rounded">123456</code></li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">💡 Conseil :</h4>
            <p className="text-sm text-yellow-700">
              Chaque profil offre une expérience différente de la plateforme. Testez plusieurs comptes pour découvrir 
              toutes les fonctionnalités selon les niveaux d'accès !
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilesDisplay;