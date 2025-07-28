import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  Maximize,
  Minimize,
  Download,
  Image as ImageIcon
} from 'lucide-react';

interface ImageViewerProps {
  url: string;
  fileName: string;
  onDownload?: () => void;
}

const ImageViewer = ({ url, fileName, onDownload }: ImageViewerProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.25));
  };

  const rotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const rotateLeft = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
  };

  const resetView = () => {
    setScale(1);
    setRotation(0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError('');
  };

  const handleImageError = () => {
    setLoading(false);
    setError('Erreur lors du chargement de l\'image');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de l'image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-destructive">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.open(url, '_blank')}>
            Ouvrir dans un nouvel onglet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-sm">{fileName}</h3>
            <Badge variant="outline" className="text-xs mt-1">Image</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="text-xs px-2">
            {Math.round(scale * 100)}%
          </Badge>
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          {/* Rotation Controls */}
          <Button variant="ghost" size="sm" onClick={rotateLeft}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={rotateRight}>
            <RotateCw className="h-4 w-4" />
          </Button>
          
          {/* Reset */}
          <Button variant="ghost" size="sm" onClick={resetView}>
            Reset
          </Button>
          
          {/* Fullscreen */}
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          
          {/* Download */}
          {onDownload && (
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Image Display */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative'} flex items-center justify-center p-4 bg-muted/30 rounded-b-lg min-h-[500px] overflow-auto`}>
        {isFullscreen && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-10"
          >
            <Minimize className="h-4 w-4" />
          </Button>
        )}
        
        <img
          src={url}
          alt={fileName}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="max-w-none shadow-lg transition-transform duration-200"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            maxWidth: isFullscreen ? 'none' : '100%',
            maxHeight: isFullscreen ? 'calc(100vh - 8rem)' : '70vh',
          }}
        />
      </div>
    </div>
  );
};

export default ImageViewer;