
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Users, Award, Search, Play, CheckCircle, Star, Filter, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import FormationSwiper from "@/components/FormationSwiper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { testDataService } from "@/services/testDataService";


const MyTrainings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 MyTrainings - Loading courses for user:', user?.id);
    
    if (user?.id) {
      try {
        const userCourses = testDataService.getCoursesForUser(user.id);
        console.log('🔥 MyTrainings - Loaded courses:', userCourses);
        
        // Transform courses to match training format with proper status mapping
        const transformedTrainings = userCourses.map((course, index) => {
          const randomProgress = Math.floor(Math.random() * 101);
          const getRandomStatus = () => {
            if (randomProgress === 100) return "Terminée";
            if (randomProgress > 0) return "En cours";
            return "Non commencée";
          };
          
          return {
            id: course.id,
            title: course.title,
            instructor: course.instructor || "Instructeur Expert",
            duration: course.duration || "2h 00min",
            progress: randomProgress,
            status: getRandomStatus(),
            rating: course.rating || 4.5,
            studentsCount: course.students || 45,
            image: course.image || "/placeholder.svg",
            category: course.category || "Formation",
            level: course.level || "Intermédiaire",
            completedLessons: Math.floor((randomProgress / 100) * 8),
            totalLessons: 8,
            nextLesson: randomProgress < 100 ? "Prochaine leçon" : null,
            estimatedCompletion: randomProgress < 100 ? "2-3 jours" : null,
            completedDate: randomProgress === 100 ? "Il y a 1 semaine" : null,
            certificate: randomProgress === 100,
            description: course.description
          };
        });
        
        setTrainings(transformedTrainings);
        console.log('🔥 MyTrainings - Transformed trainings:', transformedTrainings);
      } catch (error) {
        console.error('❌ MyTrainings - Error loading courses:', error);
        setTrainings([]);
      }
    }
    
    setLoading(false);
  }, [user]);

  // Remove the hardcoded training data below and replace with dynamic data above

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         training.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || training.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminée":
        return "bg-green-100 text-green-800";
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "Non commencée":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleContinueCourse = (trainingId: string | number) => {
    navigate(`/course/${trainingId}`);
  };

  const handleStartCourse = (trainingId: string | number) => {
    navigate(`/course/${trainingId}`);
  };

  const handleReviewCourse = (trainingId: string | number) => {
    navigate(`/course/${trainingId}`);
  };

  const handleViewCertificate = (trainingId: number) => {
    navigate('/certifications');
  };

  const handleDownloadCertificate = (trainingTitle: string) => {
    // Simulate certificate download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Certificate of Completion\n\n' + trainingTitle + '\n\nAwarded to: Student\nDate: ' + new Date().toLocaleDateString();
    link.download = `certificate-${trainingTitle.replace(/\s+/g, '-').toLowerCase()}.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`Certificate downloaded for: ${trainingTitle}`);
  };

  const stats = {
    total: trainings.length,
    completed: trainings.filter(t => t.status === "Terminée").length,
    inProgress: trainings.filter(t => t.status === "En cours").length,
    totalHours: trainings.reduce((acc, t) => acc + parseInt(t.duration), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Chargement des formations...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Tableau de Bord
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Formations</h1>
          <p className="text-gray-600">Suivez vos progrès et continuez votre apprentissage</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-xs text-gray-600">Terminées</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Play className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-xs text-gray-600">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher formations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              Toutes
            </Button>
            <Button
              variant={filterStatus === "cours" ? "default" : "outline"}
              onClick={() => setFilterStatus("cours")}
              size="sm"
            >
              En cours
            </Button>
            <Button
              variant={filterStatus === "terminée" ? "default" : "outline"}
              onClick={() => setFilterStatus("terminée")}
              size="sm"
            >
              Terminées
            </Button>
          </div>
        </div>

        {/* Formation Swiper */}
        {filteredTrainings.length > 0 ? (
          <FormationSwiper trainings={filteredTrainings} />
        ) : null}

        {filteredTrainings.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune formation trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </main>

    </div>
  );
};

export default MyTrainings;
