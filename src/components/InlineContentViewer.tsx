import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Download,
  FileText,
  Video,
  AudioWaveform,
  Eye,
  Clock,
  User
} from 'lucide-react';
import UniversalDocumentViewer from '@/components/viewers/UniversalDocumentViewer';
import { ContentFile } from '@/types/content';

interface InlineContentViewerProps {
  contentFiles: ContentFile[];
  title?: string;
  description?: string;
  onComplete?: () => void;
  showProgress?: boolean;
}

const InlineContentViewer: React.FC<InlineContentViewerProps> = ({
  contentFiles,
  title = "Contenu de Formation",
  description,
  onComplete,
  showProgress = true
}) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<ContentFile | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewedFiles, setViewedFiles] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const currentFile = contentFiles[currentFileIndex];
  const progress = viewedFiles.size / contentFiles.length * 100;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'mp4':
      case 'webm':
      case 'avi':
        return <Video className="h-5 w-5" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <AudioWaveform className="h-5 w-5" />;
      case 'pdf':
      case 'docx':
      case 'pptx':
      case 'xlsx':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const isMediaFile = (type: string) => {
    return ['mp4', 'webm', 'avi', 'mp3', 'wav', 'ogg'].includes(type);
  };

  const isVideoFile = (type: string) => {
    return ['mp4', 'webm', 'avi'].includes(type);
  };

  const handleFileView = (file: ContentFile, index: number) => {
    setCurrentFileIndex(index);
    
    if (isMediaFile(file.type)) {
      // Handle inline media playback
      const newViewedFiles = new Set(viewedFiles);
      newViewedFiles.add(file.id);
      setViewedFiles(newViewedFiles);
    } else {
      // Handle document viewing in modal
      setSelectedFile(file);
      setIsViewerOpen(true);
      
      const newViewedFiles = new Set(viewedFiles);
      newViewedFiles.add(file.id);
      setViewedFiles(newViewedFiles);
    }
  };

  const handleDownloadFile = (file: ContentFile) => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    if (viewedFiles.size === contentFiles.length && onComplete) {
      onComplete();
    }
  };

  React.useEffect(() => {
    if (viewedFiles.size === contentFiles.length && showProgress) {
      handleComplete();
    }
  }, [viewedFiles.size, contentFiles.length, showProgress]);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
          
          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{viewedFiles.size}/{contentFiles.length} éléments vus</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content Viewer */}
          <div className="lg:col-span-2">
            {currentFile && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        {getFileIcon(currentFile.type)}
                        {currentFile.name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{currentFile.size}</span>
                        {currentFile.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {currentFile.duration}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {currentFile.author}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadFile(currentFile)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {viewedFiles.has(currentFile.id) && (
                        <Badge variant="secondary">Vu</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {isVideoFile(currentFile.type) ? (
                    // Video Player
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          className="w-full h-auto max-h-96"
                          controls
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        >
                          <source src={currentFile.url} type={`video/${currentFile.type}`} />
                          Votre navigateur ne supporte pas la lecture vidéo.
                        </video>
                      </div>
                    </div>
                  ) : currentFile.type === 'mp3' || currentFile.type === 'wav' || currentFile.type === 'ogg' ? (
                    // Audio Player
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 text-center">
                        <AudioWaveform className="h-16 w-16 mx-auto text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Contenu Audio</h3>
                        <p className="text-muted-foreground mb-4">{currentFile.name}</p>
                      </div>
                      
                      <audio
                        className="w-full"
                        controls
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      >
                        <source src={currentFile.url} type={`audio/${currentFile.type}`} />
                        Votre navigateur ne supporte pas la lecture audio.
                      </audio>
                    </div>
                  ) : (
                    // Document Preview
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-accent/50 to-accent/20 rounded-lg p-8 text-center">
                        {getFileIcon(currentFile.type)}
                        <h3 className="text-lg font-semibold mb-2 mt-4">Document {currentFile.type.toUpperCase()}</h3>
                        <p className="text-muted-foreground mb-4">{currentFile.description || "Cliquez pour voir le document"}</p>
                        <Button 
                          onClick={() => handleFileView(currentFile, currentFileIndex)}
                          className="moov-gradient text-white"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ouvrir le document
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Content List Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contenu de la Formation</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {contentFiles.map((file, index) => (
                      <div
                        key={file.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                          index === currentFileIndex 
                            ? 'bg-primary/10 border-primary/30' 
                            : 'border-border'
                        }`}
                        onClick={() => handleFileView(file, index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground truncate">
                              {file.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                            {file.duration && (
                              <p className="text-xs text-muted-foreground">
                                {file.duration}
                              </p>
                            )}
                          </div>
                          {viewedFiles.has(file.id) && (
                            <Badge variant="secondary" className="text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Completion Status */}
            {showProgress && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statut de Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(progress)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Complété</p>
                    </div>
                    
                    <Progress value={progress} className="h-2" />
                    
                    <div className="text-xs text-muted-foreground text-center">
                      {viewedFiles.size} sur {contentFiles.length} éléments consultés
                    </div>

                    {progress === 100 && onComplete && (
                      <Button 
                        onClick={onComplete}
                        className="w-full moov-gradient text-white"
                      >
                        Marquer comme terminé
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

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

export default InlineContentViewer;