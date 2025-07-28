import { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { ContentFile, ViewerState } from '@/types/content';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: ContentFile | null;
  onSave?: (file: ContentFile) => void;
  onDownload?: (file: ContentFile) => void;
}

const DocumentViewer = ({ isOpen, onClose, file, onSave, onDownload }: DocumentViewerProps) => {
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
      loadDocument(file);
    }
  }, [file, isOpen]);

  const loadDocument = async (file: ContentFile) => {
    setViewerState(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      // Simulate document loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let totalPages = 1;
      if (file.type === 'pdf') totalPages = file.pages || Math.floor(Math.random() * 20) + 5;
      if (file.type === 'pptx') totalPages = Math.floor(Math.random() * 15) + 3;
      if (file.type === 'docx') totalPages = Math.floor(Math.random() * 25) + 1;

      setViewerState(prev => ({
        ...prev,
        loading: false,
        totalPages,
        currentPage: 1,
        zoom: 100,
        rotation: 0
      }));
    } catch (error) {
      setViewerState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors du chargement du document'
      }));
    }
  };

  const handleZoomIn = () => {
    setViewerState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 25, 300) }));
  };

  const handleZoomOut = () => {
    setViewerState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 25, 25) }));
  };

  const handlePreviousPage = () => {
    setViewerState(prev => ({ 
      ...prev, 
      currentPage: Math.max(prev.currentPage - 1, 1) 
    }));
  };

  const handleNextPage = () => {
    setViewerState(prev => ({ 
      ...prev, 
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages) 
    }));
  };

  const handleRotateRight = () => {
    setViewerState(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const handleRotateLeft = () => {
    setViewerState(prev => ({ ...prev, rotation: (prev.rotation - 90 + 360) % 360 }));
  };

  const toggleFullscreen = () => {
    setViewerState(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
      case 'txt':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'jpg':
      case 'png':
        return <Image className="h-6 w-6 text-blue-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const renderRealContent = (file: ContentFile) => {
    const { type, url } = file;
    
    switch (type) {
      case 'pdf':
        return (
          <div className="w-full h-[600px]">
            <iframe 
              src={url}
              className="w-full h-full border rounded-lg"
              title={file.name}
            />
          </div>
        );
      
      case 'mp4':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <video 
              controls 
              className="w-full h-auto rounded-lg shadow-lg"
              poster="/placeholder.svg"
            >
              <source src={url} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        );
      
      case 'docx':
      case 'pptx':
        return (
          <div className="w-full h-[600px]">
            <iframe 
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + url)}`}
              className="w-full h-full border rounded-lg"
              title={file.name}
            />
          </div>
        );
      
      case 'jpg':
      case 'png':
        return (
          <div className="flex items-center justify-center">
            <img 
              src={url} 
              alt={file.name}
              className="max-w-full max-h-[600px] rounded-lg shadow-lg"
            />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Format non supporté: {type}</p>
              <p className="text-sm text-gray-500 mt-2">
                <a href={url} download className="text-blue-600 hover:underline">
                  Télécharger le fichier
                </a>
              </p>
            </div>
          </div>
        );
    }
  };

  const renderDocumentContent = () => {
    if (viewerState.loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du document...</p>
          </div>
        </div>
      );
    }

    if (viewerState.error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center text-red-600">
            <X className="h-12 w-12 mx-auto mb-4" />
            <p>{viewerState.error}</p>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="transition-all duration-300 origin-center"
        style={{
          transform: `scale(${viewerState.zoom / 100}) rotate(${viewerState.rotation}deg)`,
        }}
      >
        {file && renderRealContent(file)}
      </div>
    );
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${viewerState.fullscreen ? 'max-w-screen max-h-screen w-full h-full' : 'max-w-6xl max-h-[90vh]'} overflow-hidden`}>
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            {getFileIcon(file.type)}
            <div>
              <DialogTitle className="text-lg font-semibold">{file.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{file.type.toUpperCase()}</Badge>
                <span className="text-sm text-gray-500">{file.size}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Par {file.author}</span>
              </div>
            </div>
          </div>
          
          {/* Document Controls */}
          <div className="flex items-center gap-2">
            {/* Navigation Controls */}
            {file.type !== 'jpg' && file.type !== 'png' && viewerState.totalPages > 1 && (
              <div className="flex items-center gap-1 border-r pr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousPage}
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
                  onClick={handleNextPage}
                  disabled={viewerState.currentPage === viewerState.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">{viewerState.zoom}%</span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Rotation Controls */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button variant="ghost" size="sm" onClick={handleRotateLeft}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRotateRight}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            
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
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {viewerState.fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          {renderDocumentContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;