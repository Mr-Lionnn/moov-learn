
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Award, Download, Share2, Calendar, CheckCircle } from "lucide-react";
import Header from "@/components/Header";

const Certifications = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const certifications = [
    {
      id: 1,
      title: "Cisco CCNA Routing & Switching",
      issuer: "MoovLearn",
      dateEarned: "2024-11-15",
      expiryDate: "2027-11-15",
      credentialId: "CCNA-2024-001",
      skills: ["Routage", "Commutation", "TCP/IP", "VLAN"],
      status: "Active",
      score: "95%",
      certificateUrl: "#"
    },
    {
      id: 2,
      title: "Sécurité Réseau Avancée",
      issuer: "MoovLearn",
      dateEarned: "2024-10-20",
      expiryDate: "2027-10-20",
      credentialId: "SEC-2024-002",
      skills: ["Pare-feu", "VPN", "IDS/IPS", "Cryptographie"],
      status: "Active",
      score: "88%",
      certificateUrl: "#"
    },
    {
      id: 3,
      title: "Fondamentaux des Réseaux",
      issuer: "MoovLearn",
      dateEarned: "2024-09-10",
      expiryDate: "2026-09-10",
      credentialId: "NET-2024-003",
      skills: ["TCP/IP", "OSI", "Ethernet", "WiFi"],
      status: "Active",
      score: "92%",
      certificateUrl: "#"
    }
  ];

  const upcomingCertifications = [
    {
      title: "Configuration Avancée des Switches",
      estimatedDate: "Décembre 2024",
      progress: 75,
      requirements: "Terminer le module configuration avancée"
    },
    {
      title: "Spécialiste Cloud Networking",
      estimatedDate: "Janvier 2025",
      progress: 30,
      requirements: "Compléter 3 modules sur le cloud"
    }
  ];

  const filteredCertifications = certifications.filter(cert =>
    cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Certifications</h1>
          <p className="text-gray-600">Gérez et partagez vos certifications professionnelles</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Rechercher dans mes certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Earned Certifications */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications Obtenues</h2>
            <div className="space-y-6">
              {filteredCertifications.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                          <Award className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{cert.title}</CardTitle>
                          <p className="text-gray-600">Délivré par {cert.issuer}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {cert.status}
                            </Badge>
                            <span className="text-sm text-gray-600">Score: {cert.score}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Date d'obtention</p>
                        <p className="font-medium">{new Date(cert.dateEarned).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expire le</p>
                        <p className="font-medium">{new Date(cert.expiryDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-2">ID Certification</p>
                        <p className="font-mono text-sm bg-gray-100 p-2 rounded">{cert.credentialId}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Compétences validées</p>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="default" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Certifications</span>
                  <Badge>{certifications.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certifications Actives</span>
                  <Badge className="bg-green-100 text-green-800">
                    {certifications.filter(c => c.status === "Active").length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score Moyen</span>
                  <span className="font-medium">92%</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Prochaines Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingCertifications.map((cert, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{cert.title}</h4>
                    <p className="text-sm text-gray-600">{cert.estimatedDate}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{cert.requirements}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Certifications;
