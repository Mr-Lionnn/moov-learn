import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus,
  Save,
  Eye,
  Upload,
  FileText,
  Video,
  Headphones,
  HelpCircle,
  Settings,
  BookOpen,
  Users,
  Clock,
  Target,
  X
} from "lucide-react";
import { LearningModule, ModuleSection, ModuleContent } from "@/types/module";
import DragDropContentOrganizer from "./DragDropContentOrganizer";
import RichTextEditor from "./RichTextEditor";
import EnhancedMediaPlayer from "./EnhancedMediaPlayer";
import AdvancedQuizBuilder from "./AdvancedQuizBuilder";

interface ModuleCreatorProps {
  onSave: (module: LearningModule) => void;
  onCancel: () => void;
  existingModule?: LearningModule;
}

const ModuleCreator = ({ onSave, onCancel, existingModule }: ModuleCreatorProps) => {
  const [module, setModule] = useState<Partial<LearningModule>>({
    title: existingModule?.title || "",
    description: existingModule?.description || "",
    category: existingModule?.category || "",
    level: existingModule?.level || "beginner",
    estimatedDuration: existingModule?.estimatedDuration || 60,
    sections: existingModule?.sections || [],
    prerequisites: existingModule?.prerequisites || [],
    tags: existingModule?.tags || [],
    isPublished: existingModule?.isPublished || false,
    isDraft: existingModule?.isDraft ?? true
  });

  const [activeTab, setActiveTab] = useState("info");
  const [showContentModal, setShowContentModal] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [editingContent, setEditingContent] = useState<ModuleContent | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newTag, setNewTag] = useState("");

  const addSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: ModuleSection = {
      id: `section_${Date.now()}`,
      title: newSectionTitle,
      order: module.sections?.length || 0,
      contents: []
    };

    setModule(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
    
    setNewSectionTitle("");
  };

  const addTag = () => {
    if (!newTag.trim() || module.tags?.includes(newTag)) return;

    setModule(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTag]
    }));
    
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setModule(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSectionReorder = (newSections: ModuleSection[]) => {
    setModule(prev => ({ ...prev, sections: newSections }));
  };

  const handleContentReorder = (sectionId: string, newContents: ModuleContent[]) => {
    const updatedSections = module.sections?.map(section => 
      section.id === sectionId 
        ? { ...section, contents: newContents }
        : section
    ) || [];
    
    setModule(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleContentEdit = (content: ModuleContent) => {
    setEditingContent(content);
    setShowContentModal(true);
  };

  const handleContentDelete = (sectionId: string, contentId: string) => {
    const updatedSections = module.sections?.map(section => 
      section.id === sectionId 
        ? { ...section, contents: section.contents.filter(c => c.id !== contentId) }
        : section
    ) || [];
    
    setModule(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleAddContent = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setEditingContent(null);
    setShowContentModal(true);
  };

  const handleContentSave = (contentData: Omit<ModuleContent, 'id' | 'order'>) => {
    if (!selectedSectionId) return;

    const newContent: ModuleContent = {
      ...contentData,
      id: editingContent?.id || `content_${Date.now()}`,
      order: editingContent?.order || 0
    };

    const updatedSections = module.sections?.map(section => {
      if (section.id === selectedSectionId) {
        if (editingContent) {
          // Update existing content
          return {
            ...section,
            contents: section.contents.map(c => c.id === editingContent.id ? newContent : c)
          };
        } else {
          // Add new content
          return {
            ...section,
            contents: [...section.contents, { ...newContent, order: section.contents.length }]
          };
        }
      }
      return section;
    }) || [];

    setModule(prev => ({ ...prev, sections: updatedSections }));
    setShowContentModal(false);
    setEditingContent(null);
    setSelectedSectionId(null);
  };

  const handleSave = (publish = false) => {
    if (!module.title || !module.description) return;

    const completeModule: LearningModule = {
      id: existingModule?.id || `module_${Date.now()}`,
      title: module.title,
      description: module.description,
      category: module.category || "general",
      level: module.level || "beginner",
      estimatedDuration: module.estimatedDuration || 60,
      sections: module.sections || [],
      prerequisites: module.prerequisites || [],
      tags: module.tags || [],
      isPublished: publish,
      isDraft: !publish,
      createdBy: "current_user",
      createdAt: existingModule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: (existingModule?.version || 0) + 1
    };

    onSave(completeModule);
  };

  const getEstimatedDurationFromContent = () => {
    let totalDuration = 0;
    module.sections?.forEach(section => {
      section.contents.forEach(content => {
        if (content.duration) {
          totalDuration += content.duration;
        } else if (content.type === 'text' && content.content) {
          // Estimate reading time: ~200 words per minute
          const wordCount = content.content.split(' ').length;
          totalDuration += Math.ceil(wordCount / 200) * 60;
        } else if (content.type === 'quiz') {
          // Estimate 2 minutes per question
          totalDuration += 120; // Default quiz time
        }
      });
    });
    return Math.ceil(totalDuration / 60); // Convert to minutes
  };

  const ContentTypeSelector = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button
        variant="outline"
        className="h-24 flex-col gap-2"
        onClick={() => {
          setEditingContent({ 
            id: '', 
            type: 'text', 
            title: 'Nouveau Contenu Texte', 
            order: 0 
          } as ModuleContent);
        }}
      >
        <FileText className="h-6 w-6" />
        <span className="text-sm">Texte</span>
      </Button>
      
      <Button
        variant="outline"
        className="h-24 flex-col gap-2"
        onClick={() => {
          setEditingContent({ 
            id: '', 
            type: 'video', 
            title: 'Nouvelle Vidéo', 
            order: 0 
          } as ModuleContent);
        }}
      >
        <Video className="h-6 w-6" />
        <span className="text-sm">Vidéo</span>
      </Button>
      
      <Button
        variant="outline"
        className="h-24 flex-col gap-2"
        onClick={() => {
          setEditingContent({ 
            id: '', 
            type: 'audio', 
            title: 'Nouveau Audio', 
            order: 0 
          } as ModuleContent);
        }}
      >
        <Headphones className="h-6 w-6" />
        <span className="text-sm">Audio</span>
      </Button>
      
      <Button
        variant="outline"
        className="h-24 flex-col gap-2"
        onClick={() => setShowQuizBuilder(true)}
      >
        <HelpCircle className="h-6 w-6" />
        <span className="text-sm">Quiz</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {existingModule ? 'Modifier' : 'Créer'} un Module de Formation
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="outline" onClick={() => handleSave(false)}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button onClick={() => handleSave(true)} className="moov-gradient text-white">
            <Upload className="h-4 w-4 mr-2" />
            Publier
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">
            <Settings className="h-4 w-4 mr-2" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="content">
            <BookOpen className="h-4 w-4 mr-2" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Users className="h-4 w-4 mr-2" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="module-title">Titre du Module</Label>
                  <Input
                    id="module-title"
                    value={module.title}
                    onChange={(e) => setModule(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre du module d'apprentissage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={module.category}
                    onValueChange={(value) => setModule(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technologie">Technologie</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="langues">Langues</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={module.description}
                  onChange={(e) => setModule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée du module..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Niveau de Difficulté</Label>
                  <Select
                    value={module.level}
                    onValueChange={(value) => setModule(prev => ({ ...prev, level: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Durée Estimée (minutes)</Label>
                  <Input
                    type="number"
                    value={module.estimatedDuration}
                    onChange={(e) => setModule(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 0 }))}
                    placeholder="60"
                  />
                  <p className="text-xs text-gray-500">
                    Calculé automatiquement: {getEstimatedDurationFromContent()} min
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Badge variant={module.isPublished ? "default" : "outline"}>
                    {module.isPublished ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {module.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag..."
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sections du Module</CardTitle>
                <div className="flex gap-2">
                  <Input
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="Nom de la section..."
                    onKeyDown={(e) => e.key === 'Enter' && addSection()}
                  />
                  <Button onClick={addSection} disabled={!newSectionTitle.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Section
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DragDropContentOrganizer
                sections={module.sections || []}
                onSectionReorder={handleSectionReorder}
                onContentReorder={handleContentReorder}
                onContentEdit={handleContentEdit}
                onContentDelete={handleContentDelete}
                onAddContent={handleAddContent}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'Accès et Prérequis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Modules Prérequis</Label>
                <p className="text-sm text-gray-600">
                  Définissez quels modules doivent être complétés avant celui-ci
                </p>
                {/* Add prerequisite selector here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du Module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{module.title || "Titre du Module"}</h3>
                  <p className="text-gray-600 mt-2">{module.description || "Description du module"}</p>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {module.estimatedDuration || 0} minutes
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {module.level || "beginner"}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {module.sections?.length || 0} sections
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Contenu du Module</h4>
                  {module.sections?.map((section, index) => (
                    <div key={section.id} className="mb-3">
                      <h5 className="font-medium text-sm">{index + 1}. {section.title}</h5>
                      <ul className="ml-4 text-sm text-gray-600">
                        {section.contents.map(content => (
                          <li key={content.id} className="flex items-center gap-2">
                            <span>• {content.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {content.type}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Content Modal */}
      <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingContent?.type === 'text' && 'Contenu Texte'}
              {editingContent?.type === 'video' && 'Contenu Vidéo'}
              {editingContent?.type === 'audio' && 'Contenu Audio'}
              {!editingContent && 'Choisir le Type de Contenu'}
            </DialogTitle>
          </DialogHeader>
          
          {!editingContent ? (
            <ContentTypeSelector />
          ) : editingContent.type === 'text' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={editingContent.title}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                  placeholder="Titre du contenu"
                />
              </div>
              <div className="space-y-2">
                <Label>Contenu</Label>
                <RichTextEditor
                  content={editingContent.content || ''}
                  onChange={(content) => setEditingContent({ ...editingContent, content })}
                  placeholder="Rédigez votre contenu ici..."
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleContentSave({
                    type: 'text',
                    title: editingContent.title,
                    content: editingContent.content
                  })}
                  className="moov-gradient text-white"
                >
                  Enregistrer
                </Button>
                <Button variant="outline" onClick={() => setShowContentModal(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (editingContent.type === 'video' || editingContent.type === 'audio') ? (
            <EnhancedMediaPlayer
              content={editingContent}
              onSave={handleContentSave}
              isEditing={true}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Quiz Builder Modal */}
      <Dialog open={showQuizBuilder} onOpenChange={setShowQuizBuilder}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créateur de Quiz Avancé</DialogTitle>
          </DialogHeader>
          <AdvancedQuizBuilder
            moduleId={module.title || 'temp-module'}
            onSave={(quiz) => {
              console.log('Quiz saved:', quiz);
              setShowQuizBuilder(false);
            }}
            onCancel={() => setShowQuizBuilder(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleCreator;