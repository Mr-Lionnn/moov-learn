import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Users, BookOpen, BarChart3, Save, Upload, Clock } from "lucide-react";
import ModuleTimeLimit from "./ModuleTimeLimit";
import { useAuth } from "@/contexts/AuthContext";

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { setModuleDeadline } = useAuth();
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    category: "",
    level: ""
  });

  const studentProgress = [
    { id: 1, name: "Marie Martin", email: "marie@example.com", coursesEnrolled: 5, coursesCompleted: 3, totalHours: 45, avgScore: 87 },
    { id: 2, name: "Pierre Durand", email: "pierre@example.com", coursesEnrolled: 3, coursesCompleted: 2, totalHours: 32, avgScore: 92 },
    { id: 3, name: "Sophie Laurent", email: "sophie@example.com", coursesEnrolled: 7, coursesCompleted: 4, totalHours: 68, avgScore: 78 },
    { id: 4, name: "Thomas Moreau", email: "thomas@example.com", coursesEnrolled: 4, coursesCompleted: 1, totalHours: 24, avgScore: 65 }
  ];

  const handleCreateCourse = () => {
    console.log("Création du cours:", newCourse);
    // Here would be the actual course creation logic
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      duration: "",
      category: "",
      level: ""
    });
  };

  const handleSetTimeLimit = (moduleId: string, deadline: string, teamMembers: string[]) => {
    setModuleDeadline(moduleId, deadline, teamMembers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Panneau d'Administration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Gestion des Cours
              </TabsTrigger>
              <TabsTrigger value="deadlines">
                <Clock className="h-4 w-4 mr-2" />
                Délais de Formation
              </TabsTrigger>
              <TabsTrigger value="students">
                <Users className="h-4 w-4 mr-2" />
                Progrès des Étudiants
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Créer un Nouveau Cours</CardTitle>
                  <CardDescription>
                    Ajoutez un nouveau cours à la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du Cours</Label>
                      <Input
                        id="title"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        placeholder="Ex: Introduction au JavaScript"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructor">Instructeur</Label>
                      <Input
                        id="instructor"
                        value={newCourse.instructor}
                        onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                        placeholder="Nom de l'instructeur"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      placeholder="Description détaillée du cours..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée</Label>
                      <Input
                        id="duration"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                        placeholder="Ex: 10 heures"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <Select onValueChange={(value) => setNewCourse({...newCourse, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technologie">Technologie</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="langues">Langues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Niveau</Label>
                      <Select onValueChange={(value) => setNewCourse({...newCourse, level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debutant">Débutant</SelectItem>
                          <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                          <SelectItem value="avance">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateCourse} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Créer le Cours
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger du Contenu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deadlines" className="space-y-6">
              <ModuleTimeLimit onTimeLimit={handleSetTimeLimit} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Délais Actifs</CardTitle>
                  <CardDescription>
                    Gérez les délais de formation en cours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Fondamentaux des Réseaux TCP/IP</h4>
                        <p className="text-sm text-gray-600">Équipe Réseau • Échéance: 30 Déc 2024</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">En cours</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Sécurité Informatique Avancée</h4>
                        <p className="text-sm text-gray-600">Équipe Sécurité • Échéance: 15 Jan 2025</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Suivi des Progrès des Étudiants</CardTitle>
                  <CardDescription>
                    Surveillez les performances et les progrès de tous les étudiants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentProgress.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Cours Inscrits</p>
                            <Badge variant="outline">{student.coursesEnrolled}</Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Terminés</p>
                            <Badge className="bg-green-100 text-green-800">{student.coursesCompleted}</Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Heures Totales</p>
                            <span className="text-sm font-medium">{student.totalHours}h</span>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Score Moyen</p>
                            <span className="text-sm font-medium">{student.avgScore}%</span>
                          </div>
                          <div className="w-32">
                            <Progress value={(student.coursesCompleted / student.coursesEnrolled) * 100} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round((student.coursesCompleted / student.coursesEnrolled) * 100)}% terminé
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">1,250</p>
                      <p className="text-sm text-gray-600">Étudiants Actifs</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">890</p>
                      <p className="text-sm text-gray-600">Cours Terminés</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">87%</p>
                      <p className="text-sm text-gray-600">Taux de Réussite</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">2,450</p>
                      <p className="text-sm text-gray-600">Heures Totales</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Cours les Plus Populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Introduction au Développement Web</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm">1,250 étudiants</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Science des Données avec Python</span>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-20 h-2" />
                        <span className="text-sm">890 étudiants</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Marketing Digital</span>
                      <div className="flex items-center gap-2">
                        <Progress value={68} className="w-20 h-2" />
                        <span className="text-sm">650 étudiants</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
