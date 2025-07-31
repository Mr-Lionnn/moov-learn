import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Timer, BarChart3, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { testDataService } from "@/services/testDataService";

interface TaskManagementDropdownProps {
  onNavigate: (path: string) => void;
}

const TaskManagementDropdown = ({ onNavigate }: TaskManagementDropdownProps) => {
  const { user } = useAuth();
  const tasks = user?.id ? testDataService.getTasksForUser(user.id) : [];

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

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Time Limits */}
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-600" />
              Limites de Temps
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-2">
              {tasks.slice(0, 2).map((task) => (
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

        {/* Evaluations */}
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Évaluations
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-2">
              {tasks.filter(task => task.evaluation).slice(0, 2).map((task) => (
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

        {/* Modules Progress */}
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              Modules en Cours
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-2">
              {tasks.filter(task => task.status === "in-progress").slice(0, 2).map((task) => (
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
      
      <div className="mt-3 pt-3 border-t">
        <Button 
          onClick={() => onNavigate("/tasks")} 
          className="w-full h-8 text-xs"
          size="sm"
        >
          Voir Toutes les Tâches
        </Button>
      </div>
    </div>
  );
};

export default TaskManagementDropdown;