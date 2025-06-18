
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Clock, Users, Award, Search, Play, CheckCircle, TrendingUp, Plus, Settings } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import Header from "@/components/Header";
import StatsGrid from "@/components/StatsGrid";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole] = useState<"student" | "admin">("admin"); // For demo, set as admin
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const featuredCourses = [
    {
      id: 1,
      title: "Introduction au Développement Web",
      instructor: "Sarah Johnson",
      duration: "12 heures",
      students: 1250,
      rating: 4.8,
      progress: 65,
      image: "/placeholder.svg",
      category: "Technologie",
      level: "Débutant"
    },
    {
      id: 2,
      title: "Fondamentaux du Marketing Digital",
      instructor: "Mike Chen",
      duration: "8 heures",
      students: 890,
      rating: 4.9,
      progress: 30,
      image: "/placeholder.svg",
      category: "Marketing",
      level: "Intermédiaire"
    },
    {
      id: 3,
      title: "Science des Données avec Python",
      instructor: "Dr. Emily Rodriguez",
      duration: "15 heures",
      students: 2100,
      rating: 4.7,
      progress: 0,
      image: "/placeholder.svg",
      category: "Science des Données",
      level: "Avancé"
    }
  ];

  const recentAchievements = [
    { title: "Cours Terminé", description: "Terminé les Bases du Développement Web", date: "Il y a 2 jours", icon: Award },
    { title: "Score Parfait", description: "100% au Quiz JavaScript", date: "Il y a 1 semaine", icon: CheckCircle },
    { title: "Série d'Apprentissage", description: "7 jours d'apprentissage continu", date: "Aujourd'hui", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header userRole={userRole} onShowAdminPanel={() => setShowAdminPanel(true)} />
      
      {showAdminPanel && userRole === "admin" && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userRole === "admin" ? "Panneau d'Administration" : "Bon retour, Jean !"}
              </h1>
              <p className="text-gray-600">
                {userRole === "admin" 
                  ? "Gérez vos cours et suivez les progrès des étudiants" 
                  : "Prêt à continuer votre parcours d'apprentissage ?"}
              </p>
            </div>
          </div>
          
          <StatsGrid userRole={userRole} />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des cours, sujets ou instructeurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning / Course Management */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userRole === "admin" ? "Gestion des Cours" : "Continuer l'Apprentissage"}
                </h2>
                {userRole === "admin" && (
                  <Button onClick={() => setShowAdminPanel(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Cours
                  </Button>
                )}
              </div>
              <div className="grid gap-6">
                {featuredCourses.filter(course => userRole === "admin" || course.progress > 0).map((course) => (
                  <CourseCard key={course.id} course={course} userRole={userRole} />
                ))}
              </div>
            </section>

            {/* Recommended Courses */}
            {userRole === "student" && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Recommandé pour Vous</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredCourses.filter(course => course.progress === 0).map((course) => (
                    <CourseCard key={course.id} course={course} userRole={userRole} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements / Student Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  {userRole === "admin" ? "Progrès des Étudiants" : "Réussites Récentes"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userRole === "admin" ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Étudiants Actifs</span>
                      <Badge>1,250</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cours Terminés</span>
                      <Badge className="bg-green-100 text-green-800">890</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taux de Réussite</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                ) : (
                  recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <achievement.icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <span className="text-xs text-gray-400">{achievement.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Learning Goal / Admin Stats */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {userRole === "admin" ? "Statistiques Hebdomadaires" : "Objectif Hebdomadaire"}
                </CardTitle>
                <CardDescription>
                  {userRole === "admin" 
                    ? "Activité de la plateforme cette semaine" 
                    : "Terminer 5 leçons cette semaine"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {userRole === "admin" ? "Engagement" : "Progrès"}
                    </span>
                    <span>
                      {userRole === "admin" ? "85%" : "3/5 leçons"}
                    </span>
                  </div>
                  <Progress value={userRole === "admin" ? 85 : 60} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {userRole === "admin" 
                      ? "Excellent engagement cette semaine !" 
                      : "Encore 2 leçons pour atteindre votre objectif !"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {userRole === "admin" ? "Statistiques de la Plateforme" : "Vos Statistiques d'Apprentissage"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {userRole === "admin" ? "Total Cours" : "Total Cours"}
                  </span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {userRole === "admin" ? "Étudiants Inscrits" : "Terminés"}
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {userRole === "admin" ? "1,250" : "8"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Certificats</span>
                  <Badge className="bg-blue-100 text-blue-800">5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {userRole === "admin" ? "Temps Total Plateforme" : "Temps d'Apprentissage"}
                  </span>
                  <span className="text-sm font-medium">
                    {userRole === "admin" ? "2,450 heures" : "24,5 heures"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
