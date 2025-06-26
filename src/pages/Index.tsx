import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  Search,
  Zap,
  Play,
  BookOpen,
  Award,
  FileText,
  Star,
  Clock,
  ChevronRight,
  CheckCircle,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StatsGrid from "@/components/StatsGrid";
import NotificationCenter from "@/components/NotificationCenter";
import AdminPanel from "@/components/AdminPanel";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, convertRole, getRoleDisplayName } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(5);

  useEffect(() => {
    // Simulate fetching unread notifications count from an API
    // In a real application, this would be an API call
    setTimeout(() => {
      setUnreadCount(3); // Example: set unread count to 3 after fetching
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen moov-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="moov-gradient rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Bienvenue, {user?.name || 'Utilisateur'} !
              </h1>
              <p className="text-blue-100 mb-4 md:mb-0">
                {getRoleDisplayName(convertRole(user?.role))} - Continuez votre apprentissage
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowNotifications(true)}
                className="relative bg-white text-primary hover:bg-gray-100"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs min-w-[1.25rem] h-5">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid userRole={convertRole(user?.role)} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-primary"
                onClick={() => navigate("/course/1")}
              >
                <Play className="h-6 w-6 text-primary" />
                <span className="text-sm">Nouvelle Formation</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-secondary"
                onClick={() => navigate("/my-trainings")}
              >
                <BookOpen className="h-6 w-6 text-secondary" />
                <span className="text-sm">Mes Formations</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-500"
              >
                <Award className="h-6 w-6 text-green-600" />
                <span className="text-sm">Certifications</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-500"
                onClick={() => navigate("/files")}
              >
                <FileText className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Fichiers</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Course Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Formations Recommandées
              </span>
              <Button variant="ghost" size="sm">
                Voir tout
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Fondamentaux des Réseaux TCP/IP",
                  description: "Apprenez les bases des protocoles réseau",
                  duration: "4h 30min",
                  level: "Débutant",
                  progress: 65,
                  image: "bg-gradient-to-br from-blue-500 to-blue-600"
                },
                {
                  title: "Sécurité Informatique Avancée",
                  description: "Techniques de protection et cybersécurité",
                  duration: "6h 15min",
                  level: "Avancé",
                  progress: 0,
                  image: "bg-gradient-to-br from-red-500 to-red-600"
                },
                {
                  title: "Administration Système Linux",
                  description: "Maîtrisez l'administration des serveurs Linux",
                  duration: "8h 45min",
                  level: "Intermédiaire",
                  progress: 25,
                  image: "bg-gradient-to-br from-green-500 to-green-600"
                }
              ].map((course, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate("/course/1")}
                >
                  <div className={`h-32 ${course.image} rounded-t-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all" />
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-white text-gray-800">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                    </div>
                    {course.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progression</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Formation terminée",
                  details: "Introduction aux Bases de Données",
                  time: "Il y a 2 heures",
                  icon: CheckCircle,
                  color: "text-green-600"
                },
                {
                  action: "Nouveau badge obtenu",
                  details: "Expert en Sécurité Réseau",
                  time: "Hier",
                  icon: Award,
                  color: "text-yellow-600"
                },
                {
                  action: "Quiz complété",
                  details: "Protocoles TCP/IP - Score: 87%",
                  time: "Il y a 3 jours",
                  icon: Target,
                  color: "text-blue-600"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Panel Button */}
        {(user?.role === 'admin' || user?.role === 'team_chief') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Administration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowAdminPanel(true)} className="w-full">
                Ouvrir le Panneau d'Administration
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
};

export default Index;
