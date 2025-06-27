import { useState, useEffect } from "react";
import Header from "@/components/Header";
import StatsGrid from "@/components/StatsGrid";
import CourseCard from "@/components/CourseCard";
import CourseDetailModal from "@/components/CourseDetailModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Award,
  Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { testDataService } from "@/services/testDataService";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      const userCourses = testDataService.getCoursesForUser(user.id);
      const userTasks = testDataService.getTasksForUser(user.id);
      setCourses(userCourses);
      setTasks(userTasks);
    }
  }, [user]);

  const handleCourseClick = (course: any) => {
    const courseWithDetails = {
      ...course,
      students: 45,
      nextLesson: "Routage Statique",
      estimatedTime: "2 jours"
    };
    setSelectedCourse(courseWithDetails);
  };

  const handleTaskClick = (task: any) => {
    if (task.courseId) {
      navigate(`/course/${task.courseId}`);
    } else {
      navigate("/course/1");
    }
  };

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
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "overdue": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen moov-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.name}!
          </h1>
          <p className="text-gray-600">Suivez votre progression et continuez votre apprentissage</p>
        </div>

        <StatsGrid />

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Cours de Formation Disponibles</h2>
              <Button variant="outline" onClick={() => navigate("/my-trainings")}>
                Voir Tous
              </Button>
            </div>
            
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tâches d'Apprentissage</h2>
              <Button variant="outline" onClick={() => navigate("/tasks")}>
                Voir Toutes
              </Button>
            </div>
            
            <div className="space-y-4">
              {tasks.slice(0, 4).map((task) => (
                <Card 
                  key={task.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
                          <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
                            {task.priority === "high" ? "Haute" : 
                             task.priority === "medium" ? "Moyenne" : "Basse"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        
                        {task.status !== "completed" && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Progression</span>
                              <span>{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-1.5" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>Échéance: {new Date(task.deadline).toLocaleDateString('fr-FR')}</span>
                          <span className={`
                            ${task.status === "completed" ? "text-green-600" :
                              task.status === "in-progress" ? "text-blue-600" : 
                              task.status === "overdue" ? "text-red-600" : "text-orange-600"}
                          `}>
                            {task.category === "mandatory" ? "Obligatoire" : "Optionnel"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <CourseDetailModal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        course={selectedCourse}
      />
    </div>
  );
};

export default Index;
