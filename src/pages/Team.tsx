import { useState } from "react";
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
import AdminPanel from "@/components/AdminPanel";

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberForProfile, setSelectedMemberForProfile] = useState<any>(null);
  const { user } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: "Marie Martin",
      role: "Technicien Réseau Senior",
      department: "IT Support",
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
      avatar: "/placeholder.svg",
      status: "En ligne",
      currentCourse: "SDN et Virtualisation",
      progress: 78,
      completedCourses: 20,
      totalHours: 234,
      certifications: 6,
      lastActivity: "Il y a 30min",
      expertise: ["SDN", "Virtualisation", "Cloud"]
    }
  ];

  // Filter team members based on user's team (if not admin)
  const getTeamMembers = () => {
    if (user?.role === 'admin' || user?.role === 'team_chief') {
      return teamMembers; // Admins can see all team members
    }
    // For employees and other roles, show all team members for now
    // In production, this would filter by actual department from database
    console.log('Current user:', user);
    console.log('User department:', user?.department);
    console.log('Available team members:', teamMembers.map(m => ({ name: m.name, department: m.department })));
    
    // Temporary: Show all team members to employees since sample data might not match
    // In production: return teamMembers.filter(member => member.department === user?.department);
    return teamMembers;
  };

  // Get team members based on user role and filter them
  const getFilteredMembers = () => {
    const members = getTeamMembers();
    return members.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredMembers = getFilteredMembers();

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

  const teamStats = {
    totalMembers: teamMembers.length,
    onlineMembers: teamMembers.filter(m => m.status === "En ligne").length,
    avgProgress: Math.round(teamMembers.reduce((acc, m) => acc + m.progress, 0) / teamMembers.length),
    totalCertifications: teamMembers.reduce((acc, m) => acc + m.certifications, 0)
  };

  const handleViewProfile = (member: any) => {
    setSelectedMemberForProfile(member);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header onShowAdminPanel={() => setShowAdminPanel(true)} />
      
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {user?.role === 'admin' || user?.role === 'team_chief' ? 'Gestion d\'Équipe' : 'Mon Équipe'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {user?.role === 'admin' || user?.role === 'team_chief' 
                  ? 'Gérez les équipes et suivez les progrès de formation'
                  : 'Consultez les informations de votre équipe'
                }
              </p>
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

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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

      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
};

export default Team;
