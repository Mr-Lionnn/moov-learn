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
import { X, Plus, Users, BookOpen, BarChart3, Save, Upload, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import ModuleTimeLimit from "./ModuleTimeLimit";
import QuizCreator from "./QuizCreator";
import ModuleCreator from "./module/ModuleCreator";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz } from "@/types/quiz";
import { LearningModule } from "@/types/module";

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { setModuleDeadline, user } = useAuth();
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [showModuleCreator, setShowModuleCreator] = useState(false);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    category: "",
    level: "",
    requiresQuiz: true
  });

  // Sample data for quiz analytics
  const failedAttempts = [
    { user: "Marie Martin", quiz: "Réseaux TCP/IP", score: 45, date: "2024-01-25", attempts: 2 },
    { user: "Pierre Durand", quiz: "Sécurité Avancée", score: 62, date: "2024-01-24", attempts: 1 },
    { user: "Sophie Laurent", quiz: "Linux Administration", score: 58, date: "2024-01-23", attempts: 3 }
  ];

  const questionAnalytics = [
    { question: "Quel port utilise HTTPS?", correctRate: 85, totalAttempts: 120 },
    { question: "Définition d'un VLAN", correctRate: 45, totalAttempts: 120 },
    { question: "Commande Linux pour les permissions", correctRate: 72, totalAttempts: 95 }
  ];

  const studentProgress = [
    { id: 1, name: "Marie Martin", email: "marie@example.com", coursesEnrolled: 5, coursesCompleted: 3, quizzesPassed: 2, totalHours: 45, avgScore: 87, lastQuizScore: 45, needsFollowup: true },
    { id: 2, name: "Pierre Durand", email: "pierre@example.com", coursesEnrolled: 3, coursesCompleted: 2, quizzesPassed: 1, totalHours: 32, avgScore: 92, lastQuizScore: 92, needsFollowup: false },
    { id: 3, name: "Sophie Laurent", email: "sophie@example.com", coursesEnrolled: 7, coursesCompleted: 4, quizzesPassed: 3, totalHours: 68, avgScore: 78, lastQuizScore: 58, needsFollowup: true }
  ];

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) return;

    console.log("Création du cours:", newCourse);
    
    // If course requires quiz, open quiz creator
    if (newCourse.requiresQuiz) {
      setSelectedCourseForQuiz(`course_${Date.now()}`);
      setShowQuizCreator(true);
    }

    // Reset form
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      duration: "",
      category: "",
      level: "",
      requiresQuiz: true
    });
  };

  const handleQuizSave = (quiz: Quiz) => {
    console.log("Quiz créé:", quiz);
    setShowQuizCreator(false);
    setSelectedCourseForQuiz(null);
  };

  const handleModuleSave = (module: LearningModule) => {
    console.log("Module créé:", module);
    setShowModuleCreator(false);
  };

  const handleSetTimeLimit = (moduleId: string, deadline: string, teamMembers: string[]) => {
    setModuleDeadline(moduleId, deadline, teamMembers);
  };

  // Check if user has permission to upload content
  const canUploadContent = user?.role === 'admin' || user?.role === 'team_chief' || user?.role === 'team_responsible';

  if (showQuizCreator && selectedCourseForQuiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Créer un Quiz pour le Cours</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowQuizCreator(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <QuizCreator
              courseId={selectedCourseForQuiz}
              onSave={handleQuizSave}
              onCancel={() => setShowQuizCreator(false)}
            />
          </div>
        </div>
      </div>
    );
  }

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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Gestion des Cours
              </TabsTrigger>
              <TabsTrigger value="quizzes">
                <CheckCircle className="h-4 w-4 mr-2" />
                Quiz & Évaluations
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
              {!canUploadContent && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">
                        Accès restreint: Seuls les Administrateurs, Chefs d'équipe et Responsables peuvent créer du contenu.
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className={!canUploadContent ? "opacity-50 pointer-events-none" : ""}>
                <CardHeader>
                  <CardTitle>Créer un Nouveau Cours</CardTitle>
                  <CardDescription>
                    Ajoutez un nouveau cours avec évaluation obligatoire
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

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requires-quiz"
                      checked={newCourse.requiresQuiz}
                      onChange={(e) => setNewCourse({...newCourse, requiresQuiz: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="requires-quiz" className="text-sm">
                      Quiz obligatoire pour terminer ce cours
                    </Label>
                  </div>

                  <div className="flex gap-2">
                  <Button onClick={handleCreateCourse} className="flex-1" disabled={!canUploadContent}>
                    <Save className="h-4 w-4 mr-2" />
                    Créer le Cours
                  </Button>
                  <Button 
                    onClick={() => setShowModuleCreator(true)} 
                    className="flex-1 moov-gradient text-white" 
                    disabled={!canUploadContent}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Module Avancé
                  </Button>
                    <Button variant="outline" disabled={!canUploadContent}>
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger du Contenu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Quiz</CardTitle>
                  <CardDescription>
                    Créez et gérez les évaluations obligatoires
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => {
                    setSelectedCourseForQuiz("standalone_quiz");
                    setShowQuizCreator(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un Quiz
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Échecs aux Quiz - Suivi Requis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {failedAttempts.map((attempt, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-red-50">
                        <div>
                          <h4 className="font-medium text-red-800">{attempt.user}</h4>
                          <p className="text-sm text-red-600">{attempt.quiz} • Score: {attempt.score}% • {attempt.attempts} tentatives</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-red-100 text-red-800">Échec</Badge>
                          <Button size="sm" variant="outline">Programmer un Suivi</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analyse des Questions</CardTitle>
                  <CardDescription>Questions avec taux d'échec élevé nécessitant révision</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questionAnalytics.map((q, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{q.question}</h4>
                          <p className="text-sm text-gray-600">{q.totalAttempts} tentatives totales</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress value={q.correctRate} className="h-2" />
                          </div>
                          <Badge className={q.correctRate < 60 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                            {q.correctRate}%
                          </Badge>
                        </div>
                      </div>
                    ))}
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
                    Surveillez les performances et les progrès de tous les étudiants, incluant les résultats aux quiz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentProgress.map((student) => (
                      <div key={student.id} className={`flex items-center justify-between p-4 border rounded-lg ${student.needsFollowup ? 'border-orange-200 bg-orange-50' : ''}`}>
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
                            <p className="text-sm text-gray-600">Quiz Réussis</p>
                            <Badge className="bg-green-100 text-green-800">{student.quizzesPassed}</Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Dernier Quiz</p>
                            <Badge className={student.lastQuizScore >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {student.lastQuizScore}%
                            </Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Score Moyen</p>
                            <span className="text-sm font-medium">{student.avgScore}%</span>
                          </div>
                          {student.needsFollowup && (
                            <Button size="sm" className="bg-orange-500 text-white">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Suivi Requis
                            </Button>
                          )}
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
                      <p className="text-sm text-gray-600">Quiz Réussis</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">78%</p>
                      <p className="text-sm text-gray-600">Taux Réussite Quiz</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">23</p>
                      <p className="text-sm text-gray-600">Suivis Requis</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Module Creator Modal */}
        {showModuleCreator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ModuleCreator
                  onSave={handleModuleSave}
                  onCancel={() => setShowModuleCreator(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
