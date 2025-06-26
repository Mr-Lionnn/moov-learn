
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
      title: "Fondamentaux des Réseaux TCP/IP",
      instructor: "Marie Dubois - Ingénieur Réseau Senior",
      duration: "8 heures",
      students: 45,
      rating: 4.9,
      progress: 75,
      image: "/placeholder.svg",
      category: "Réseaux",
      level: "Débutant"
    },
    {
      id: 2,
      title: "Configuration des Switches Cisco",
      instructor: "Pierre Martin - Expert Cisco",
      duration: "12 heures",
      students: 32,
      rating: 4.8,
      progress: 40,
      image: "/placeholder.svg",
      category: "Infrastructure",
      level: "Intermédiaire"
    },
    {
      id: 3,
      title: "Sécurité Réseau et Pare-feu",
      instructor: "Sophie Laurent - Spécialiste Sécurité",
      duration: "15 heures",
      students: 28,
      rating: 4.9,
      progress: 0,
      image: "/placeholder.svg",
      category: "Sécurité",
      level: "Avancé"
    }
  ];

  const recentAchievements = [
    { title: "Certification Obtenue", description: "Cisco CCNA Routing & Switching", date: "Il y a 2 jours", icon: Award },
    { title: "Score Parfait", description: "100% au Quiz Protocoles Réseau", date: "Il y a 1 semaine", icon: CheckCircle },
    { title: "Formation Terminée", description: "Sécurité des Réseaux Sans Fil", date: "Il y a 3 jours", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header onShowAdminPanel={() => setShowAdminPanel(true)} />
      
      {showAdminPanel && userRole === "admin" && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
      
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {userRole === "admin" ? "Tableau de Bord Administrateur" : "Bienvenue, Jean !"}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {userRole === "admin" 
                  ? "Gérez les formations réseau et suivez les progrès de l'équipe" 
                  : "Continuez votre formation en technologies réseau"}
              </p>
            </div>
          </div>
          
          <StatsGrid userRole={userRole} />
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher formations, protocoles, équipements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Continue Learning / Course Management */}
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {userRole === "admin" ? "Gestion des Formations" : "Poursuivre ma Formation"}
                </h2>
                {userRole === "admin" && (
                  <Button onClick={() => setShowAdminPanel(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Formation
                  </Button>
                )}
              </div>
              <div className="space-y-4 sm:space-y-6">
                {featuredCourses.filter(course => userRole === "admin" || course.progress > 0).map((course) => (
                  <CourseCard key={course.id} course={course} userRole={userRole} />
                ))}
              </div>
            </section>

            {/* Recommended Courses */}
            {userRole === "student" && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Formations Recommandées</h2>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {featuredCourses.filter(course => course.progress === 0).map((course) => (
                    <CourseCard key={course.id} course={course} userRole={userRole} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Achievements / Team Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-yellow-500" />
                  {userRole === "admin" ? "Progrès de l'Équipe" : "Réussites Récentes"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userRole === "admin" ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Employés Actifs</span>
                      <Badge>145</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Formations Terminées</span>
                      <Badge className="bg-green-100 text-green-800">287</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taux de Réussite</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                ) : (
                  recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                        <achievement.icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 break-words">{achievement.description}</p>
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
                <CardTitle className="text-lg">
                  {userRole === "admin" ? "Statistiques Hebdomadaires" : "Objectif Mensuel"}
                </CardTitle>
                <CardDescription className="text-sm">
                  {userRole === "admin" 
                    ? "Activité de formation cette semaine" 
                    : "Terminer 3 modules ce mois"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {userRole === "admin" ? "Engagement" : "Progrès"}
                    </span>
                    <span>
                      {userRole === "admin" ? "92%" : "2/3 modules"}
                    </span>
                  </div>
                  <Progress value={userRole === "admin" ? 92 : 67} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {userRole === "admin" 
                      ? "Excellent engagement de l'équipe !" 
                      : "Plus qu'un module pour atteindre votre objectif !"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {userRole === "admin" ? "Statistiques Plateforme" : "Mes Statistiques"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    {userRole === "admin" ? "Total Formations" : "Formations Actives"}
                  </span>
                  <Badge variant="secondary">{userRole === "admin" ? "28" : "8"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    {userRole === "admin" ? "Employés Inscrits" : "Terminées"}
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {userRole === "admin" ? "145" : "12"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Certifications</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {userRole === "admin" ? "287" : "3"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    {userRole === "admin" ? "Temps Total Équipe" : "Temps de Formation"}
                  </span>
                  <span className="text-sm font-medium">
                    {userRole === "admin" ? "1,250 heures" : "32,5 heures"}
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
