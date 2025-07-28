import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download,
  Save,
  Maximize,
  Minimize,
  FileText,
  Image,
  Video,
  Music
} from 'lucide-react';
import { ContentFile } from '@/types/content';
import { useAuth } from '@/contexts/AuthContext';
import PDFViewer from '@/components/viewers/PDFViewer';
import MediaPlayer from '@/components/viewers/MediaPlayer';
import OfficeViewer from '@/components/viewers/OfficeViewer';
import ImageViewer from '@/components/viewers/ImageViewer';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: ContentFile | null;
  onSave?: (file: ContentFile) => void;
  onDownload?: (file: ContentFile) => void;
}

const DocumentViewer = ({ isOpen, onClose, file, onSave, onDownload }: DocumentViewerProps) => {
  const { hasPermission } = useAuth();
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen(prev => !prev);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
      case 'pptx':
      case 'xlsx':
      case 'txt':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'jpg':
      case 'png':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'mp4':
      case 'webm':
      case 'avi':
        return <Video className="h-6 w-6 text-purple-500" />;
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'ogg':
        return <Music className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const renderDocumentContent = () => {
    if (!file) return null;

    const { type, url, name } = file;

    switch (type) {
      case 'pdf':
        return (
          <PDFViewer 
            url={url} 
            fileName={name}
            onDownload={onDownload ? () => onDownload(file) : undefined}
          />
        );
      
      case 'mp4':
      case 'webm':
      case 'avi':
        return (
          <MediaPlayer 
            url={url} 
            type="video" 
            fileName={name}
            poster={file.thumbnailUrl}
            onDownload={onDownload ? () => onDownload(file) : undefined}
          />
        );
      
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'ogg':
        return (
          <MediaPlayer 
            url={url} 
            type="audio" 
            fileName={name}
            onDownload={onDownload ? () => onDownload(file) : undefined}
          />
        );
      
      case 'docx':
      case 'pptx':
      case 'xlsx':
        return (
          <OfficeViewer 
            url={url} 
            type={type as 'docx' | 'pptx' | 'xlsx'} 
            fileName={name}
            onDownload={onDownload ? () => onDownload(file) : undefined}
          />
        );
      
      case 'jpg':
      case 'png':
        return (
          <ImageViewer 
            url={url} 
            fileName={name}
            onDownload={onDownload ? () => onDownload(file) : undefined}
          />
        );
      
      default:
        return (
          <div className="flex items-center justify-center min-h-[400px] bg-muted/50 rounded-lg">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Format non supporté: {type}</p>
              <p className="text-sm text-muted-foreground mt-2">
                <a href={url} download className="text-primary hover:underline">
                  Télécharger le fichier
                </a>
              </p>
            </div>
          </div>
        );
    }
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${fullscreen ? 'max-w-screen max-h-screen w-full h-full' : 'max-w-6xl max-h-[90vh]'} overflow-hidden`}>
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            {getFileIcon(file.type)}
            <div>
              <DialogTitle className="text-lg font-semibold">{file.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{file.type.toUpperCase()}</Badge>
                <span className="text-sm text-muted-foreground">{file.size}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">Par {file.author}</span>
              </div>
            </div>
          </div>
          
          {/* Global Controls */}
          <div className="flex items-center gap-2">
            {hasPermission('manage_files') && onSave && (
              <Button variant="ghost" size="sm" onClick={() => onSave(file)}>
                <Save className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('download_files') && onDownload && (
              <Button variant="ghost" size="sm" onClick={() => onDownload(file)}>
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {renderDocumentContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;