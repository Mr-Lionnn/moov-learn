import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  GripVertical, 
  Edit, 
  Trash2, 
  Upload, 
  FileText, 
  Video, 
  Music, 
  Image,
  Clock,
  CheckCircle,
  Eye
} from "lucide-react";
import { Chapter } from "../CourseCreationWorkflow";
import FilePreview from "../../FilePreview";

interface ChapterSetupFormProps {
  chapters: Chapter[];
  onUpdate: (chapters: Chapter[]) => void;
}

const contentTypeIcons = {
  text: FileText,
  pdf: FileText,
  video: Video,
  audio: Music,
  mixed: Image
};

const contentTypeLabels = {
  text: "Contenu Textuel",
  pdf: "Document PDF",
  video: "Vidéo",
  audio: "Audio",
  mixed: "Contenu Mixte"
};

const ChapterSetupForm = ({ chapters, onUpdate }: ChapterSetupFormProps) => {
  const navigate = useNavigate();
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const addChapter = () => {
    if (!newChapterTitle.trim()) return;

    const newChapter: Chapter = {
      id: `chapter_${Date.now()}`,
      title: newChapterTitle.trim(),
      description: "",
      order: chapters.length + 1,
      contentType: 'text',
      content: "",
      files: [],
      estimatedDuration: 30,
      isCompleted: false
    };

    onUpdate([...chapters, newChapter]);
    setNewChapterTitle("");
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    const updated = chapters.map(chapter => 
      chapter.id === id ? { ...chapter, ...updates } : chapter
    );
    onUpdate(updated);
  };

  const deleteChapter = (id: string) => {
    const filtered = chapters.filter(chapter => chapter.id !== id);
    const reordered = filtered.map((chapter, index) => ({
      ...chapter,
      order: index + 1
    }));
    onUpdate(reordered);
  };

  const moveChapter = (id: string, direction: 'up' | 'down') => {
    const currentIndex = chapters.findIndex(c => c.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === chapters.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const reordered = [...chapters];
    [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];
    
    // Update order numbers
    const withUpdatedOrder = reordered.map((chapter, index) => ({
      ...chapter,
      order: index + 1
    }));
    
    onUpdate(withUpdatedOrder);
  };

  const getChapterProgress = (chapter: Chapter) => {
    let progress = 0;
    if (chapter.title) progress += 25;
    if (chapter.description) progress += 25;
    if (chapter.contentType && (chapter.content || chapter.files.length > 0)) progress += 50;
    return progress;
  };

  const getTotalEstimatedDuration = () => {
    return chapters.reduce((total, chapter) => total + chapter.estimatedDuration, 0);
  };

  return (
    <div className="space-y-6">
      {/* Chapter Overview */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Aperçu de la Formation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{chapters.length}</p>
                <p className="text-sm text-gray-600">Chapitres</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{getTotalEstimatedDuration()}</p>
                <p className="text-sm text-gray-600">Minutes au total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {chapters.filter(c => getChapterProgress(c) === 100).length}
                </p>
                <p className="text-sm text-gray-600">Chapitres terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Chapter */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un Nouveau Chapitre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Titre du chapitre..."
              onKeyDown={(e) => e.key === 'Enter' && addChapter()}
            />
            <Button onClick={addChapter} disabled={!newChapterTitle.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chapters List */}
      {chapters.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Structure de la Formation</h3>
          
          {chapters.map((chapter, index) => {
            const progress = getChapterProgress(chapter);
            const Icon = contentTypeIcons[chapter.contentType];
            
            return (
              <Card key={chapter.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <Badge variant="outline">Chapitre {chapter.order}</Badge>
                      </div>
                      <h4 className="font-medium">{chapter.title}</h4>
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={progress === 100 ? "default" : "secondary"}>
                        {progress}% complété
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingChapter(editingChapter === chapter.id ? null : chapter.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteChapter(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {editingChapter === chapter.id && (
                  <CardContent className="border-t space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${chapter.id}`}>Titre du Chapitre</Label>
                        <Input
                          id={`title-${chapter.id}`}
                          value={chapter.title}
                          onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`duration-${chapter.id}`}>Durée Estimée (minutes)</Label>
                        <Input
                          id={`duration-${chapter.id}`}
                          type="number"
                          value={chapter.estimatedDuration}
                          onChange={(e) => updateChapter(chapter.id, { estimatedDuration: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`description-${chapter.id}`}>Description</Label>
                      <Textarea
                        id={`description-${chapter.id}`}
                        value={chapter.description}
                        onChange={(e) => updateChapter(chapter.id, { description: e.target.value })}
                        placeholder="Décrivez le contenu de ce chapitre..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Type de Contenu</Label>
                      <Select 
                        value={chapter.contentType} 
                        onValueChange={(value: Chapter['contentType']) => updateChapter(chapter.id, { contentType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(contentTypeLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {chapter.contentType === 'text' && (
                      <div className="space-y-2">
                        <Label htmlFor={`content-${chapter.id}`}>Contenu Textuel</Label>
                        <Textarea
                          id={`content-${chapter.id}`}
                          value={chapter.content || ""}
                          onChange={(e) => updateChapter(chapter.id, { content: e.target.value })}
                          placeholder="Rédigez le contenu de ce chapitre..."
                          rows={6}
                        />
                        <p className="text-xs text-gray-500">
                          Utilisez du markdown pour la mise en forme (gras: **texte**, italique: *texte*, listes: - item)
                        </p>
                      </div>
                    )}
                    
                    {chapter.contentType !== 'text' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Fichiers Associés ({chapter.files.length})</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Store the chapter context for file association
                              sessionStorage.setItem('uploadContext', JSON.stringify({
                                chapterId: chapter.id,
                                chapterTitle: chapter.title,
                                returnPath: '/create-course'
                              }));
                              navigate('/upload-files');
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Télécharger des Fichiers
                          </Button>
                        </div>
                        
                        {chapter.files.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium">Fichiers associés ({chapter.files.length}):</h4>
                            <div className="space-y-3">
                              {chapter.files.map((file) => (
                                <FilePreview
                                  key={file.id}
                                  file={file}
                                  onRemove={(fileId) => {
                                    const updatedFiles = chapter.files.filter(f => f.id !== fileId);
                                    updateChapter(chapter.id, { files: updatedFiles });
                                  }}
                                  showActions={true}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveChapter(chapter.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑ Monter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveChapter(chapter.id, 'down')}
                        disabled={index === chapters.length - 1}
                      >
                        ↓ Descendre
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
      
      {chapters.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun chapitre créé</h3>
            <p className="text-gray-500">Commencez par ajouter le premier chapitre de votre formation.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChapterSetupForm;