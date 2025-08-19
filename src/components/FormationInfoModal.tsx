import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  FileText,
  Video,
  AudioWaveform,
  Download
} from 'lucide-react';
import UniversalDocumentViewer from '@/components/viewers/UniversalDocumentViewer';
import { ContentFile } from '@/types/content';
import { useState } from 'react';

interface FormationInfo {
  id: string;
  title: string;
  description: string;
  detailedContent: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  participants: number;
  category: string;
  objectives: string[];
  prerequisites?: string[];
  materials?: ContentFile[];
  hasDetailedInfo: boolean;
}

interface FormationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  formation: FormationInfo | null;
}

const FormationInfoModal: React.FC<FormationInfoModalProps> = ({ 
  isOpen, 
  onClose, 
  formation 
}) => {
  const [selectedFile, setSelectedFile] = useState<ContentFile | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  if (!formation) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'mp4':
      case 'webm':
      case 'avi':
        return <Video className="h-4 w-4" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <AudioWaveform className="h-4 w-4" />;
      case 'pdf':
      case 'docx':
      case 'pptx':
      case 'xlsx':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleViewFile = (file: ContentFile) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const handleDownloadFile = (file: ContentFile) => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {formation.title}
                </DialogTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={getLevelColor(formation.level)}>
                    {getLevelLabel(formation.level)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formation.duration}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {formation.participants} participants
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="space-y-6 pr-4">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{formation.description}</p>
              </div>

              {/* Detailed Content */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Contenu Détaillé</h3>
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formation.detailedContent }} />
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Objectifs Pédagogiques</h3>
                <ul className="space-y-2">
                  {formation.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              {formation.prerequisites && formation.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Prérequis</h3>
                  <ul className="space-y-2">
                    {formation.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Materials */}
              {formation.materials && formation.materials.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Ressources et Documents</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {formation.materials.map((file) => (
                      <div key={file.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{file.name}</h4>
                            <p className="text-sm text-muted-foreground">{file.size}</p>
                            {file.duration && (
                              <p className="text-xs text-muted-foreground">Durée: {file.duration}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewFile(file)}
                            className="flex-1"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadFile(file)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Universal Document Viewer */}
      {selectedFile && (
        <UniversalDocumentViewer
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedFile(null);
          }}
          file={selectedFile}
          onSave={() => console.log('File saved')}
          onDownload={() => handleDownloadFile(selectedFile)}
        />
      )}
    </>
  );
};

export default FormationInfoModal;