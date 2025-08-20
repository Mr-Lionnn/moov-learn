import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Save, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Announcement, AnnouncementPriority, AnnouncementVisibility } from '@/types/announcement';
import RichTextEditor from '@/components/module/RichTextEditor';

interface AnnouncementCreatorProps {
  announcement?: Announcement | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AnnouncementCreator: React.FC<AnnouncementCreatorProps> = ({
  announcement,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as AnnouncementPriority,
    visibility: 'public' as AnnouncementVisibility,
    target_roles: [] as string[],
    scheduled_at: '',
    expires_at: '',
    is_published: false
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [availableRoles] = useState(['admin', 'director', 'team_chief', 'employee']);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        visibility: announcement.visibility,
        target_roles: announcement.target_roles || [],
        scheduled_at: announcement.scheduled_at ? new Date(announcement.scheduled_at).toISOString().slice(0, 16) : '',
        expires_at: announcement.expires_at ? new Date(announcement.expires_at).toISOString().slice(0, 16) : '',
        is_published: announcement.is_published
      });
    }
  }, [announcement]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter(r => r !== role)
        : [...prev.target_roles, role]
    }));
  };

  const uploadAttachments = async (announcementId: string) => {
    const uploadPromises = attachments.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `announcements/${announcementId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('announcements')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('announcements')
        .getPublicUrl(filePath);

      return supabase
        .from('announcement_attachments')
        .insert({
          announcement_id: announcementId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size
        });
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Le titre et le contenu sont obligatoires');
      return;
    }

    setLoading(true);

    try {
      const announcementData: any = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        visibility: formData.visibility,
        target_roles: formData.visibility === 'role_specific' ? formData.target_roles : null,
        scheduled_at: formData.scheduled_at || null,
        expires_at: formData.expires_at || null,
        is_published: publish || formData.is_published
      };

      if (publish && !announcement?.is_published) {
        announcementData.published_at = new Date().toISOString();
      }

      if (!announcement) {
        announcementData.author_id = user?.id;
      }

      let result;
      if (announcement) {
        result = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', announcement.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('announcements')
          .insert(announcementData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Upload attachments if any
      if (attachments.length > 0) {
        await uploadAttachments(result.data.id);
      }

      toast.success(
        announcement
          ? 'Annonce mise à jour avec succès'
          : publish
          ? 'Annonce créée et publiée avec succès'
          : 'Annonce sauvegardée en brouillon'
      );

      onSuccess();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {announcement ? 'Modifier l\'annonce' : 'Créer une nouvelle annonce'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l'annonce *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Entrez le titre de votre annonce"
              />
            </div>

            <div>
              <Label htmlFor="content">Contenu *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Rédigez le contenu de votre annonce..."
              />
            </div>
          </div>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Paramètres de l'annonce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: AnnouncementPriority) =>
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                      <SelectItem value="emergency">Urgence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="visibility">Visibilité</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value: AnnouncementVisibility) =>
                      setFormData(prev => ({ ...prev, visibility: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Privé</SelectItem>
                      <SelectItem value="role_specific">Par rôle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.visibility === 'role_specific' && (
                <div>
                  <Label>Rôles ciblés</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableRoles.map((role) => (
                      <Badge
                        key={role}
                        variant={formData.target_roles.includes(role) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleRoleToggle(role)}
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduled_at">Programmer la publication</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="expires_at">Date d'expiration</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pièces jointes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="attachments">Ajouter des fichiers</Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Fichiers sélectionnés:</Label>
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder en brouillon
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={loading}
            >
              <Send className="h-4 w-4 mr-2" />
              {announcement?.is_published ? 'Mettre à jour' : 'Publier'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};