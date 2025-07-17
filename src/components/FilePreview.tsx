import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Video, 
  Music, 
  Image, 
  Download,
  Eye,
  FileX,
  Loader2,
  Volume2,
  Play,
  Pause
} from 'lucide-react';
import { ContentFile } from '@/types/content';

interface FilePreviewProps {
  file: ContentFile;
  onRemove?: (fileId: string) => void;
  showActions?: boolean;
}

const FilePreview = ({ file, onRemove, showActions = true }: FilePreviewProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedContent, setExtractedContent] = useState<string>('');
  const [showContent, setShowContent] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes('video')) return Video;
    if (type.includes('audio')) return Music;
    if (type.includes('image')) return Image;
    return FileText;
  };

  const getFileTypeLabel = (type: string) => {
    if (type.includes('video')) return 'Vidéo';
    if (type.includes('audio')) return 'Audio';
    if (type.includes('image')) return 'Image';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('doc')) return 'Document';
    return 'Fichier';
  };

  const simulateContentExtraction = async () => {
    setIsProcessing(true);
    // Simulate content extraction/transcription
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (file.type.includes('audio') || file.type.includes('video')) {
      setExtractedContent(`Transcription automatique du fichier ${file.name}:\n\nCeci est une transcription simulée du contenu audio/vidéo. Dans un environnement réel, cette transcription serait générée par un service de reconnaissance vocale.\n\nPoints clés identifiés:\n- Concept principal abordé\n- Informations importantes\n- Recommandations pratiques`);
    } else if (file.type.includes('pdf') || file.type.includes('doc')) {
      setExtractedContent(`Contenu extrait du document ${file.name}:\n\nCeci est un extrait simulé du contenu textuel. Dans un environnement réel, le texte serait extrait directement du document.\n\nSections identifiées:\n- Introduction\n- Développement\n- Conclusion\n- Annexes`);
    } else {
      setExtractedContent(`Analyse du fichier ${file.name} terminée.\n\nType: ${file.type}\nTaille: ${file.size}\nFormat supporté pour l'extraction de contenu.`);
    }
    
    setIsProcessing(false);
    setShowContent(true);
  };

  const Icon = getFileIcon(file.type);
  const canExtractContent = file.type.includes('pdf') || file.type.includes('doc') || file.type.includes('audio') || file.type.includes('video');

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-base">{file.name}</CardTitle>
              <p className="text-sm text-gray-500">{getFileTypeLabel(file.type)} • {file.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{getFileTypeLabel(file.type)}</Badge>
            {showActions && (
              <>
                <Button variant="ghost" size="sm" onClick={() => window.open(file.url, '_blank')}>
                  <Download className="h-4 w-4" />
                </Button>
                {onRemove && (
                  <Button variant="ghost" size="sm" onClick={() => onRemove(file.id)}>
                    <FileX className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {file.description && (
          <div>
            <h4 className="text-sm font-medium mb-1">Description:</h4>
            <p className="text-sm text-gray-600">{file.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Auteur:</span> {file.author}
          </div>
          <div>
            <span className="font-medium">Téléchargé:</span> {new Date(file.uploadDate).toLocaleDateString()}
          </div>
          {file.duration && (
            <div>
              <span className="font-medium">Durée:</span> {file.duration}
            </div>
          )}
          {file.pages && (
            <div>
              <span className="font-medium">Pages:</span> {file.pages}
            </div>
          )}
        </div>

        {canExtractContent && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={simulateContentExtraction}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    {file.type.includes('audio') || file.type.includes('video') ? 'Transcrire' : 'Extraire le contenu'}
                  </>
                )}
              </Button>
              {extractedContent && (
                <Badge variant="secondary" className="text-green-600">
                  Contenu traité
                </Badge>
              )}
            </div>

            {showContent && extractedContent && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Contenu extrait:</h4>
                <Textarea
                  value={extractedContent}
                  onChange={(e) => setExtractedContent(e.target.value)}
                  rows={8}
                  className="text-sm"
                  placeholder="Le contenu extrait apparaîtra ici..."
                />
                <p className="text-xs text-gray-500">
                  Vous pouvez modifier ce contenu avant de l'utiliser dans votre formation.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilePreview;