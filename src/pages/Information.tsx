import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnnouncementsList } from '@/components/AnnouncementsList';
import { 
  Megaphone, 
  Gift, 
  Calendar, 
  Star, 
  ChevronRight,
  Bell,
  Users,
  TrendingUp,
  X,
  ArrowLeft
} from 'lucide-react';

const Information = () => {
  const navigate = useNavigate();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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

            {/* Dynamic Announcements from Database */}
            <AnnouncementsList />
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

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Information;