import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/announcement';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AnnouncementCreator } from './AnnouncementCreator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const AnnouncementManagementTab = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success('Annonce supprimée avec succès');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const togglePublished = async (announcement: Announcement) => {
    try {
      const updates: any = {
        is_published: !announcement.is_published
      };

      if (!announcement.is_published) {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', announcement.id);

      if (error) throw error;

      setAnnouncements(prev =>
        prev.map(a =>
          a.id === announcement.id
            ? { ...a, ...updates }
            : a
        )
      );

      toast.success(
        announcement.is_published 
          ? 'Annonce dépubliée' 
          : 'Annonce publiée avec succès'
      );
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'critical': return 'bg-orange-500 text-white';
      case 'high': return 'bg-yellow-500 text-black';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'Urgence';
      case 'critical': return 'Critique';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'Public';
      case 'private': return 'Privé';
      case 'role_specific': return 'Par rôle';
      default: return visibility;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des annonces...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestion des Annonces</h3>
        <Button onClick={() => setShowCreator(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Annonce
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {getPriorityLabel(announcement.priority)}
                    </Badge>
                    <Badge variant="outline">
                      {getVisibilityLabel(announcement.visibility)}
                    </Badge>
                    <Badge variant={announcement.is_published ? "default" : "secondary"}>
                      {announcement.is_published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAnnouncement(announcement)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAnnouncement(announcement);
                      setShowCreator(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(announcement)}
                  >
                    {announcement.is_published ? 'Dépublier' : 'Publier'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {announcement.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  {announcement.scheduled_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Programmé: {new Date(announcement.scheduled_at).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                  {announcement.target_roles && announcement.target_roles.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {announcement.target_roles.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucune annonce trouvée. Créez votre première annonce !
        </div>
      )}

      {showCreator && (
        <AnnouncementCreator
          announcement={selectedAnnouncement}
          onClose={() => {
            setShowCreator(false);
            setSelectedAnnouncement(null);
          }}
          onSuccess={() => {
            setShowCreator(false);
            setSelectedAnnouncement(null);
            fetchAnnouncements();
          }}
        />
      )}

      {selectedAnnouncement && !showCreator && (
        <Dialog open={true} onOpenChange={() => setSelectedAnnouncement(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedAnnouncement.title}
                <Badge className={getPriorityColor(selectedAnnouncement.priority)}>
                  {getPriorityLabel(selectedAnnouncement.priority)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
              />
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Créé le: {new Date(selectedAnnouncement.created_at).toLocaleString('fr-FR')}</p>
                {selectedAnnouncement.scheduled_at && (
                  <p>Programmé pour: {new Date(selectedAnnouncement.scheduled_at).toLocaleString('fr-FR')}</p>
                )}
                {selectedAnnouncement.expires_at && (
                  <p>Expire le: {new Date(selectedAnnouncement.expires_at).toLocaleString('fr-FR')}</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};