import { useState, useRef, useEffect } from 'react';
import { ContentFile, ViewerState } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RotateCw, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface ImageViewerProps {
  file: ContentFile;
  viewerState: ViewerState;
  onViewerStateChange: (state: Partial<ViewerState>) => void;
}

const ImageViewer = ({ file, viewerState, onViewerStateChange }: ImageViewerProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    onViewerStateChange({ loading: true });
  }, [file.url]);

  const handleImageLoad = () => {
    setIsLoading(false);
    onViewerStateChange({ loading: false });
    // Reset position when image loads
    setImagePosition({ x: 0, y: 0 });
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError('Erreur lors du chargement de l\'image');
    onViewerStateChange({ 
      loading: false, 
      error: 'Impossible de charger l\'image. Vérifiez que le fichier est accessible.' 
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewerState.zoom > 100) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && viewerState.zoom > 100) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -25 : 25;
    const newZoom = Math.max(25, Math.min(500, viewerState.zoom + delta));
    onViewerStateChange({ zoom: newZoom });
    
    // Reset position when zooming out to 100% or less
    if (newZoom <= 100) {
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const resetView = () => {
    onViewerStateChange({ zoom: 100, rotation: 0 });
    setImagePosition({ x: 0, y: 0 });
  };

  const fitToScreen = () => {
    if (!imageRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const img = imageRef.current;
    
    const containerWidth = container.clientWidth - 40; // padding
    const containerHeight = container.clientHeight - 40; // padding
    const imageWidth = img.naturalWidth;
    const imageHeight = img.naturalHeight;
    
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY, 1) * 100; // Don't zoom in beyond 100%
    
    onViewerStateChange({ zoom: Math.max(25, scale) });
    setImagePosition({ x: 0, y: 0 });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-destructive">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Image Controls */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewerStateChange({ zoom: Math.max(25, viewerState.zoom - 25) })}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{Math.round(viewerState.zoom)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewerStateChange({ zoom: Math.min(500, viewerState.zoom + 25) })}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fitToScreen}>
            Ajuster à l'écran
          </Button>
          <Button variant="outline" size="sm" onClick={resetView}>
            Réinitialiser
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewerStateChange({ 
              rotation: (viewerState.rotation - 90 + 360) % 360 
            })}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewerStateChange({ 
              rotation: (viewerState.rotation + 90) % 360 
            })}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden bg-muted/10 relative"
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement de l'image...</p>
            </div>
          </div>
        )}

        <div className="w-full h-full flex items-center justify-center p-4">
          <img
            ref={imageRef}
            src={file.url}
            alt={file.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            onMouseDown={handleMouseDown}
            className={`max-w-none transition-transform duration-200 ${
              isDragging ? 'cursor-grabbing' : viewerState.zoom > 100 ? 'cursor-grab' : 'cursor-default'
            }`}
            style={{
              transform: `
                translate(${imagePosition.x}px, ${imagePosition.y}px) 
                scale(${viewerState.zoom / 100}) 
                rotate(${viewerState.rotation}deg)
              `,
              userSelect: 'none',
              pointerEvents: isLoading ? 'none' : 'auto',
            }}
            draggable={false}
          />
        </div>

        {/* Drag hint */}
        {viewerState.zoom > 100 && !isDragging && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Move className="h-3 w-3" />
            Glisser pour déplacer
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;