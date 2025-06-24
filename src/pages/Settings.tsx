
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, User, Globe, Moon, Sun, Save } from "lucide-react";
import Header from "@/components/Header";

const Settings = () => {
  const [userRole] = useState<"student" | "admin">("admin");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header userRole={userRole} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
            <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations du Profil
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {userRole === "admin" ? "AD" : "JD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {userRole === "admin" ? "Administrateur IT" : "Jean Dupont"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {userRole === "admin" ? "admin@moovlearn.com" : "jean.dupont@moovlearn.com"}
                      </p>
                      <Badge className="mt-1">
                        {userRole === "admin" ? "Administrateur" : "Étudiant"}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      Changer Photo
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        defaultValue={userRole === "admin" ? "Administrateur" : "Jean"} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        defaultValue={userRole === "admin" ? "IT" : "Dupont"} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={userRole === "admin" ? "admin@moovlearn.com" : "jean.dupont@moovlearn.com"} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        defaultValue="+33 1 23 45 67 89" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Gérez vos préférences de notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications Push</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir des notifications pour les nouvelles formations
                      </p>
                    </div>
                    <Switch 
                      checked={notifications} 
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Emails de Mise à Jour</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir des emails sur les progrès et certifications
                      </p>
                    </div>
                    <Switch 
                      checked={emailUpdates} 
                      onCheckedChange={setEmailUpdates}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sécurité
                  </CardTitle>
                  <CardDescription>
                    Paramètres de sécurité et mot de passe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Changer le Mot de Passe
                  </Button>
                  <Button variant="outline" className="w-full">
                    Authentification à Deux Facteurs
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Préférences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Langue</Label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mode Sombre</Label>
                      <p className="text-xs text-gray-500">
                        Basculer vers le thème sombre
                      </p>
                    </div>
                    <Switch 
                      checked={darkMode} 
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques du Compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Membre depuis</span>
                    <span className="text-sm font-medium">Janvier 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dernière connexion</span>
                    <span className="text-sm font-medium">Aujourd'hui</span>
                  </div>
                  {userRole === "student" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Formations terminées</span>
                        <span className="text-sm font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Certifications</span>
                        <span className="text-sm font-medium">3</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Save Button */}
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les Modifications
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
