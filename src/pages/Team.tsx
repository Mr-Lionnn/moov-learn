
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Mail, Phone, Award, BookOpen, Clock, MessageCircle } from "lucide-react";
import Header from "@/components/Header";

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const teamMembers = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "Formatrice Senior - Réseaux",
      department: "Formation",
      email: "marie.dubois@moovlearn.com",
      phone: "+33 1 23 45 67 80",
      avatar: "/placeholder.svg",
      specialties: ["TCP/IP", "Cisco", "Routing"],
      coursesCreated: 8,
      totalStudents: 245,
      averageRating: 4.9,
      joinedDate: "2023-01-15",
      status: "En ligne",
      bio: "15 ans d'expérience en infrastructure réseau, certifiée CCIE."
    },
    {
      id: 2,
      name: "Pierre Martin",
      role: "Expert Cisco",
      department: "Formation",
      email: "pierre.martin@moovlearn.com",
      phone: "+33 1 23 45 67 81",
      avatar: "/placeholder.svg",
      specialties: ["Cisco", "Switching", "VLAN"],
      coursesCreated: 12,
      totalStudents: 320,
      averageRating: 4.8,
      joinedDate: "2022-09-10",
      status: "En ligne",
      bio: "Spécialiste Cisco avec 20 ans d'expérience terrain."
    },
    {
      id: 3,
      name: "Sophie Laurent",
      role: "Spécialiste Sécurité",
      department: "Formation",
      email: "sophie.laurent@moovlearn.com",
      phone: "+33 1 23 45 67 82",
      avatar: "/placeholder.svg",
      specialties: ["Sécurité", "Pare-feu", "VPN"],
      coursesCreated: 6,
      totalStudents: 180,
      averageRating: 4.9,
      joinedDate: "2023-03-20",
      status: "Absent",
      bio: "Experte en cybersécurité, CISSP certifiée."
    },
    {
      id: 4,
      name: "Jean Dupuis",
      role: "Formateur Junior",
      department: "Formation",
      email: "jean.dupuis@moovlearn.com",
      phone: "+33 1 23 45 67 83",
      avatar: "/placeholder.svg",
      specialties: ["WiFi", "Base réseaux", "Support"],
      coursesCreated: 4,
      totalStudents: 95,
      averageRating: 4.6,
      joinedDate: "2024-01-08",
      status: "En ligne",
      bio: "Nouveau formateur passionné par les technologies réseau."
    },
    {
      id: 5,
      name: "Julie Petit",
      role: "Architecte Réseau",
      department: "Formation",
      email: "julie.petit@moovlearn.com",
      phone: "+33 1 23 45 67 84",
      avatar: "/placeholder.svg",
      specialties: ["Architecture", "Design", "Cloud"],
      coursesCreated: 10,
      totalStudents: 280,
      averageRating: 4.8,
      joinedDate: "2022-11-15",
      status: "En ligne",
      bio: "Architecte réseau senior, spécialiste cloud et SDN."
    }
  ];

  const departments = [
    {
      name: "Formation",
      members: 5,
      lead: "Marie Dubois",
      description: "Équipe de formateurs spécialisés en technologies réseau"
    }
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En ligne": return "bg-green-100 text-green-800";
      case "Absent": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notre Équipe</h1>
          <p className="text-gray-600">Rencontrez nos experts en formation réseau</p>
        </div>

        {/* Department Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {departments.map((dept, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {dept.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membres</span>
                    <Badge>{dept.members}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Responsable</span>
                    <span className="font-medium">{dept.lead}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{dept.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Rechercher un membre de l'équipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{member.bio}</p>
                
                {/* Specialties */}
                <div>
                  <p className="text-sm font-medium mb-2">Spécialités</p>
                  <div className="flex flex-wrap gap-1">
                    {member.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">{member.coursesCreated}</p>
                      <p className="text-gray-600">Formations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">{member.totalStudents}</p>
                      <p className="text-gray-600">Étudiants</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">{member.averageRating}/5</span>
                  <span className="text-gray-600">Note moyenne</span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{member.phone}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                  <Button variant="outline" size="sm">
                    Profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
            <p className="text-gray-600">Essayez de modifier votre recherche</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Team;
