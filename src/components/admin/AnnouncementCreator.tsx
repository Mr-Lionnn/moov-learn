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
import { Upload, X, Save, Send, Video, Volume2, Image as ImageIcon, FileText, Paperclip } from 'lucide-react';
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

          {/* Multimedia Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Pièces jointes multimédia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Cliquer pour télécharger des fichiers</p>
                      <p className="text-sm text-muted-foreground">ou glisser-déposer ici</p>
                    </div>
                  </label>
                </div>

                {/* Supported formats info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-center">
                    <Video className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <span>Vidéo</span>
                    <div className="text-xs text-muted-foreground">MP4, AVI, MOV</div>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded text-center">
                    <Volume2 className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <span>Audio</span>
                    <div className="text-xs text-muted-foreground">MP3, WAV, M4A</div>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded text-center">
                    <ImageIcon className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                    <span>Image</span>
                    <div className="text-xs text-muted-foreground">JPG, PNG, GIF</div>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded text-center">
                    <FileText className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                    <span>Document</span>
                    <div className="text-xs text-muted-foreground">PDF, DOC, TXT</div>
                  </div>
                </div>
                
                {/* Attached Files Display */}
                {attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Fichiers attachés ({attachments.length})
                    </h4>
                    <div className="grid gap-2">
                      {attachments.map((file, index) => {
                        const isImage = file.type.startsWith('image/');
                        const isVideo = file.type.startsWith('video/');
                        const isAudio = file.type.startsWith('audio/');
                        
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                            <div className="flex-shrink-0">
                              {isImage && <ImageIcon className="h-5 w-5 text-purple-600" />}
                              {isVideo && <Video className="h-5 w-5 text-blue-600" />}
                              {isAudio && <Volume2 className="h-5 w-5 text-green-600" />}
                              {!isImage && !isVideo && !isAudio && <FileText className="h-5 w-5 text-orange-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
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