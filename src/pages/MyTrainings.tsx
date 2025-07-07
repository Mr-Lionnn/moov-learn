
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Users, Award, Search, Play, CheckCircle, Star, Filter } from "lucide-react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

const MyTrainings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const trainings = [
    {
      id: 1,
      title: "Fondamentaux des Réseaux TCP/IP",
      instructor: "Marie Dubois",
      duration: "8 heures",
      progress: 75,
      status: "En cours",
      rating: 4.9,
      studentsCount: 45,
      image: "/placeholder.svg",
      category: "Réseaux",
      level: "Débutant",
      completedLessons: 6,
      totalLessons: 8,
      nextLesson: "Routage Statique",
      estimatedCompletion: "2 jours"
    },
    {
      id: 2,
      title: "Configuration des Switches Cisco",
      instructor: "Pierre Martin",
      duration: "12 heures",
      progress: 40,
      status: "En cours",
      rating: 4.8,
      studentsCount: 32,
      image: "/placeholder.svg",
      category: "Infrastructure",
      level: "Intermédiaire",
      completedLessons: 4,
      totalLessons: 10,
      nextLesson: "VLAN Configuration",
      estimatedCompletion: "5 jours"
    },
    {
      id: 3,
      title: "Sécurité Réseau et Pare-feu",
      instructor: "Sophie Laurent",
      duration: "15 heures",
      progress: 100,
      status: "Terminée",
      rating: 4.9,
      studentsCount: 28,
      image: "/placeholder.svg",
      category: "Sécurité",
      level: "Avancé",
      completedLessons: 12,
      totalLessons: 12,
      nextLesson: null,
      estimatedCompletion: null,
      completedDate: "Il y a 1 semaine",
      certificate: true
    },
    {
      id: 4,
      title: "Protocoles de Routage Dynamique",
      instructor: "Thomas Durand",
      duration: "10 heures",
      progress: 0,
      status: "Non commencée",
      rating: 4.7,
      studentsCount: 38,
      image: "/placeholder.svg",
      category: "Réseaux",
      level: "Intermédiaire",
      completedLessons: 0,
      totalLessons: 8,
      nextLesson: "Introduction aux Protocoles",
      estimatedCompletion: "4 jours"
    }
  ];

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

  const handleContinueCourse = (trainingId: number) => {
    navigate(`/course/${trainingId}`);
  };

  const handleStartCourse = (trainingId: number) => {
    navigate(`/course/${trainingId}`);
  };

  const handleReviewCourse = (trainingId: number) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
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

        {/* Training Cards */}
        <div className="grid gap-6">
          {filteredTrainings.map((training) => (
            <Card key={training.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Course Image */}
                  <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-12 w-12 text-blue-600" />
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{training.title}</h3>
                        <p className="text-gray-600 mb-2">Par {training.instructor}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {training.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {training.studentsCount} étudiants
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {training.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(training.status)}>
                          {training.status}
                        </Badge>
                        <Badge variant="outline">{training.level}</Badge>
                      </div>
                    </div>

                    {/* Progress Section */}
                    {training.status !== "Non commencée" && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium">
                            {training.completedLessons}/{training.totalLessons} leçons • {training.progress}%
                          </span>
                        </div>
                        <Progress value={training.progress} className="h-2" />
                      </div>
                    )}

                    {/* Next Steps */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-sm">
                        {training.status === "Terminée" ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Terminée {training.completedDate}</span>
                            {training.certificate && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Award className="h-3 w-3 mr-1" />
                                Certificat
                              </Badge>
                            )}
                          </div>
                        ) : training.status === "En cours" ? (
                          <div>
                            <p className="text-gray-600">
                              Prochaine leçon: <span className="font-medium">{training.nextLesson}</span>
                            </p>
                            <p className="text-gray-500">
                              Temps estimé pour terminer: {training.estimatedCompletion}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600">
                              Commencer par: <span className="font-medium">{training.nextLesson}</span>
                            </p>
                            <p className="text-gray-500">
                              Temps estimé: {training.estimatedCompletion}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {training.status === "Terminée" ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleReviewCourse(training.id)}>
                              Revoir
                            </Button>
                            {training.certificate && (
                              <Button size="sm" onClick={() => handleDownloadCertificate(training.title)}>
                                <Award className="h-4 w-4 mr-2" />
                                Certificat
                              </Button>
                            )}
                          </>
                        ) : training.status === "En cours" ? (
                          <Button size="sm" onClick={() => handleContinueCourse(training.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Continuer
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleStartCourse(training.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Commencer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
