
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Filter, UserPlus, Mail, Phone, Shield, Settings, Star, ChevronDown, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import TeamManagementModal from "@/components/TeamManagementModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { useNavigate } from "react-router-dom";

const Employees = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  

  const employees = [
    {
      id: 1,
      name: "Marie Martin",
      email: "marie.martin@moovlearn.com",
      phone: "+33 1 23 45 67 89",
      department: "IT Support",
      position: "Technicien Réseau Senior",
      avatar: "/placeholder.svg",
      enrolledCourses: 5,
      completedCourses: 3,
      totalHours: 45,
      averageScore: 87,
      lastActivity: "Il y a 2 jours",
      status: "Actif",
      teamId: 1,
      teamName: "Équipe Support Alpha",
      teamColor: "#3B82F6"
    },
    {
      id: 2,
      name: "Pierre Durand",
      email: "pierre.durand@moovlearn.com",
      phone: "+33 1 23 45 67 90",
      department: "Infrastructure",
      position: "Ingénieur Système",
      avatar: "/placeholder.svg",
      enrolledCourses: 3,
      completedCourses: 2,
      totalHours: 32,
      averageScore: 92,
      teamId: 2,
      teamName: "Équipe Infrastructure",
      teamColor: "#10B981",
      lastActivity: "Il y a 1 jour",
      status: "Actif"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      email: "sophie.laurent@moovlearn.com",
      phone: "+33 1 23 45 67 91",
      department: "Sécurité",
      position: "Analyste Sécurité",
      avatar: "/placeholder.svg",
      enrolledCourses: 7,
      completedCourses: 4,
      totalHours: 68,
      averageScore: 78,
      lastActivity: "Il y a 3 jours",
      teamId: 3,
      teamName: "Équipe Sécurité",
      teamColor: "#F59E0B",
      status: "Actif"
    },
    {
      id: 4,
      name: "Thomas Moreau",
      email: "thomas.moreau@moovlearn.com",
      phone: "+33 1 23 45 67 92",
      department: "IT Support",
      position: "Technicien Junior",
      avatar: "/placeholder.svg",
      enrolledCourses: 4,
      completedCourses: 1,
      totalHours: 24,
      averageScore: 65,
      lastActivity: "Il y a 1 semaine",
      status: "Inactif",
      teamId: 1,
      teamName: "Équipe Support Alpha",
      teamColor: "#3B82F6"
    },
    {
      id: 5,
      name: "Julie Petit",
      email: "julie.petit@moovlearn.com",
      phone: "+33 1 23 45 67 93",
      department: "Infrastructure",
      position: "Architecte Réseau",
      avatar: "/placeholder.svg",
      enrolledCourses: 6,
      completedCourses: 5,
      totalHours: 85,
      averageScore: 94,
      lastActivity: "Aujourd'hui",
      status: "Actif",
      teamId: 2,
      teamName: "Équipe Infrastructure",
      teamColor: "#10B981"
    }
  ];

  const departments = ["all", "IT Support", "Infrastructure", "Sécurité"];
  const teams = ["all", "Équipe Support Alpha", "Équipe Infrastructure", "Équipe Sécurité"];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesTeam = teamFilter === "all" || employee.teamName === teamFilter;
    return matchesSearch && matchesDepartment && matchesTeam;
  });

  const getDepartmentStats = () => {
    const stats = {
      total: employees.length,
      active: employees.filter(e => e.status === "Actif").length,
      averageCompletion: Math.round(employees.reduce((acc, e) => acc + (e.completedCourses / e.enrolledCourses * 100), 0) / employees.length),
      totalHours: employees.reduce((acc, e) => acc + e.totalHours, 0)
    };
    return stats;
  };

  const stats = getDepartmentStats();

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
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Employés</h1>
              <p className="text-gray-600">Suivez les progrès et gérez l'équipe de formation</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowTeamManagement(true)}>
                <Users className="h-4 w-4 mr-2" />
                Gérer Équipes
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter Employé
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Total Employés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-xs text-gray-600">Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageCompletion}%</p>
                  <p className="text-xs text-gray-600">Taux Moyen</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
                  <p className="text-xs text-gray-600">Total Heures</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher employés..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium py-2">Département:</span>
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={departmentFilter === dept ? "default" : "outline"}
                  onClick={() => setDepartmentFilter(dept)}
                  size="sm"
                >
                  {dept === "all" ? "Tous" : dept}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium py-2">Équipe:</span>
              {teams.map((team) => (
                <Button
                  key={team}
                  variant={teamFilter === team ? "default" : "outline"}
                  onClick={() => setTeamFilter(team)}
                  size="sm"
                >
                  {team === "all" ? "Toutes" : team}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Employee Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{employee.name}</CardTitle>
                    <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={employee.status === "Actif" ? "default" : "secondary"}>
                        {employee.status}
                      </Badge>
                      {employee.teamName && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: employee.teamColor,
                            color: employee.teamColor 
                          }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: employee.teamColor }}
                          />
                          {employee.teamName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progression</span>
                    <span className="text-sm font-medium">
                      {employee.completedCourses}/{employee.enrolledCourses} formations
                    </span>
                  </div>
                  <Progress 
                    value={(employee.completedCourses / employee.enrolledCourses) * 100} 
                    className="h-2" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Heures totales</p>
                    <p className="font-medium">{employee.totalHours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Score moyen</p>
                    <p className="font-medium">{employee.averageScore}%</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Dernière activité: {employee.lastActivity}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">Voir Détails</Button>
                  <Button variant="outline" size="sm">Contacter</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun employé trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </main>

      <TeamManagementModal
        isOpen={showTeamManagement}
        onClose={() => setShowTeamManagement(false)}
      />

    </div>
  );
};

export default Employees;
