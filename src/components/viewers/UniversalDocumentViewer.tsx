import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Save,
  Maximize,
  Minimize,
  FileText,
  Image,
  Video,
  Volume2,
  X,
  Search,
  Play,
  Pause,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { ContentFile, ViewerState } from '@/types/content';
import { useAuth } from "@/hooks/useAuthCompatibility";
import PDFViewer from './PDFViewer';
import OfficeViewer from './OfficeViewer';
import MediaPlayerViewer from './MediaPlayerViewer';
import ImageViewer from './ImageViewer';

interface UniversalDocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: ContentFile | null;
  onSave?: (file: ContentFile) => void;
  onDownload?: (file: ContentFile) => void;
}

const UniversalDocumentViewer = ({ 
  isOpen, 
  onClose, 
  file, 
  onSave, 
  onDownload 
}: UniversalDocumentViewerProps) => {
  const { hasPermission } = useAuth();
  const [viewerState, setViewerState] = useState<ViewerState>({
    zoom: 100,
    rotation: 0,
    currentPage: 1,
    totalPages: 1,
    fullscreen: false,
    loading: true,
    error: undefined
  });

  useEffect(() => {
    if (file && isOpen) {
      setViewerState(prev => ({ 
        ...prev, 
        loading: true, 
        error: undefined,
        zoom: 100,
        rotation: 0,
        currentPage: 1 
      }));
    }
  }, [file, isOpen]);

  const handleViewerStateChange = (newState: Partial<ViewerState>) => {
    setViewerState(prev => ({ ...prev, ...newState }));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
      case 'pptx':
      case 'txt':
        return <FileText className="h-6 w-6 text-destructive" />;
      case 'jpg':
      case 'png':
        return <Image className="h-6 w-6 text-primary" />;
      case 'mp4':
      case 'webm':
      case 'avi':
        return <Video className="h-6 w-6 text-accent" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <Volume2 className="h-6 w-6 text-secondary" />;
      default:
        return <FileText className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const renderViewer = () => {
    if (!file) return null;

    const commonProps = {
      file,
      viewerState,
      onViewerStateChange: handleViewerStateChange
    };

    switch (file.type) {
      case 'pdf':
        return <PDFViewer {...commonProps} />;
      case 'docx':
      case 'pptx':
        return <OfficeViewer {...commonProps} />;
      case 'mp4':
      case 'webm':
      case 'avi':
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <MediaPlayerViewer {...commonProps} />;
      case 'jpg':
      case 'png':
        return <ImageViewer {...commonProps} />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Format non supporté: {file.type}</p>
            </div>
          </div>
        );
    }
  };

  const shouldShowNavigation = () => {
    return file && ['pdf', 'pptx', 'docx'].includes(file.type) && viewerState.totalPages > 1;
  };

  const shouldShowZoomControls = () => {
    return file && ['pdf', 'jpg', 'png', 'docx', 'pptx'].includes(file.type);
  };

  const shouldShowRotationControls = () => {
    return file && ['pdf', 'jpg', 'png'].includes(file.type);
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${
        viewerState.fullscreen 
          ? 'max-w-screen max-h-screen w-full h-full p-0' 
          : 'max-w-7xl max-h-[95vh] w-[95vw]'
      } overflow-hidden`}>
        <DialogHeader className={`flex flex-row items-center justify-between pb-4 border-b ${
          viewerState.fullscreen ? 'px-6 pt-6' : ''
        }`}>
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
          
          {/* Document Controls */}
          <div className="flex items-center gap-2">
            {/* Navigation Controls */}
            {shouldShowNavigation() && (
              <div className="flex items-center gap-1 border-r pr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewerStateChange({ 
                    currentPage: Math.max(viewerState.currentPage - 1, 1) 
                  })}
                  disabled={viewerState.currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">
                  {viewerState.currentPage} / {viewerState.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewerStateChange({ 
                    currentPage: Math.min(viewerState.currentPage + 1, viewerState.totalPages) 
                  })}
                  disabled={viewerState.currentPage === viewerState.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Zoom Controls */}
            {shouldShowZoomControls() && (
              <div className="flex items-center gap-1 border-r pr-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleViewerStateChange({ 
                    zoom: Math.max(viewerState.zoom - 25, 25) 
                  })}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">{viewerState.zoom}%</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleViewerStateChange({ 
                    zoom: Math.min(viewerState.zoom + 25, 300) 
                  })}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Rotation Controls */}
            {shouldShowRotationControls() && (
              <div className="flex items-center gap-1 border-r pr-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleViewerStateChange({ 
                    rotation: (viewerState.rotation - 90 + 360) % 360 
                  })}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleViewerStateChange({ 
                    rotation: (viewerState.rotation + 90) % 360 
                  })}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Action Controls */}
            <div className="flex items-center gap-1">
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleViewerStateChange({ fullscreen: !viewerState.fullscreen })}
              >
                {viewerState.fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className={`flex-1 ${viewerState.fullscreen ? 'px-6 pb-6' : 'p-4'} overflow-hidden`}>
          {renderViewer()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UniversalDocumentViewer;