
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Clock, AlertCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuthCompatibility";
import { testDataService } from "@/services/testDataService";

const Tasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      const userTasks = testDataService.getTasksForUser(user.id);
      setTasks(userTasks);
    }
  }, [user]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress": return <Clock className="h-5 w-5 text-blue-600" />;
      case "pending": return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "overdue": return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Terminé";
      case "in-progress": return "En cours";
      case "pending": return "En attente";
      case "overdue": return "En retard";
      default: return status;
    }
  };

  const handleStartTask = (task: any) => {
    if (task.courseId) {
      navigate(`/course/${task.courseId}`);
    } else {
      navigate("/course/1");
    }
  };

  return (
    <div className="min-h-screen moov-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Tableau de Bord
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Tâches</h1>
          <p className="text-gray-600">Gérez vos tâches assignées et suivez votre progression</p>
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">Aucune tâche assignée pour le moment</p>
              <p className="text-sm text-gray-400">
                Connectez-vous avec un compte de test pour voir les tâches réalistes
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <CardTitle className="text-xl">{task.title}</CardTitle>
                        <p className="text-gray-600 mt-1">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getPriorityColor(task.priority)} border`}>
                        {task.priority === "high" ? "Haute" : 
                         task.priority === "medium" ? "Moyenne" : "Basse"}
                      </Badge>
                      <Badge variant="outline">
                        {task.category === "mandatory" ? "Obligatoire" :
                         task.category === "professional_development" ? "Développement" : "Spécialisé"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Assigné par: {task.assignedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Échéance: {new Date(task.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Statut: </span>
                      <span className={`font-medium ${
                        task.status === "completed" ? "text-green-600" :
                        task.status === "in-progress" ? "text-blue-600" : 
                        task.status === "overdue" ? "text-red-600" : "text-orange-600"
                      }`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                  </div>
                  
                  {task.status !== "completed" && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progression</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-gray-700">Critères de Réussite:</p>
                    <p className="text-sm text-gray-600">{task.completionCriteria}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {task.status !== "completed" && (
                      <Button 
                        onClick={() => handleStartTask(task)}
                        className="moov-gradient text-white"
                      >
                        {task.status === "pending" ? "Commencer" : "Continuer"}
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => navigate(`/course/${task.id}`)}>
                      Voir Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
