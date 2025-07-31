import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, User, Timer, BarChart3, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { testDataService } from "@/services/testDataService";

const TaskManagementTab = () => {
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

  const getUrgencyLevel = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { level: "overdue", color: "text-red-600", text: "En retard" };
    if (diffDays <= 1) return { level: "urgent", color: "text-red-600", text: "Urgent" };
    if (diffDays <= 3) return { level: "soon", color: "text-orange-600", text: "Bientôt" };
    return { level: "normal", color: "text-green-600", text: "Dans les temps" };
  };

  const handleStartTask = (task: any) => {
    if (task.courseId) {
      navigate(`/course/${task.courseId}`);
    } else {
      navigate("/course/1");
    }
  };

  return (
    <div className="space-y-6">
      {/* Task Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Limits Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-600" />
              Limites de Temps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.slice(0, 3).map((task) => (
                task && task.deadline ? (
                  <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <span className="font-medium truncate max-w-32">{task.title}</span>
                    <span className={`${getUrgencyLevel(task.deadline).color}`}>
                      {Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}j
                    </span>
                  </div>
                ) : null
              ))}
              {tasks.filter(task => task.deadline).length === 0 && (
                <p className="text-xs text-gray-500 text-center">Aucun délai</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Evaluations Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Évaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.filter(task => task.evaluation).slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <span className="font-medium truncate max-w-32">{task.title}</span>
                  <Badge variant={task.evaluation >= 70 ? "default" : "destructive"} className="text-xs h-5">
                    {task.evaluation}/100
                  </Badge>
                </div>
              ))}
              {tasks.filter(task => task.evaluation).length === 0 && (
                <p className="text-xs text-gray-500 text-center">Aucune évaluation</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modules Progress Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              Modules en Cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.filter(task => task.status === "in-progress").slice(0, 3).map((task) => (
                <div key={task.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium truncate max-w-32">{task.title}</span>
                    <span className="text-gray-500">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress || 0} className="h-1" />
                </div>
              ))}
              {tasks.filter(task => task.status === "in-progress").length === 0 && (
                <p className="text-xs text-gray-500 text-center">Aucun module en cours</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Task List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Toutes les Tâches</h3>
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
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
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
      </div>
    </div>
  );
};

export default TaskManagementTab;