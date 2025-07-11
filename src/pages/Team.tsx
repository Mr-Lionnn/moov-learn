
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Search, Calendar, Award, BookOpen, Clock, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import UserProfileModal from "@/components/UserProfileModal";
import { useAuth } from "@/contexts/AuthContext";

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberForProfile, setSelectedMemberForProfile] = useState<any>(null);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const { user } = useAuth();

  const allTeamMembers = [
    {
      id: 1,
      name: "Marie Martin",
      role: "Technicien Réseau Senior",
      department: "IT Support",
      teamId: 1,
      avatar: "/placeholder.svg",
      status: "En ligne",
      currentCourse: "Configuration VLAN",
      progress: 85,
      completedCourses: 12,
      totalHours: 145,
      certifications: 3,
      lastActivity: "Il y a 2h",
      expertise: ["Cisco", "TCP/IP", "Sécurité"]
    },
    {
      id: 2,
      name: "Pierre Durand",
      role: "Ingénieur Système",
      department: "Infrastructure",
      teamId: 2,
      avatar: "/placeholder.svg",
      status: "Occupé",
      currentCourse: "Routage OSPF",
      progress: 45,
      completedCourses: 8,
      totalHours: 98,
      certifications: 2,
      lastActivity: "Il y a 1h",
      expertise: ["Routage", "Switching", "MPLS"]
    },
    {
      id: 3,
      name: "Sophie Laurent",
      role: "Analyste Sécurité",
      department: "Sécurité",
      teamId: 3,
      avatar: "/placeholder.svg",
      status: "En ligne",
      currentCourse: "Pare-feu Next-Gen",
      progress: 92,
      completedCourses: 15,
      totalHours: 187,
      certifications: 4,
      lastActivity: "Maintenant",
      expertise: ["Firewall", "IDS/IPS", "VPN"]
    },
    {
      id: 4,
      name: "Thomas Moreau",
      role: "Technicien Junior",
      department: "IT Support",
      teamId: 1,
      avatar: "/placeholder.svg",
      status: "Absent",
      currentCourse: "Fondamentaux TCP/IP",
      progress: 30,
      completedCourses: 3,
      totalHours: 45,
      certifications: 1,
      lastActivity: "Il y a 1 jour",
      expertise: ["Support", "Dépannage"]
    },
    {
      id: 5,
      name: "Julie Petit",
      role: "Architecte Réseau",
      department: "Infrastructure",
      teamId: 2,
      avatar: "/placeholder.svg",
      status: "En ligne",
      currentCourse: "SDN et Virtualisation",
      progress: 78,
      completedCourses: 20,
      totalHours: 234,
      certifications: 6,
      lastActivity: "Il y a 30min",
      expertise: ["SDN", "Virtualisation", "Cloud"]
    },
    {
      id: 6,
      name: "Antoine Bernard",
      role: "Chef d'Équipe IT",
      department: "IT Support",
      teamId: 1,
      avatar: "/placeholder.svg",
      status: "En ligne",
      currentCourse: "Gestion d'Équipe",
      progress: 60,
      completedCourses: 18,
      totalHours: 210,
      certifications: 5,
      lastActivity: "Il y a 1h",
      expertise: ["Management", "Support", "Formation"]
    }
  ];

  // Filter team members based on user's role and permissions
  const getVisibleMembers = () => {
    if (!user) return [];

    // Admin and team chiefs can see everyone
    if (user.role === 'admin' || user.role === 'team_chief') {
      return allTeamMembers;
    }

    // Team responsible can see their team members
    if (user.role === 'team_responsible') {
      return allTeamMembers.filter(member => 
        member.department === user.department || member.teamId === user.teamId
      );
    }

    // Regular team members can see their own team
    return allTeamMembers.filter(member => 
      member.department === user.department || 
      member.teamId === user.teamId ||
      member.id === user.id
    );
  };

  // Filter members based on search query
  const applySearchFilter = (members: any[]) => {
    if (!searchQuery.trim()) return members;
    
    return members.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.expertise.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  useEffect(() => {
    const visibleMembers = getVisibleMembers();
    const searchFiltered = applySearchFilter(visibleMembers);
    setFilteredMembers(searchFiltered);
  }, [user, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En ligne":
        return "bg-green-500";
      case "Occupé":
        return "bg-yellow-500";
      case "Absent":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const visibleMembers = getVisibleMembers();
  const teamStats = {
    totalMembers: visibleMembers.length,
    onlineMembers: visibleMembers.filter(m => m.status === "En ligne").length,
    avgProgress: visibleMembers.length > 0 
      ? Math.round(visibleMembers.reduce((acc, m) => acc + m.progress, 0) / visibleMembers.length)
      : 0,
    totalCertifications: visibleMembers.reduce((acc, m) => acc + m.certifications, 0)
  };

  const handleViewProfile = (member: any) => {
    setSelectedMemberForProfile(member);
  };

  const getPageTitle = () => {
    if (user?.role === 'admin' || user?.role === 'team_chief') {
      return 'Gestion d\'Équipe';
    }
    return 'Mon Équipe';
  };

  const getPageDescription = () => {
    if (user?.role === 'admin' || user?.role === 'team_chief') {
      return 'Gérez les équipes et suivez les progrès de formation';
    }
    return 'Consultez les informations de votre équipe';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {getPageDescription()}
              </p>
              {filteredMembers.length === 0 && searchQuery && (
                <p className="text-sm text-orange-600 mt-2">
                  Aucun membre trouvé pour "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
                  <p className="text-xs text-gray-600">Membres</p>
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
                  <p className="text-2xl font-bold text-gray-900">{teamStats.onlineMembers}</p>
                  <p className="text-xs text-gray-600">En ligne</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.avgProgress}%</p>
                  <p className="text-xs text-gray-600">Progrès Moyen</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{teamStats.totalCertifications}</p>
                  <p className="text-xs text-gray-600">Certifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher membres, compétences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Team Members */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600 truncate">{member.role}</p>
                    <Badge variant="outline" className="mt-1">
                      {member.department}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Course */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{member.currentCourse}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-medium">{member.progress}%</span>
                  </div>
                  <Progress value={member.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Formations</p>
                    <p className="font-bold text-lg">{member.completedCourses}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Heures</p>
                    <p className="font-bold text-lg">{member.totalHours}h</p>
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(member)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Voir Profil
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Dernière activité: {member.lastActivity}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {user?.role === 'admin' || user?.role === 'team_chief' 
                ? 'Aucune équipe configurée' 
                : 'Aucun membre d\'équipe visible'
              }
            </h3>
            <p className="text-gray-600">
              {user?.role === 'admin' || user?.role === 'team_chief' 
                ? 'Configurez des équipes pour voir les membres'
                : 'Contactez votre administrateur pour accéder aux informations d\'équipe'
              }
            </p>
          </div>
        )}

        {filteredMembers.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </main>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={!!selectedMemberForProfile}
        onClose={() => setSelectedMemberForProfile(null)}
        member={selectedMemberForProfile}
      />
    </div>
  );
};

export default Team;
