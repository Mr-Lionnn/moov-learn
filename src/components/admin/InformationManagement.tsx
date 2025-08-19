import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Save,
  X,
  Megaphone,
  Gift,
  TrendingUp,
  Bell
} from 'lucide-react';

interface InformationItem {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'offer' | 'update';
  urgent: boolean;
  publishDate: string;
  expiryDate?: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  category: string;
  tags: string[];
}

interface InformationManagementProps {
  userRole: string;
  userName: string;
}

const InformationManagement: React.FC<InformationManagementProps> = ({ 
  userRole, 
  userName 
}) => {
  const { toast } = useToast();
  const [items, setItems] = useState<InformationItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InformationItem | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: 'announcement' | 'offer' | 'update';
    urgent: boolean;
    publishDate: string;
    expiryDate: string;
    category: string;
    tags: string[];
    tagInput: string;
  }>({
    title: '',
    content: '',
    type: 'announcement',
    urgent: false,
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    category: '',
    tags: [],
    tagInput: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    // Mock data - in real app, load from backend
    const mockItems: InformationItem[] = [
      {
        id: '1',
        title: 'Nouvelle offre Data Plus disponible',
        content: 'Découvrez notre nouvelle offre Data Plus avec 50GB de données pour seulement 15,000 FCFA/mois. Cette offre révolutionnaire change la donne pour nos clients professionnels.',
        type: 'offer',
        urgent: false,
        publishDate: '2024-01-15',
        expiryDate: '2024-02-15',
        status: 'published',
        author: 'Admin',
        category: 'Offres Commerciales',
        tags: ['data', 'promo', 'entreprise']
      },
      {
        id: '2',
        title: 'Mise à jour des tarifs SMS',
        content: 'Les nouveaux tarifs SMS sont effectifs à partir du 1er février 2024. Consultez le guide complet des nouvelles grilles tarifaires.',
        type: 'update',
        urgent: true,
        publishDate: '2024-01-12',
        status: 'published',
        author: 'Directeur Commercial',
        category: 'Tarification',
        tags: ['sms', 'tarifs', 'important']
      }
    ];
    setItems(mockItems);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'announcement',
      urgent: false,
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      category: '',
      tags: [],
      tagInput: ''
    });
  };

  const handleCreate = () => {
    const newItem: InformationItem = {
      id: Date.now().toString(),
      ...formData,
      status: 'published',
      author: userName,
      tags: formData.tags
    };

    setItems([newItem, ...items]);
    setIsCreateModalOpen(false);
    resetForm();
    
    toast({
      title: "Information créée",
      description: "La nouvelle information a été publiée avec succès.",
    });
  };

  const handleEdit = (item: InformationItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      urgent: item.urgent,
      publishDate: item.publishDate,
      expiryDate: item.expiryDate || '',
      category: item.category,
      tags: item.tags,
      tagInput: ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedItem) return;

    const updatedItems = items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, ...formData, tags: formData.tags }
        : item
    );

    setItems(updatedItems);
    setIsEditModalOpen(false);
    setSelectedItem(null);
    resetForm();

    toast({
      title: "Information mise à jour",
      description: "Les modifications ont été enregistrées.",
    });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Information supprimée",
      description: "L'information a été supprimée définitivement.",
      variant: "destructive"
    });
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'offer': return <Gift className="h-4 w-4" />;
      case 'update': return <TrendingUp className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
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

  const FormModal = ({ isOpen, onClose, onSave, title }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    title: string;
  }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de l'information"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Annonce</SelectItem>
                    <SelectItem value="offer">Offre</SelectItem>
                    <SelectItem value="update">Mise à jour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Offres Commerciales"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenu détaillé de l'information..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishDate">Date de publication</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Date d'expiration (optionnel)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.tagInput}
                  onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="urgent"
                checked={formData.urgent}
                onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="urgent">Information urgente</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des Informations</h2>
          <p className="text-muted-foreground">Créez et gérez le contenu du Centre d'Information</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="moov-gradient text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Information
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.publishDate).toLocaleDateString('fr-FR')}
                    </div>
                    <span>Par {item.author}</span>
                    {item.category && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {item.category}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeBadge(item.type, item.urgent)}
                  <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                    {item.status === 'published' ? 'Publié' : 'Brouillon'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-3 line-clamp-2">{item.content}</p>
              
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {item.expiryDate && (
                    <span>Expire le {new Date(item.expiryDate).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        onSave={handleCreate}
        title="Créer une nouvelle information"
      />

      {/* Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
          resetForm();
        }}
        onSave={handleUpdate}
        title="Modifier l'information"
      />
    </div>
  );
};

export default InformationManagement;