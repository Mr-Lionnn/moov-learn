import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Eye, Download, AlertCircle, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement, AnnouncementAttachment } from '@/types/announcement';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [attachments, setAttachments] = useState<AnnouncementAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .or(`scheduled_at.is.null,scheduled_at.lte.${new Date().toISOString()}`)
        .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)
        .order('priority', { ascending: false })
        .order('published_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttachments = async (announcementId: string) => {
    try {
      const { data, error } = await supabase
        .from('announcement_attachments')
        .select('*')
        .eq('announcement_id', announcementId);

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Error fetching attachments:', error);
    }
  };

  const markAsViewed = async (announcementId: string) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('announcement_views')
        .upsert({
          announcement_id: announcementId,
          user_id: user.id
        });
    } catch (error) {
      console.error('Error marking announcement as viewed:', error);
    }
  };

  const handleAnnouncementClick = async (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    await fetchAttachments(announcement.id);
    await markAsViewed(announcement.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500 text-white animate-pulse';
      case 'critical': return 'bg-orange-500 text-white';
      case 'high': return 'bg-yellow-500 text-black';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'URGENCE';
      case 'critical': return 'CRITIQUE';
      case 'high': return 'ÉLEVÉE';
      case 'medium': return 'MOYENNE';
      case 'low': return 'BASSE';
      default: return priority.toUpperCase();
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'emergency' || priority === 'critical') {
      return <AlertCircle className="h-4 w-4" />;
    }
    return null;
  };

  const downloadAttachment = (attachment: AnnouncementAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.file_url;
    link.download = attachment.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Chargement des annonces...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleAnnouncementClick(announcement)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    {getPriorityIcon(announcement.priority)}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {getPriorityLabel(announcement.priority)}
                    </Badge>
                    {announcement.visibility === 'role_specific' && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Par rôle
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Lire Plus
                </Button>
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
                    {new Date(announcement.published_at || announcement.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  {announcement.expires_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expire le: {new Date(announcement.expires_at).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune annonce disponible pour le moment.</p>
          </div>
        )}
      </div>

      {selectedAnnouncement && (
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
            <div className="space-y-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
              />

              {attachments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Pièces jointes</h4>
                  <div className="grid gap-2">
                    {attachments.map((attachment) => (
                      <Card key={attachment.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{attachment.file_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {attachment.file_type}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadAttachment(attachment)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Publié le: {new Date(selectedAnnouncement.published_at || selectedAnnouncement.created_at).toLocaleString('fr-FR')}</p>
                {selectedAnnouncement.expires_at && (
                  <p>Expire le: {new Date(selectedAnnouncement.expires_at).toLocaleString('fr-FR')}</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};