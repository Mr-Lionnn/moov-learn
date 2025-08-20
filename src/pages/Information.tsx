import React, { useState } from 'react';
import Header from '@/components/Header';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Megaphone, 
  Gift, 
  Calendar, 
  Star, 
  ChevronRight,
  Bell,
  Users,
  TrendingUp,
  X
} from 'lucide-react';

const Information = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for demonstration
  const announcements = [
    {
      id: 1,
      title: "Nouvelle offre Data Plus disponible",
      content: "Découvrez notre nouvelle offre Data Plus avec 50GB de données pour seulement 15,000 FCFA/mois.",
      detailedContent: `
        <h3>Nouvelle offre Data Plus - Détails complets</h3>
        <p>Nous sommes ravis de vous présenter notre nouvelle offre Data Plus, conçue pour répondre aux besoins croissants de connectivité de nos clients.</p>
        
        <h4>Caractéristiques de l'offre :</h4>
        <ul>
          <li><strong>Volume de données :</strong> 50GB de data 4G+ haute vitesse</li>
          <li><strong>Prix :</strong> 15,000 FCFA/mois</li>
          <li><strong>Validité :</strong> 30 jours</li>
          <li><strong>Bonus :</strong> 10GB supplémentaires entre 00h et 06h</li>
          <li><strong>Réseaux sociaux :</strong> Facebook, WhatsApp, Instagram illimités</li>
        </ul>
        
        <h4>Comment souscrire :</h4>
        <ul>
          <li>Composez *147*5# depuis votre mobile Moov</li>
          <li>Visitez nos agences Moov</li>
          <li>Via l'application Moov Money</li>
        </ul>
        
        <p><strong>Offre valable à partir du 15 janvier 2024.</strong></p>
      `,
      date: "2024-01-15",
      type: "offer",
      urgent: false
    },
    {
      id: 2,
      title: "Mise à jour des tarifs SMS",
      content: "Les nouveaux tarifs SMS sont effectifs à partir du 1er février 2024.",
      detailedContent: `
        <h3>Mise à jour des tarifs SMS - Information complète</h3>
        <p>Dans le cadre de l'amélioration continue de nos services, nous procédons à une mise à jour de nos tarifs SMS.</p>
        
        <h4>Nouveaux tarifs (effectifs au 1er février 2024) :</h4>
        <ul>
          <li><strong>SMS national :</strong> 25 FCFA (au lieu de 20 FCFA)</li>
          <li><strong>SMS vers l'international :</strong> 50 FCFA (au lieu de 45 FCFA)</li>
          <li><strong>SMS groupés (> 100 SMS) :</strong> 20 FCFA/SMS</li>
        </ul>
        
        <h4>Offres SMS avantageuses :</h4>
        <ul>
          <li><strong>Pack SMS 100 :</strong> 1,500 FCFA pour 100 SMS</li>
          <li><strong>Pack SMS 500 :</strong> 6,000 FCFA pour 500 SMS</li>
          <li><strong>SMS illimités :</strong> 10,000 FCFA/mois</li>
        </ul>
        
        <p><strong>Ces tarifs s'appliquent à tous nos clients à partir du 1er février 2024.</strong></p>
        <p>Pour plus d'informations, contactez le service client au 3000.</p>
      `,
      date: "2024-01-12",
      type: "update",
      urgent: true
    },
    {
      id: 3,
      title: "Formation sur les nouveaux produits",
      content: "Une session de formation est prévue le 20 janvier pour présenter nos nouveaux services.",
      detailedContent: `
        <h3>Session de formation - Nouveaux produits et services</h3>
        <p>Rejoignez-nous pour une session de formation complète sur nos derniers produits et services.</p>
        
        <h4>Détails de la formation :</h4>
        <ul>
          <li><strong>Date :</strong> 20 janvier 2024</li>
          <li><strong>Heure :</strong> 9h00 - 17h00</li>
          <li><strong>Lieu :</strong> Centre de formation Moov, Plateau</li>
          <li><strong>Participants :</strong> Équipes commerciales et service client</li>
        </ul>
        
        <h4>Programme de la formation :</h4>
        <ul>
          <li>9h00 - 10h30 : Présentation des nouvelles offres Data</li>
          <li>10h45 - 12h00 : Services Moov Money avancés</li>
          <li>14h00 - 15h30 : Techniques de vente consultative</li>
          <li>15h45 - 17h00 : Gestion des objections clients</li>
        </ul>
        
        <h4>Matériel fourni :</h4>
        <ul>
          <li>Manuel de formation</li>
          <li>Argumentaires de vente</li>
          <li>Fiches produits mises à jour</li>
          <li>Certificat de participation</li>
        </ul>
        
        <p><strong>Inscription obligatoire avant le 18 janvier auprès de votre responsable.</strong></p>
      `,
      date: "2024-01-10",
      type: "announcement",
      urgent: false
    }
  ];

  const offers = [
    {
      id: 1,
      title: "Moov Money - Promo Spéciale",
      description: "Transferts gratuits vers tous les réseaux ce week-end",
      validity: "Valable jusqu'au 31 janvier",
      highlight: true
    },
    {
      id: 2,
      title: "Internet 4G - Forfait Étudiant",
      description: "20GB à 8,000 FCFA pour les étudiants",
      validity: "Offre permanente",
      highlight: false
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <Gift className="h-4 w-4" />;
      case 'update':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string, urgent: boolean) => {
    if (urgent) return <Badge variant="destructive">Urgent</Badge>;
    
    switch (type) {
      case 'offer':
        return <Badge variant="secondary">Offre</Badge>;
      case 'update':
        return <Badge variant="outline">Mise à jour</Badge>;
      default:
        return <Badge variant="default">Annonce</Badge>;
    }
  };

  const handleReadMore = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageTitle 
        title="Centre d'Information Moov" 
        subtitle="Restez informé des dernières actualités, offres et annonces"
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - Announcements */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                Dernières Annonces
              </h2>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className={`transition-all hover:shadow-md ${announcement.urgent ? 'border-destructive' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(announcement.type)}
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      </div>
                      {getTypeBadge(announcement.type, announcement.urgent)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(announcement.date).toLocaleDateString('fr-FR')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4">{announcement.content}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-sm"
                      onClick={() => handleReadMore(announcement)}
                    >
                      Lire plus <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Current Offers */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Star className="h-5 w-5" />
                  Offres du Moment
                </CardTitle>
                <CardDescription>
                  Profitez de nos offres spéciales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.id} className={`p-4 rounded-lg border ${offer.highlight ? 'bg-primary/10 border-primary/30' : 'bg-background border-border'}`}>
                    <h4 className="font-semibold text-foreground mb-2">{offer.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                    <p className="text-xs text-primary font-medium">{offer.validity}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Informations Équipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nouvelles annonces</span>
                    <Badge variant="secondary">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Offres actives</span>
                    <Badge variant="outline">2</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Dernière mise à jour</span>
                    <span className="text-xs text-muted-foreground">Aujourd'hui</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Announcement Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {selectedAnnouncement?.title}
                </DialogTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  {selectedAnnouncement && getTypeBadge(selectedAnnouncement.type, selectedAnnouncement.urgent)}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {selectedAnnouncement && new Date(selectedAnnouncement.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(85vh-120px)]">
            <div className="space-y-4 pr-4">
              {selectedAnnouncement && (
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedAnnouncement.detailedContent }} />
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Information;