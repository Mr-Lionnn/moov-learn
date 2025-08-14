import React from 'react';
import Header from '@/components/Header';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Megaphone, 
  Gift, 
  Calendar, 
  Star, 
  ChevronRight,
  Bell,
  Users,
  TrendingUp
} from 'lucide-react';

const Information = () => {
  // Mock data for demonstration
  const announcements = [
    {
      id: 1,
      title: "Nouvelle offre Data Plus disponible",
      content: "Découvrez notre nouvelle offre Data Plus avec 50GB de données pour seulement 15,000 FCFA/mois.",
      date: "2024-01-15",
      type: "offer",
      urgent: false
    },
    {
      id: 2,
      title: "Mise à jour des tarifs SMS",
      content: "Les nouveaux tarifs SMS sont effectifs à partir du 1er février 2024.",
      date: "2024-01-12",
      type: "update",
      urgent: true
    },
    {
      id: 3,
      title: "Formation sur les nouveaux produits",
      content: "Une session de formation est prévue le 20 janvier pour présenter nos nouveaux services.",
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
                    <Button variant="outline" size="sm" className="text-sm">
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
    </div>
  );
};

export default Information;