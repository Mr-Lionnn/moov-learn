
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import StatsGrid from "@/components/StatsGrid";
import CourseCard from "@/components/CourseCard";
import CourseDetailModal from "@/components/CourseDetailModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Award,
  Target,
  CalendarDays,
  Timer,
  BarChart3,
  Search
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
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log('🔥 Index useEffect triggered, user:', user);
    
    if (user?.id) {
      try {
        console.log('🔥 About to call getCoursesForUser with user ID:', user.id);
        const userCourses = testDataService.getCoursesForUser(user.id);
        const userTasks = testDataService.getTasksForUser(user.id);
        
        console.log('🔥 Loaded courses:', userCourses);
        console.log('🔥 Courses with Formation Moov:', userCourses.filter(c => c.title.includes('Moov')));
        console.log('🔥 Loaded tasks:', userTasks);
        
        const validCourses = userCourses.filter(course => 
          course && 
          course.title && 
          course.id !== undefined
        );
        
        const validTasks = userTasks.filter(task => 
          task && 
          task.title && 
          task.id !== undefined
        );
        
        setCourses(validCourses);
        setTasks(validTasks);
      } catch (error) {
        console.error('Error loading user data:', error);
        setCourses([]);
        setTasks([]);
      }
    } else {
      setCourses([]);
      setTasks([]);
    }
    
    setLoading(false);
  }, [user]);

  const handleCourseClick = (course: any) => {
    if (!course || !course.title) {
      console.error('Invalid course data:', course);
      return;
    }
    
    console.log('🔥 Index.tsx - Course clicked:', course);
    console.log('🔥 Index.tsx - Course ID being used for navigation:', course.id || course.originalId);
    
    const courseWithDetails = {
      ...course,
      students: course.students || 45,
      nextLesson: "Routage Statique",
      estimatedTime: "2 jours"
    };
    setSelectedCourse(courseWithDetails);
  };

  const handleTaskClick = (task: any) => {
    if (!task) {
      console.error('Invalid task data:', task);
      return;
    }
    
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

  if (loading) {
    return (
      <div className="min-h-screen moov-gradient-subtle">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p>Chargement...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen moov-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.name || 'Utilisateur'}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Suivez votre progression et continuez votre apprentissage</p>
        </div>

        <StatsGrid />

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 mt-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher formations, modules, créateurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-center h-12 text-base shadow-sm border-2 focus:border-primary/50"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cours de Formation Disponibles</h2>
              <Button variant="outline" onClick={() => navigate("/my-trainings")}>
                Voir Tous
              </Button>
            </div>
            
            <div className="space-y-4">
              {courses.length > 0 ? (
                courses
                  .filter(course => 
                    !searchQuery || 
                    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((course) => (
                    course && course.id ? (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onClick={() => handleCourseClick(course)}
                      />
                    ) : null
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "Aucun cours trouvé pour cette recherche" : "Aucun cours disponible pour le moment"}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tâches d'Apprentissage</h2>
              <Button variant="outline" onClick={() => navigate("/tasks")}>
                Voir Toutes
              </Button>
            </div>
            
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks
                  .filter(task => 
                    !searchQuery || 
                    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.category?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 4)
                  .map((task) => (
                    task && task.id ? (
                      <Card 
                        key={task.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(task.status)}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-2">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{task.title || 'Tâche sans titre'}</h3>
                                <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
                                  {task.priority === "high" ? "Haute" : 
                                   task.priority === "medium" ? "Moyenne" : "Basse"}
                                </Badge>
                              </div>
                              
                              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{task.description || 'Aucune description disponible'}</p>
                              
                              {task.status !== "completed" && (
                                <div className="space-y-1 mb-3">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>Progression</span>
                                    <span>{task.progress || 0}%</span>
                                  </div>
                                  <Progress value={task.progress || 0} className="h-1.5" />
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                                <div className="flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  <span>Échéance: {task.deadline ? new Date(task.deadline).toLocaleDateString('fr-FR') : 'Non définie'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Timer className="h-3 w-3" />
                                  <span className={getUrgencyLevel(task.deadline).color}>
                                    {getUrgencyLevel(task.deadline).text}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className={`
                                  ${task.status === "completed" ? "text-green-600" :
                                    task.status === "in-progress" ? "text-blue-600" : 
                                    task.status === "overdue" ? "text-red-600" : "text-orange-600"}
                                `}>
                                  {task.category === "mandatory" ? "Obligatoire" : "Optionnel"}
                                </span>
                                {task.evaluation && (
                                  <div className="flex items-center gap-1">
                                    <BarChart3 className="h-3 w-3" />
                                    <span>Note: {task.evaluation}/100</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : null
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "Aucune tâche trouvée pour cette recherche" : "Aucune tâche assignée pour le moment"}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {selectedCourse && (
        <CourseDetailModal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          course={selectedCourse}
        />
      )}

    </div>
  );
};

export default Index;
