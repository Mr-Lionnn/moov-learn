
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Play, CheckCircle, Filter } from "lucide-react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

const MyTrainings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const myTrainings = [
    {
      id: 1,
      title: "Fondamentaux des Réseaux TCP/IP",
      instructor: "Marie Dubois",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      timeSpent: "18h 30m",
      lastAccessed: "Il y a 2 jours",
      status: "En cours",
      certificate: null,
      category: "Réseaux"
    },
    {
      id: 2,
      title: "Configuration des Switches Cisco",
      instructor: "Pierre Martin",
      progress: 100,
      totalLessons: 15,
      completedLessons: 15,
      timeSpent: "24h 15m",
      lastAccessed: "Il y a 1 semaine",
      status: "Terminé",
      certificate: "CISCO-SW-2024",
      category: "Infrastructure"
    },
    {
      id: 3,
      title: "Sécurité Réseau Avancée",
      instructor: "Sophie Laurent",
      progress: 45,
      totalLessons: 20,
      completedLessons: 9,
      timeSpent: "12h 45m",
      lastAccessed: "Hier",
      status: "En cours",
      certificate: null,
      category: "Sécurité"
    },
    {
      id: 4,
      title: "Routage et Commutation",
      instructor: "Jean Dupuis",
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      timeSpent: "8h 20m",
      lastAccessed: "Il y a 3 jours",
      status: "En cours",
      certificate: null,
      category: "Réseaux"
    }
  ];

  const filteredTrainings = myTrainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "completed" && training.status === "Terminé") ||
                         (filterStatus === "in-progress" && training.status === "En cours");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Formations</h1>
          <p className="text-gray-600">Suivez votre progression et continuez votre apprentissage</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Rechercher dans mes formations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
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
              variant={filterStatus === "in-progress" ? "default" : "outline"}
              onClick={() => setFilterStatus("in-progress")}
              size="sm"
            >
              En cours
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              onClick={() => setFilterStatus("completed")}
              size="sm"
            >
              Terminées
            </Button>
          </div>
        </div>

        {/* Training Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrainings.map((training) => (
            <Card key={training.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={training.status === "Terminé" ? "default" : "secondary"}>
                    {training.category}
                  </Badge>
                  {training.certificate && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Certifié
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">{training.title}</CardTitle>
                <p className="text-sm text-gray-600">Par {training.instructor}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{training.progress}%</span>
                  </div>
                  <Progress value={training.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{training.completedLessons}/{training.totalLessons} modules</span>
                    <span>{training.timeSpent}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{training.lastAccessed}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1"
                    onClick={() => navigate(`/course/${training.id}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {training.status === "Terminé" ? "Revoir" : "Continuer"}
                  </Button>
                  {training.certificate && (
                    <Button variant="outline" size="sm">
                      Certificat
                    </Button>
                  )}
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
